/* ==================== AUTHENTICATION ==================== */
// Initialize email history on load
initEmailHistory();

// Login protection - runs on page load
(function checkAuth() {
  const publicPages = ['index.html', 'signup.html', 'success.html'];
  const currentPage = window.location.pathname.split('/').pop() || 'home.html';
  
  if (localStorage.getItem(CONFIG.STORAGE_KEYS.LOGGED_IN) !== "true" && !publicPages.includes(currentPage)) {
    window.location.href = "index.html";
  }
  
  if (localStorage.getItem(CONFIG.STORAGE_KEYS.LOGGED_IN) === "true" && publicPages.includes(currentPage)) {
    if (currentPage !== 'success.html') {
      window.location.href = "home.html";
    }
  }
})();

function loadProfile() {
  const usernameEl = document.getElementById('username');
  const emailEl = document.getElementById('email');
  const profilePicEl = document.getElementById('profilePic');
  
  if (usernameEl) {
    usernameEl.innerText = localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME) || "Username";
  }
  
  if (emailEl) {
    emailEl.innerText = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL) || "email@example.com";
  }
  
  if (profilePicEl) {
    const savedPic = localStorage.getItem(CONFIG.STORAGE_KEYS.PROFILE_PIC);
    profilePicEl.src = savedPic || CONFIG.DEFAULT_PROFILE_PIC;
  }
}

function toggleProfile() {
  const profile = document.getElementById('profile');
  if (profile) {
    profile.classList.toggle('active');
    if (profile.classList.contains('active') && typeof loadUserProducts === 'function') {
      loadUserProducts();
    }
  }
}

function toggleCart() {
  document.getElementById('cart')?.classList.toggle('active');
}

function enterEditMode() {
  document.getElementById('viewMode').style.display = 'none';
  document.getElementById('editMode').style.display = 'block';
  document.querySelector('.edit-btn-top').style.display = 'none';
  document.getElementById('myProducts').style.display = 'none';
  
  document.getElementById('editUsername').value = localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME) || '';
  document.getElementById('editEmail').value = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL) || '';
}

function cancelEdit() {
  document.getElementById('viewMode').style.display = 'block';
  document.getElementById('editMode').style.display = 'none';
  document.querySelector('.edit-btn-top').style.display = 'block';
  document.getElementById('myProducts').style.display = 'block';
}

function saveProfile() {
  const newUsername = document.getElementById('editUsername').value.trim();
  const newEmail = document.getElementById('editEmail').value.trim();
  
  if (!newUsername || !newEmail) {
    alert('Please fill in all fields.');
    return;
  }
  
  const currentEmail = localStorage.getItem(CONFIG.STORAGE_KEYS.EMAIL);
  const currentUsername = localStorage.getItem(CONFIG.STORAGE_KEYS.USERNAME);
  
  // Update users array
  const users = safeJSONParse(CONFIG.STORAGE_KEYS.USERS, []);
  const userIndex = users.findIndex(u => u.email === currentEmail);
  
  if (userIndex !== -1) {
    users[userIndex].username = newUsername;
    users[userIndex].email = newEmail;
    localStorage.setItem(CONFIG.STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  
  // IMPORTANT: DO NOT transfer products to new email
  // Products stay with the original email that created them
  
  // Update session with NEW email
  localStorage.setItem(CONFIG.STORAGE_KEYS.USERNAME, newUsername);
  localStorage.setItem(CONFIG.STORAGE_KEYS.EMAIL, newEmail);
  
  loadProfile();
  cancelEdit();
  
  if (typeof loadUserProducts === 'function') {
    loadUserProducts(); // This will show NO products because new email has none
  }
  if (typeof display === 'function') {
    display(products);
  }
  
  alert(`Profile updated to ${newEmail}. Your products are still with your old email.`);
}

function previewImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const validation = validateImage(file);
  if (!validation.valid) {
    alert(validation.error);
    event.target.value = '';
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    localStorage.setItem(CONFIG.STORAGE_KEYS.PROFILE_PIC, e.target.result);
    document.getElementById('profilePic').src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function logout() {
  localStorage.removeItem(CONFIG.STORAGE_KEYS.LOGGED_IN);
  localStorage.removeItem(CONFIG.STORAGE_KEYS.USERNAME);
  localStorage.removeItem(CONFIG.STORAGE_KEYS.EMAIL);
  localStorage.removeItem(CONFIG.STORAGE_KEYS.PROFILE_PIC);
  window.location.href = "index.html";
}

function viewAllUsers() {
  const users = safeJSONParse(CONFIG.STORAGE_KEYS.USERS, []);
  console.log("=== REGISTERED USERS ===");
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.username} | ${user.email} | ID: ${user.id}`);
  });
  return users;
}

window.viewAllUsers = viewAllUsers;