process.env.NODE_ENV = 'test';
process.env.TEST_DB_SUFFIX = 'server';

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

test('GET /api/portfolio returns portfolio data', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/portfolio`);
    assert.equal(response.status, 200);

    const body = await response.json();
    assert.ok(body.profile);
    assert.ok(Array.isArray(body.projects));
    assert.ok(Array.isArray(body.articles));
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('POST /api/contact returns 400 for malformed JSON', async () => {
  const server = app.listen(0);
  const { port } = server.address();

  try {
    const response = await fetch(`http://127.0.0.1:${port}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{invalid-json}'
    });

    assert.equal(response.status, 400);
    const body = await response.json();
    assert.equal(body.ok, false);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
