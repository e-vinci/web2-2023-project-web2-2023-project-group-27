document.getElementById('signInForm').addEventListener('submit', (event) => {
    let valid = true;
  
    // Validation du pseudo
    const pseudo = document.getElementById('nicknameSignIn').value;
    if (pseudo.trim() === '') {
      document.getElementById('nicknameError').innerText = 'Le pseudo est requis';
      valid = false;
    } else {
      document.getElementById('nicknameError').innerText = '';
    }
  
    // Validation de l'email
    const email = document.getElementById('emailSignIn').value;
    if (email.trim() === '') {
      document.getElementById('emailError').innerText = 'L\'email est requis';
      valid = false;
    } else {
      document.getElementById('emailError').innerText = '';
    }
  
    // Validation du mot de passe
    const password = document.getElementById('passwordSignIn').value;
    if (password.trim() === '') {
      document.getElementById('passwordError').innerText = 'Le mot de passe est requis';
      valid = false;
    } else {
      document.getElementById('passwordError').innerText = '';
    }
  
    // Validation de la confirmation du mot de passe
    const confirmPassword = document.getElementById('passwordConfirmation').value;
    if (confirmPassword.trim() === '' || confirmPassword !== password) {
      document.getElementById('confirmPasswordError').innerText = 'Les mots de passe ne correspondent pas';
      valid = false;
    } else {
      document.getElementById('confirmPasswordError').innerText = '';
    }
  
    if (!valid) {
      event.preventDefault(); // Empêche l'envoi du formulaire si la validation échoue
    }
  });
  