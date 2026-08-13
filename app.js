const form = document.getElementById('form-novo-cliente');
const nomeInput = document.querySelector('[data-testid="cliente-nome-input"]');
const emailInput = document.querySelector('[data-testid="cliente-email-input"]');
const lista = document.getElementById('lista-clientes');

async function fetchClientes() {
  const res = await fetch('/api/clientes');
  return res.json();
}

function render(clientes) {
  lista.innerHTML = '';
  for (const c of clientes) {
    const li = document.createElement('li');
    li.className = c.ativo ? '' : 'inativo';

    const toggle = document.createElement('input');
    toggle.type = 'checkbox';
    toggle.checked = c.ativo;
    toggle.setAttribute('aria-label', 'Marcar cliente ativo');
    toggle.addEventListener('change', () => updateCliente(c.id, { ativo: toggle.checked }));

    const nome = document.createElement('span');
    nome.className = 'nome';
    nome.textContent = c.nome;

    const email = document.createElement('span');
    email.className = 'email';
    email.textContent = c.email;

    const editBtn = document.createElement('button');
    editBtn.id = `edit-btn-${c.id}`;
    editBtn.textContent = 'Editar';
    editBtn.addEventListener('click', () => startEdit(li, c));

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remover';
    removeBtn.addEventListener('click', () => removeCliente(c.id));

    li.append(toggle, nome, email, editBtn, removeBtn);
    lista.appendChild(li);
  }
}

function startEdit(li, cliente) {
  li.innerHTML = '';
  const input = document.createElement('input');
  input.value = cliente.nome;
  const saveBtn = document.createElement('button');
  saveBtn.textContent = 'Salvar';
  const cancelBtn = document.createElement('button');
  cancelBtn.textContent = 'Cancelar';

  saveBtn.addEventListener('click', () => updateCliente(cliente.id, { nome: input.value }));
  cancelBtn.addEventListener('click', refresh);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') saveBtn.click(); });

  li.append(input, saveBtn, cancelBtn);
}

async function addCliente(nome, email) {
  await fetch('/api/clientes', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email }),
  });
  refresh();
}

async function updateCliente(id, patch) {
  await fetch(`/api/clientes/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch),
  });
  refresh();
}

async function removeCliente(id) {
  await fetch(`/api/clientes/${id}`, { method: 'DELETE' });
  refresh();
}

async function refresh() {
  render(await fetchClientes());
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  if (!nomeInput.value.trim() || !emailInput.value.trim()) return;
  addCliente(nomeInput.value.trim(), emailInput.value.trim());
  nomeInput.value = '';
  emailInput.value = '';
});

refresh();
