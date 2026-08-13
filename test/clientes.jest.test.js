const assert = require('node:assert');
const http = require('node:http');
const { spawn } = require('node:child_process');

const PORT = 5598;

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

let server;
beforeAll(async () => {
  server = spawn('node', ['server.js'], { cwd: __dirname + '/..', env: { ...process.env, PORT } });
  await new Promise((r) => setTimeout(r, 600));
});
afterAll(() => server.kill());

test('lista clientes seed', async () => {
  const res = await request('GET', '/api/clientes');
  expect(res.status).toBe(200);
  expect(res.body.length).toBe(2);
});

test('cria e remove cliente', async () => {
  const created = await request('POST', '/api/clientes', { nome: 'Jest QA', email: 'jest@example.com' });
  expect(created.status).toBe(201);
  const removed = await request('DELETE', `/api/clientes/${created.body.id}`);
  expect(removed.status).toBe(204);
});
