
document.getElementById('signInForm').addEventListener('submit', (event) => {
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
    valid = false
  }

  if (!valid) {
    event.preventDefault(); // Empêche l'envoi du formulaire si la validation échoue
  }
});

document.getElementById('loginForm').addEventListener('submit', (event) => {
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
  }
});
