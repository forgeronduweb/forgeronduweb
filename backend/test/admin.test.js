process.env.NODE_ENV = 'test';
process.env.TEST_DB_SUFFIX = 'admin';

const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const { app, connectDB } = require('../server');
const { seedIfEmpty } = require('../data/seed');

test.before(async () => {
  await connectDB();
  await seedIfEmpty();
});

test.after(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
});

async function login(base) {
  const response = await fetch(`${base}/api/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: process.env.ADMIN_PASSWORD })
  });
  const body = await response.json();
  return body.token;
}

test('POST /api/admin/login rejects wrong password', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const response = await fetch(`${base}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrong-password' })
    });
    assert.equal(response.status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('protected routes reject requests without a token', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const response = await fetch(`${base}/api/admin/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test', description: 'Test' })
    });
    assert.equal(response.status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('admin can create, update and delete a project', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const token = await login(base);
    assert.ok(token);

    const createRes = await fetch(`${base}/api/admin/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: 'Projet Test', description: 'Description test' })
    });
    assert.equal(createRes.status, 201);
    const { project } = await createRes.json();
    assert.equal(project.name, 'Projet Test');

    const updateRes = await fetch(`${base}/api/admin/projects/${project.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: 'Projet Test', description: 'Description mise à jour', status: 'Live' })
    });
    assert.equal(updateRes.status, 200);
    const { project: updated } = await updateRes.json();
    assert.equal(updated.status, 'Live');

    const deleteRes = await fetch(`${base}/api/admin/projects/${project.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    assert.equal(deleteRes.status, 200);

    const getRes = await fetch(`${base}/api/portfolio`);
    const data = await getRes.json();
    assert.ok(!data.projects.some((p) => p.id === project.id));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('admin can create, update and delete an article', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const token = await login(base);

    const createRes = await fetch(`${base}/api/admin/articles`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Article Test', excerpt: 'Extrait test' })
    });
    assert.equal(createRes.status, 201);
    const { article } = await createRes.json();
    assert.equal(article.published, false);

    const updateRes = await fetch(`${base}/api/admin/articles/${article.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: 'Article Test', excerpt: 'Extrait test', published: true })
    });
    assert.equal(updateRes.status, 200);
    const { article: updated } = await updateRes.json();
    assert.equal(updated.published, true);

    const deleteRes = await fetch(`${base}/api/admin/articles/${article.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    assert.equal(deleteRes.status, 200);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
