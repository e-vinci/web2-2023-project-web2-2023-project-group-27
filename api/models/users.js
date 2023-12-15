const io = require('../websockets/websockets');

const usersData = [];

function Login(user) {
  // Vérifiez les informations de connexion
  const currentUser = usersData.find(
    (current) => user.username === current.username && user.password === current.password,
  );
  return currentUser !== undefined;
}

function SignIn(user) {
  // Vérifiez si l'utilisateur existe déjà
  const userExists = usersData.some((current) => user.username === current.username);

  return userExists !== undefined;
  // todo
}

module.exports = {
  Login,
  SignIn,
};
