const popupLogin = document.getElementById("popupLogin");
const popupSignIn = document.getElementById("popupSignIn");
const nicknameForm = document.getElementById("nickname");

const socketio = require('socket.io-client');

let io;

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

  if (valid) {
    signIn(email, pseudo, password); 
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

  if (valid) {
      login(email, password)
    }
});

function login(email, password) {
  io = socketio.io("https://unovinci.webpubsub.azure.com", {
    path: "/clients/socketio/hubs/hub",
});

  io.on("connected", () => {
    console.log('Connecté au serveur');
    io.emit('login', { email, password });
  });

  io.on('loginResult', ({username}) => {
    if(username !== undefined) {
      console.log(`Connexion réussie pour ${email}`); // Ajoutez ici le code pour gérer la connexion réussie côté client
      popupLogin.style.display = 'none';
      document.getElementById('loginSubmitError').innerText = '';
      document.getElementById('nickname').addEventListener('keydown', blockKeyboardInput);
      document.getElementById('signInPath').style.display = 'none';
      document.getElementById('loginPath').style.display = 'none';
      nicknameForm.value = username;
    }
    else {
      console.log(`Échec de la connexion`);
      document.getElementById('loginSubmitError').innerText = 'email ou mot de passe incorrect';
    } 

    // Fin de la connexion
    io.disconnect();
    io = null;
});
setTimeout(() => {
  if(io === null) return;
  io.disconnect();
  io = null;
  console.log(`Échec de la connexion`);
}, 2000);
}

function signIn(email, pseudo, password) {
  io = socketio.io("https://unovinci.webpubsub.azure.com", {
    path: "/clients/socketio/hubs/hub",
});

  io.on("connected", () => {
    console.log('Connecté au serveur');
    io.emit('register', { email, pseudo, password });
  });

  io.on('signInResult', ({ username }) => {
    if(username !== undefined) {
      console.log(`Inscription réussie pour ${email}`); // Ajoutez ici le code pour gérer l'inscription réussie côté client
      nicknameForm.value = username;
      document.getElementById('nickname').addEventListener('keydown', blockKeyboardInput);
      popupSignIn.style.display = 'none';
      document.getElementById('signInPath').style.display = 'none';
      document.getElementById('loginPath').style.display = 'none';
      document.getElementById('signInSubmitError').innerText = '';
    }
    else{
      console.log(`Échec de l'inscription`);
      document.getElementById('signInSubmitError').innerText = 'Adresse mail déjà existante';
    }

    // Fin de la connexion
    io.disconnect();
    io = null;
});

setTimeout(() => {
  if(io === null) return;
  io.disconnect();
  io = null;
  console.log(`Échec de la connexion`);
}, 2000);
}

function blockKeyboardInput(event) {
  event.preventDefault();
}