const API_URL = "http://localhost:3000/api/users";

const userForm = document.getElementById("userForm");
const usersList = document.getElementById("usersList");
const formMessage = document.getElementById("formMessage");
const usersMessage = document.getElementById("usersMessage");

function showMessage(element, message, type) {
  element.innerHTML = `<p class="${type}">${message}</p>`;

  setTimeout(() => {
    element.innerHTML = "";
  }, 4000);
}

function clearForm() {
  userForm.reset();
}

function createUserCard(user) {
  return `
    <div class="user-card">
      <h3>${user.name}</h3>
      <p><strong>ID:</strong> ${user.id}</p>
      <p><strong>E-mail:</strong> ${user.email}</p>
      <p><strong>Idade:</strong> ${user.age} anos</p>
    </div>
  `;
}

async function loadUsers() {
  try {
    usersList.innerHTML = "<p>Carregando usuários...</p>";

    const response = await fetch(API_URL);
    const data = await response.json();

    if (!response.ok) {
      usersList.innerHTML = "<p>Erro ao carregar usuários.</p>";
      return;
    }

    if (!data.data.length) {
      usersList.innerHTML = "<p>Nenhum usuário cadastrado.</p>";
      return;
    }

    usersList.innerHTML = data.data.map(createUserCard).join("");
    usersMessage.innerHTML = `<p class="success">${data.count} usuário(s) cadastrado(s).</p>`;
  } catch {
    usersList.innerHTML = "<p>Erro de conexão com o servidor.</p>";
  }
}

userForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = {
    name: document.getElementById("name").value.trim(),
    email: document.getElementById("email").value.trim(),
    age: Number(document.getElementById("age").value)
  };

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      showMessage(formMessage, data.message, "error");
      return;
    }

    showMessage(formMessage, data.message, "success");
    clearForm();
    loadUsers();
  } catch {
    showMessage(formMessage, "Erro ao conectar com o servidor.", "error");
  }
});

document.addEventListener("DOMContentLoaded", loadUsers);