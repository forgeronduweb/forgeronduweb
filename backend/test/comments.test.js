process.env.NODE_ENV = 'test';
process.env.TEST_DB_SUFFIX = 'comments';

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

test('like then unlike an article increments then decrements the count', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const likeRes = await fetch(`${base}/api/articles/ai-stackoverflow/like`, { method: 'POST' });
    assert.equal(likeRes.status, 200);
    const { likes } = await likeRes.json();
    assert.equal(likes, 1);

    const unlikeRes = await fetch(`${base}/api/articles/ai-stackoverflow/like`, { method: 'DELETE' });
    assert.equal(unlikeRes.status, 200);
    const { likes: afterUnlike } = await unlikeRes.json();
    assert.equal(afterUnlike, 0);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('like on unknown article returns 404', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const response = await fetch(`${base}/api/articles/does-not-exist/like`, { method: 'POST' });
    assert.equal(response.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('sharing an article increments the share count', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const response = await fetch(`${base}/api/articles/ai-stackoverflow/share`, { method: 'POST' });
    assert.equal(response.status, 200);
    const { shares } = await response.json();
    assert.equal(shares, 1);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('a posted comment is hidden until approved, then visible', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const postRes = await fetch(`${base}/api/articles/ai-stackoverflow/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Visiteur', message: 'Super article !' })
    });
    assert.equal(postRes.status, 201);

    const publicListBefore = await fetch(`${base}/api/articles/ai-stackoverflow/comments`);
    const { comments: beforeApproval } = await publicListBefore.json();
    assert.equal(beforeApproval.length, 0);

    const token = await login(base);
    const adminListRes = await fetch(`${base}/api/admin/comments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const { comments: adminComments } = await adminListRes.json();
    const pending = adminComments.find(c => c.message === 'Super article !');
    assert.ok(pending);
    assert.equal(pending.approved, false);
    assert.equal(pending.articleTitle, adminComments[0].articleTitle);

    const approveRes = await fetch(`${base}/api/admin/comments/${pending.id}/approve`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` }
    });
    assert.equal(approveRes.status, 200);

    const publicListAfter = await fetch(`${base}/api/articles/ai-stackoverflow/comments`);
    const { comments: afterApproval } = await publicListAfter.json();
    assert.equal(afterApproval.length, 1);
    assert.equal(afterApproval[0].message, 'Super article !');

    const deleteRes = await fetch(`${base}/api/admin/comments/${pending.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    assert.equal(deleteRes.status, 200);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('comment moderation routes reject requests without a token', async () => {
  const server = app.listen(0);
  const { port } = server.address();
  const base = `http://127.0.0.1:${port}`;

  try {
    const response = await fetch(`${base}/api/admin/comments`);
    assert.equal(response.status, 401);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
