/* eslint-disable max-len */
/* eslint-disable consistent-return */
const bcrypt = require('bcrypt');
const json = require('../utils/json');

const salt = 10;

const accountsPath = './data/accounts.json';

const usersData = json.parse(accountsPath);

function Login(email, password) {
  // Vérifiez les informations de connexion
  if (password === undefined) return;
  const currentUser = usersData.find((user) => user.email === email && bcrypt.compareSync(password, user.password));
  return currentUser.nickname;
}

function SignIn(email, nickname, password) {
  // Vérifiez si l'utilisateur existe déjà
  if (email === undefined || nickname === undefined || password === undefined) return false;
  const userExists = usersData.some((user) => user.email === email);
  if (userExists) return undefined;

  usersData.push({ email, nickname, password: bcrypt.hashSync(password, salt) });
  json.serialize(accountsPath, usersData);
  return nickname;
}

module.exports = {
  Login,
  SignIn,
};
