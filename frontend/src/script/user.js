const popupLogin = document.getElementById("popupLogin");
const popupSignIn = document.getElementById("popupSignIn");
const nicknameForm = document.getElementById("nickname");

const socket = io();

const usersData = [];

document.getElementById('signInForm').addEventListener('submit', (event) => {
  event.preventDefault();
  let valid = true;
  // Validation du pseudo
  const pseudo = document.getElementById('nicknameSignIn').value;
  if (pseudo.trim() === '') {
    document.getElementById('signInNicknameError').innerText = 'Le pseudo est requis';
    valid = false;
  } else {
    document.getElementById('signInNicknameError').innerText = '';
  }

  // Validation de l'email
  const email = document.getElementById('emailSignIn').value;
  if (email.trim() === '') {
    document.getElementById('signInEmailError').innerText = 'L\'email est requis';
    valid = false;
  } else {
    document.getElementById('signInEmailError').innerText = '';
  }

  // Validation du mot de passe
  const password = document.getElementById('passwordSignIn').value;
  if (password.trim() === '') {
    document.getElementById('signInPasswordError').innerText = 'Le mot de passe est requis';
    valid = false;
  } else {
    document.getElementById('signInPasswordError').innerText = '';
  }

  // Validation de la confirmation du mot de passe
  const confirmPassword = document.getElementById('passwordConfirmation').value;
  if (confirmPassword.trim() === '' || confirmPassword !== password) {
    document.getElementById('signInConfirmPasswordError').innerText = 'Les mots de passe ne correspondent pas';
    valid = false;
  } else {
    document.getElementById('signInConfirmPasswordError').innerText = '';
  }

  // Validation des conditions d'utilisation
  const cg = document.getElementById('conditionsUtilisation');
  if (cg.checked === false) {
    document.getElementById('signInCUError').innerText = 'Veuillez confirmer les conditions d\'utilisation';
    valid = false
  } else {
    document.getElementById('signInCUError').innerText = '';
  }

  if (!valid) {
    event.preventDefault(); // Empêche l'envoi du formulaire si la validation échoue
  } else {
    const userData = {
      email,
      pseudo,
      password
    };

    usersData.push(userData);
    nicknameForm.value = userData.pseudo;
    popupSignIn.style.display = 'none'
    socket.emit('register', { email, password });
  }
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
  event.preventDefault();
  let valid = true;

  // Validation de l'email
  const email = document.getElementById('emailLogin').value;
  if (email.trim() === '') {
    document.getElementById('loginEmailError').innerText = 'L\'email est requis';
    valid = false;
  } else {
    document.getElementById('loginEmailError').innerText = '';
  };

  // Validation du mot de passe
  const password = document.getElementById('passwordLogin').value;
  if (password.trim() === '') {
    document.getElementById('loginPasswordError').innerText = 'Le mot de passe est requis';
    valid = false;
  } else {
    document.getElementById('loginPasswordError').innerText = '';
  };

  if (!valid) {
    event.preventDefault(); // Empêche l'envoi du formulaire si la validation échoue
  } else {
      popupLogin.style.display = 'none';
      socket.emit('login', { email, password });
    }
});




/*

// Gérez les événements ou actions liées aux websockets ici
// Exemple d'écoute d'un message du serveur
socket.on('login-success', ({ email }) => {
    console.log(`Connexion réussie pour ${email}`);
    // Ajoutez ici le code pour gérer la connexion réussie côté client
});

socket.on('login-fail', ({ message }) => {
    console.log(`Échec de la connexion: ${message}`);
    // Ajoutez ici le code pour gérer l'échec de la connexion côté client
});

socket.on('register-success', ({ email }) => {
    console.log(`Inscription réussie pour ${email}`);
    // Ajoutez ici le code pour gérer l'inscription réussie côté client
});

socket.on('register-fail', ({ message }) => {
    console.log(`Échec de l'inscription: ${message}`);
    // Ajoutez ici le code pour gérer l'échec de l'inscription côté client
});

*/