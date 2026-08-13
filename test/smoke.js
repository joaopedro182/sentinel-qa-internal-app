const assert = require('node:assert');
const http = require('node:http');
const { spawn } = require('node:child_process');

const PORT = 5599;

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const req = http.request(
      { host: 'localhost', port: PORT, path, method, headers: data ? { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) } : {} },
      (res) => {
        let chunks = '';
        res.on('data', (c) => (chunks += c));
        res.on('end', () => resolve({ status: res.statusCode, body: chunks ? JSON.parse(chunks) : null }));
      },
    );
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function main() {
  const server = spawn('node', ['server.js'], { cwd: __dirname + '/..', env: { ...process.env, PORT } });
  await new Promise((r) => setTimeout(r, 500));

  try {
    const list = await request('GET', '/api/clientes');
    assert.strictEqual(list.status, 200);
    assert.strictEqual(list.body.length, 2);

    const created = await request('POST', '/api/clientes', { nome: 'Teste QA', email: 'qa@example.com' });
    assert.strictEqual(created.status, 201);

    const updated = await request('PUT', `/api/clientes/${created.body.id}`, { ativo: false });
    assert.strictEqual(updated.body.ativo, false);

    const removed = await request('DELETE', `/api/clientes/${created.body.id}`);
    assert.strictEqual(removed.status, 204);

    console.log('smoke: OK (4/4 assertions)');
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error('smoke: FAIL', err);
  process.exit(1);
});
