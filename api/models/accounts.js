import { parse, serialize } from '../utils/json';

const accountPath = '../data/accounts.json';

// eslint-disable-next-line no-unused-vars, consistent-return
function register(username, email, password) {
  const accounts = parse(accountPath);
  if (accounts[email] !== undefined) return 'Un compte existe déjà pour cet email';
  accounts[email] = {
    username,
    password,
    picturePath: 'none',
  };
  serialize(accountPath, accounts);
}

// eslint-disable-next-line no-unused-vars, consistent-return
function login(email, password) {
  const accounts = parse(accountPath);
  if (accounts[email] !== undefined) return false;
  return accounts[email][password] === password;
}
