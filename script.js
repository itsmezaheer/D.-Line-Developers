const form = document.getElementById('userForm');
const formTitle = document.getElementById('formTitle');
const switchText = document.getElementById('switchText');
const loginBtn = document.getElementById('loginBtn');
const signupBtn = document.getElementById('signupBtn');
const storageData = document.getElementById('storageData');
const clearBtn = document.getElementById('clearBtn');
const statusMsg = document.getElementById('statusMsg');

let isLogin = true;


function updateForm() {
  formTitle.textContent = isLogin ? 'Login to Aerocare+' : 'Create an Aerocare+ Account';
  switchText.innerHTML = isLogin
    ? 'Don’t have an account? <span id="switchLink" class="text-blue-400 cursor-pointer hover:underline">Sign up</span>'
    : 'Already have an account? <span id="switchLink" class="text-blue-400 cursor-pointer hover:underline">Login</span>';

  document.getElementById('switchLink').addEventListener('click', toggleForm);
}

function toggleForm() {
  isLogin = !isLogin;
  updateForm();
}


signupBtn.addEventListener('click', () => {
  isLogin = false;
  updateForm();
  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
});

loginBtn.addEventListener('click', () => {
  isLogin = true;
  updateForm();
  document.getElementById('form-section').scrollIntoView({ behavior: 'smooth' });
});


function getUsers() {
  return JSON.parse(localStorage.getItem('AerocareUsers') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('AerocareUsers', JSON.stringify(users));
}


function loadStorageData() {
  if (!storageData) return;

  const users = getUsers();
  storageData.innerHTML = '';

  if (users.length === 0) {
    storageData.innerHTML = `<tr><td colspan="3" class="py-4 text-center text-gray-400">No users found in local storage.</td></tr>`;
    return;
  }

  users.forEach(user => {
    storageData.innerHTML += `
      <tr class="border-b border-gray-700">
        <td class="py-2 px-3">${user.email}</td>
        <td class="py-2 px-3">${user.username}</td>
        <td class="py-2 px-3">${user.password}</td>
      </tr>`;
  });
}


form.addEventListener('submit', (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim().toLowerCase();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    alert('Please fill all required fields.');
    return;
  }

  let users = getUsers();

  if (isLogin) {
   
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      localStorage.setItem('currentUser', JSON.stringify(found));
      alert(`Welcome back, ${found.username}! Redirecting to your dashboard...`);
      window.location.href = 'dashboard.html';
    } else {
      alert('Invalid email or password!');
    }
  } else {

    const exists = users.some(u => u.email === email);
    if (exists) {
      alert('User already exists! Please log in.');
      return;
    }

    const newUser = { username, email, password };
    users.push(newUser);
    saveUsers(users);
    localStorage.setItem('currentUser', JSON.stringify(newUser));

    alert('Account created successfully! Proceeding to calibration...');
    window.location.href = 'calibration.html';
  }

  form.reset();
  loadStorageData();
});


if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('AerocareUsers');
    localStorage.removeItem('currentUser');
    loadStorageData();
    statusMsg.textContent = 'All local storage data cleared!';
    setTimeout(() => (statusMsg.textContent = ''), 3000);
  });
}
updateForm();
loadStorageData();
