/* eslint-disable consistent-return */
const json = require('../utils/json');

const accountsPath = '../data/accounts.json';

const usersData = json.parse(accountsPath);

function Login(email, password) {
  // Vérifiez les informations de connexion
  if (password === undefined) return;
  const currentUser = usersData.find((user) => user.email === email && user.password === password);
  return currentUser.nickname;
}

function SignIn(email, nickname, password) {
  // Vérifiez si l'utilisateur existe déjà
  if (email === undefined || nickname === undefined || password === undefined) return false;
  const userExists = usersData.some((user) => user.email === email);
  if (userExists) return undefined;
  usersData.push({ email, nickname, password });
  json.serialize(accountsPath, usersData);
  return nickname;
}

module.exports = {
  Login,
  SignIn,
};
