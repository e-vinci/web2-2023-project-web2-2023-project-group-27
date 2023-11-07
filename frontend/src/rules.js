// Définition des couleurs
const Couleur = {
    ROUGE: 'rouge',
    VERT: 'vert',
    BLEU: 'bleu',
    JAUNE: 'jaune',
  }
  
  // Définition des valeurs spéciales
  const ValeurSpeciale = {
    PLUS_DEUX: '+2',
    INVERSION: 'inversion',
    PASSE_TOUR: 'passe-tour',
  }
  
  // Définition des cartes
  const Carte = {
    [Couleur.ROUGE]: [
      { valeur: 0, image: 'cards/0_red.png'},
      { valeur: 0, image: 'cards/0_red.png'},
      { valeur: 1, image: 'cards/1_red.png'},
      { valeur: 1, image: 'cards/1_red.png'},
      { valeur: 2, image: 'cards/2_red.png'},
      { valeur: 2, image: 'cards/2_red.png'},
      { valeur: 3, image: 'cards/3_red.png'},
      { valeur: 3, image: 'cards/3_red.png'},
      { valeur: 4, image: 'cards/4_red.png'},
      { valeur: 4, image: 'cards/4_red.png'},
      { valeur: 5, image: 'cards/5_red.png'},
      { valeur: 5, image: 'cards/5_red.png'},
      { valeur: 6, image: 'cards/6_red.png'},
      { valeur: 6, image: 'cards/6_red.png'},
      { valeur: 7, image: 'cards/7_red.png'},
      { valeur: 7, image: 'cards/7_red.png'},
      { valeur: 8, image: 'cards/8_red.png'},
      { valeur: 8, image: 'cards/8_red.png'},
      { valeur: 9, image: 'cards/9_red.png'},
      { valeur: 9, image: 'cards/9_red.png'},
      { valeur: 10, image:'cards/10_red.png'},
      { valeur: 10, image:'cards/10_red.png'},
      { valeur: '+2', image:'cards/+2_red.png'},
      { valeur: '+2', image:'cards/+2_red.png'},
      { valeur: 'inversion', image:'cards/invert_red.png'},
      { valeur: 'inversion', image:'cards/invert_red.png'},
      { valeur: 'passe-tour', image:'cards/block_red.png'},
      { valeur: 'passe-tour', image:'cards/block_red.png'},
    ],
    [Couleur.VERT]: [
        { valeur: 0, image: 'cards/0_green.png'},
        { valeur: 0, image: 'cards/0_green.png'},
        { valeur: 1, image: 'cards/1_green.png'},
        { valeur: 1, image: 'cards/1_green.png'},
        { valeur: 2, image: 'cards/2_green.png'},
        { valeur: 2, image: 'cards/2_green.png'},
        { valeur: 3, image: 'cards/3_green.png'},
        { valeur: 3, image: 'cards/3_green.png'},
        { valeur: 4, image: 'cards/4_green.png'},
        { valeur: 4, image: 'cards/4_green.png'},
        { valeur: 5, image: 'cards/5_green.png'},
        { valeur: 5, image: 'cards/5_green.png'},
        { valeur: 6, image: 'cards/6_green.png'},
        { valeur: 6, image: 'cards/6_green.png'},
        { valeur: 7, image: 'cards/7_green.png'},
        { valeur: 7, image: 'cards/7_green.png'},
        { valeur: 8, image: 'cards/8_green.png'},
        { valeur: 8, image: 'cards/8_green.png'},
        { valeur: 9, image: 'cards/9_green.png'},
        { valeur: 9, image: 'cards/9_green.png'},
        { valeur: 10, image:'cards/10_green.png'},
        { valeur: 10, image:'cards/10_green.png'},
        { valeur: '+2', image:'cards/+2_green.png'},
        { valeur: '+2', image:'cards/+2_green.png'},
        { valeur: 'inversion', image:'cards/invert_green.png'},
        { valeur: 'inversion', image:'cards/invert_green.png'},
        { valeur: 'passe-tour', image:'cards/block_green.png'},
        { valeur: 'passe-tour', image:'cards/block_green.png'},
    ],

    [Couleur.JAUNE]: [
        { valeur: 0, image: 'cards/0_yellow.png'},
        { valeur: 0, image: 'cards/0_yellow.png'},
        { valeur: 1, image: 'cards/1_yellow.png'},
        { valeur: 1, image: 'cards/1_yellow.png'},
        { valeur: 2, image: 'cards/2_yellow.png'},
        { valeur: 2, image: 'cards/2_yellow.png'},
        { valeur: 3, image: 'cards/3_yellow.png'},
        { valeur: 3, image: 'cards/3_yellow.png'},
        { valeur: 4, image: 'cards/4_yellow.png'},
        { valeur: 4, image: 'cards/4_yellow.png'},
        { valeur: 5, image: 'cards/5_yellow.png'},
        { valeur: 5, image: 'cards/5_yellow.png'},
        { valeur: 6, image: 'cards/6_yellow.png'},
        { valeur: 6, image: 'cards/6_yellow.png'},
        { valeur: 7, image: 'cards/7_yellow.png'},
        { valeur: 7, image: 'cards/7_yellow.png'},
        { valeur: 8, image: 'cards/8_yellow.png'},
        { valeur: 8, image: 'cards/8_yellow.png'},
        { valeur: 9, image: 'cards/9_yellow.png'},
        { valeur: 9, image: 'cards/9_yellow.png'},
        { valeur: 10, image:'cards/10_yellow.png'},
        { valeur: 10, image:'cards/10_yellow.png'},
        { valeur: '+2', image:'cards/+2_yellow.png'},
        { valeur: '+2', image:'cards/+2_yellow.png'},
        { valeur: 'inversion', image:'cards/invert_yellow.png'},
        { valeur: 'inversion', image:'cards/invert_yellow.png'},
        { valeur: 'passe-tour', image:'cards/block_yellow.png'},
        { valeur: 'passe-tour', image:'cards/block_yellow.png'},
    ],

    [Couleur.BLEU]: [
        { valeur: 0, image: 'cards/0_blue.png' },
        { valeur: 0, image: 'cards/0_blue.png'},
        { valeur: 1, image: 'cards/1_blue.png' },
        { valeur: 1, image: 'cards/1_blue.png'},
        { valeur: 2, image: 'cards/2_blue.png'},
        { valeur: 2, image: 'cards/2_blue.png'},
        { valeur: 3, image: 'cards/3_blue.png' },
        { valeur: 3, image: 'cards/3_blue.png'},
        { valeur: 4, image: 'cards/4_blue.png'},
        { valeur: 4, image: 'cards/4_blue.png'},
        { valeur: 5, image: 'cards/5_blue.png'},
        { valeur: 5, image: 'cards/5_blue.png'},
        { valeur: 6, image: 'cards/6_blue.png'},
        { valeur: 6, image: 'cards/6_blue.png'},
        { valeur: 7, image: 'cards/7_blue.png'},
        { valeur: 7, image: 'cards/7_blue.png'},
        { valeur: 8, image: 'cards/8_blue.png'},
        { valeur: 8, image: 'cards/8_blue.png'},
        { valeur: 9, image: 'cards/9_blue.png'},
        { valeur: 9, image:'cards/9_blue.png'},
        { valeur: 10, image:'cards/10_blue.png'},
        { valeur: 10, image:'cards/10_blue.png'},
        { valeur: '+2', image:'cards/+2_blue.png'},
        { valeur: '+2', image:'cards/+2_blue.png'},
        { valeur: 'inversion', image:'cards/invert_blue.png'},
        { valeur: 'inversion', image:'cards/invert_blue.png'},
        { valeur: 'passe-tour', image:'cards/block_blue.png'},
        { valeur: 'passe-tour', image:'cards/block_blue.png'},
    ],
    
    JOKER: [
        { valeur: 'joker', image: 'cards/multicolor.png' },
        { valeur: 'joker', image: 'cards/multicolor.png' },
        { valeur: 'joker', image: 'cards/multicolor.png' },
        { valeur: 'joker', image: 'cards/multicolor.png' },
        { valeur: '+4', image: 'cards/multicolor_+4.png' },
        { valeur: '+4', image: 'cards/multicolor_+4.png' },
        { valeur: '+4', image: 'cards/multicolor_+4.png' },
        { valeur: '+4', image: 'cards/multicolor_+4.png' },
      ],
  }
  
  // Mélange des cartes
  function melangerCartes() {
    const cartes = Object.values(Carte)
      .flat()
      .sort(() => Math.random() - 0.5);
    return cartes;
  }
   // Définition du joueur
   class Joueur {
    constructor(nom) {
      this.nom = nom;
      this.main = [];
    }
    
    piocher(cartes) {
      this.main.push(...cartes);
    }
    
    jouer(carteIndex, pile, nouvelleCouleur) {
      const carte = this.main[carteIndex];
      
      if (this.peutJouer(carte, pile, nouvelleCouleur)) {
        this.main.splice(carteIndex, 1);
        pile.push(carte);
        return true;
      }
      
      return false;
    }
    
    peutJouer(carte, pile, nouvelleCouleur) {
      const sommetPile = pile[pile.length - 1];
      
      if (carte === ValeurSpeciale.PLUS_DEUX && sommetPile === ValeurSpeciale.PLUS_DEUX) {
        return true;
      }
      
      if (carte === sommetPile || carte.startsWith(nouvelleCouleur)) {
        return true;
      }
      
      return false;
    }
  }
    // Fonction de jeu
    function jouerUno(joueurs) {
      const paquetDeCartes = melangerCartes();
      const pile = [paquetDeCartes.pop()];
      const nouvelleCouleur = pile[0].split('-')[0];
      let joueurActuel = 0;
      let sens = 1; // Sens du jeu (1 pour avant, -1 pour arrière)
      
      for (let i = 0; i < 7; i++) {
        joueurs.forEach(joueur => {
          joueur.piocher([paquetDeCartes.pop()]);
        });
      }
      
      while (true) {
        const joueur = joueurs[joueurActuel];
        console.log(`C'est au tour de ${joueur.nom}`);
        console.log(`La carte actuelle sur la pile est : ${pile[pile.length - 1]}`);
        
        if (joueur.main.length === 0) {
          console.log(`Le joueur ${joueur.nom} a gagné !`);
          break;
        }
        
        const carteIndex = Math.floor(Math.random() * joueur.main.length);
        const carteJouee = joueur.jouer(carteIndex, pile, nouvelleCouleur);
        
        if (!carteJouee) {
          joueur.piocher([paquetDeCartes.pop()]);
          console.log(`Le joueur ${joueur.nom} pioche une carte.`);
        } else {
          console.log(`Le joueur ${joueur.nom} joue la carte ${joueur.main[carteIndex]}.`);
          
          if (joueur.main.length === 1) {
            console.log(`UNO ! ${joueur.nom} a une carte restante.`);
          }
          
          if (joueur.main.length === 0) {
            console.log(`Le joueur ${joueur.nom} a gagné !`);
            break;
          }
          
          const sommetPile = pile[pile.length - 1];
          
          if (sommetPile === ValeurSpeciale.PLUS_DEUX) {
            const prochainJoueur = joueurs[(joueurActuel + sens) % joueurs.length];
            prochainJoueur.piocher([paquetDeCartes.pop(), paquetDeCartes.pop()]);
            console.log(`Le joueur ${prochainJoueur.nom} pioche 2 cartes et perd son tour.`);
            joueurActuel = (joueurActuel + sens) % joueurs.length;
          } else if (sommetPile === ValeurSpeciale.INVERSION) {
            sens *= -1;
            console.log('L\'ordre du jeu est inversé.');
            joueurActuel = (joueurActuel + sens + joueurs.length) % joueurs.length;
          } else if (sommetPile === ValeurSpeciale.PASSE_TOUR) {
            joueurActuel = (joueurActuel + sens + joueurs.length) % joueurs.length;
            console.log(`Le joueur ${joueurs[joueurActuel].nom} perd son tour.`);
          } else if (sommetPile.startsWith('joker')) {
            nouvelleCouleur = joueur.main[carteIndex].split('-')[1];
            console.log(`Le joueur ${joueur.nom} choisit la nouvelle couleur : ${nouvelleCouleur}`);
          } else {
            joueurActuel = (joueurActuel + sens + joueurs.length) % joueurs.length;
          }
        }
        
        console.log('-------------------------');
      }
    }
    
    // Exemple d'utilisation
    const joueurs = [
      new Joueur('Joueur 1'),
      new Joueur('Joueur 2'),
      new Joueur('Joueur 3'),
      new Joueur('Joueur 4'),
    ];
    
    jouerUno(joueurs);