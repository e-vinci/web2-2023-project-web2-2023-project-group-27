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