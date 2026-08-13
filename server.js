const express = require('express');
const path = require('path');

function seedDefaults() {
  return [
    { id: 1, nome: 'Ana Souza', email: 'ana@example.com', ativo: true },
    { id: 2, nome: 'Bruno Lima', email: 'bruno@example.com', ativo: false },
  ];
}

let clientes = seedDefaults();
let nextId = 3;

const app = express();
app.use(express.json());
app.use(express.static(__dirname));

app.post('/api/reset', (req, res) => {
  clientes = seedDefaults();
  nextId = 3;
  res.json(clientes);
});

app.get('/api/clientes', (req, res) => {
  res.json(clientes);
});

app.post('/api/clientes', (req, res) => {
  const nome = String(req.body?.nome ?? '').trim();
  const email = String(req.body?.email ?? '').trim();
  if (!nome || !email) return res.status(400).json({ error: 'nome e email são obrigatórios' });

  const cliente = { id: nextId++, nome, email, ativo: true };
  clientes.push(cliente);
  res.status(201).json(cliente);
});

app.put('/api/clientes/:id', (req, res) => {
  const id = Number(req.params.id);
  const cliente = clientes.find((c) => c.id === id);
  if (!cliente) return res.status(404).json({ error: 'not found' });

  if (req.body?.nome !== undefined) cliente.nome = String(req.body.nome).trim();
  if (req.body?.email !== undefined) cliente.email = String(req.body.email).trim();
  if (req.body?.ativo !== undefined) cliente.ativo = !!req.body.ativo;

  res.json(cliente);
});

app.delete('/api/clientes/:id', (req, res) => {
  clientes = clientes.filter((c) => c.id !== Number(req.params.id));
  res.status(204).end();
});

const PORT = process.env.PORT || 5501;
app.listen(PORT, () => console.log(`sentinel-qa-internal-app listening on :${PORT}`));
