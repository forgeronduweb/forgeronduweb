process.env.NODE_ENV = 'test';
process.env.TEST_DB_SUFFIX = 'messages';

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

test('POST /api/contact persists the message', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const postRes = await fetch(`${base}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Client', email: 'client@test.com', subject: 'Mission', message: 'Bonjour !' })
    });
    assert.equal(postRes.status, 200);

    const token = await login(base);
    const listRes = await fetch(`${base}/api/admin/messages`, { headers: { Authorization: `Bearer ${token}` } });
    const { messages } = await listRes.json();
    const found = messages.find(m => m.subject === 'Mission');
    assert.ok(found);
    assert.equal(found.read, false);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('admin can mark a message as read and delete it', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    await fetch(`${base}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Client 2', email: 'client2@test.com', subject: 'Collab', message: 'Salut' })
    });

    const token = await login(base);
    const listRes = await fetch(`${base}/api/admin/messages`, { headers: { Authorization: `Bearer ${token}` } });
    const { messages } = await listRes.json();
    const target = messages.find(m => m.subject === 'Collab');
    assert.ok(target);

    const readRes = await fetch(`${base}/api/admin/messages/${target.id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    assert.equal(readRes.status, 200);
    const { message: updated } = await readRes.json();
    assert.equal(updated.read, true);

    const deleteRes = await fetch(`${base}/api/admin/messages/${target.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    assert.equal(deleteRes.status, 200);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('messages routes reject requests without a token', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const response = await fetch(`${base}/api/admin/messages`);
    assert.equal(response.status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
