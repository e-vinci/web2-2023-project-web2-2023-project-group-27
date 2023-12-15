const db = require('./db_conf');

function Save(data) {
  const stmt = db.prepare('INSERT INTO users(pseudo, email, password) VALUES (?, ?, ?)');
  const info = stmt.run(data.pseudo, data.email, data.password);
  console.log(info);
}

let usersData = [];

function Login(user) {
  // Vérifiez les informations de connexion
  const currentUser = usersData.find(user.username === username && user.password === password);

  if (currentUser) {
      // Enregistrez l'utilisateur dans la session
      socket.handshake.session.user = { username };
      socket.handshake.session.save();

      // Informez le client que la connexion est réussie
      socket.emit('login-success', { username });
  } else {
      // Informez le client que la connexion a échoué
      socket.emit('login-fail', { message: 'Échec de la connexion' });
  }
}

function SignIn (user) {
  // Vérifiez si l'utilisateur existe déjà
  const userExists = usersData.some(user => user.username === username);

  if (!userExists) {
      // Ajoutez l'utilisateur au tableau
      usersData.push({ username, password });

      // Enregistrez les données dans la session et dans le tableau
      socket.handshake.session.user = { username };
      socket.handshake.session.save();

      // Informez le client que l'inscription est réussie
      socket.emit('register-success', { username });
  } else {
      // Informez le client que l'inscription a échoué
      socket.emit('register-fail', { message: 'Cet utilisateur existe déjà' });
  }
}

module.exports = {
  Save,
  Login,
  SignIn,
};
