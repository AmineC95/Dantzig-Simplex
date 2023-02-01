// c : les coefficients de la fonction objective.
// A : la matrice des contraintes.
// b : la partie droite des contraintes.
// n : le nombre de variables.
// m : le nombre de contraintes.

function simplexDantzig(c, A, b, n, m) {
  // Initialiser les tableaux x et y avec des valeurs par défaut de 0
  let x = Array(n).fill(0);
  let y = Array(m).fill(0);

  // Initialiser le tableau base avec les index n à n + m - 1
  let base = Array(m).fill(0);
  for (let i = 0; i < m; i++) {
    base[i] = n + i;
  }
  // Boucle infinie jusqu'à ce que la condition de sortie soit remplie
  while (true) {
    // Créer un tableau nonBasic pour stocker les index non-basiques
    let nonBasic = [];
    for (let i = 0; i < n; i++) {
      if (!base.includes(i)) {
        nonBasic.push(i);
      }
    }

    // Afficher nonBasic dans la console pour le debug
    console.log("nonBasic:", nonBasic);

    // Calculer le tableau d
    let d = Array(m).fill(Infinity);
    for (let i = 0; i < m; i++) {
      if (A[i][base[i]] > 0) {
        d[i] = b[i] / A[i][base[i]];
      }
    }

    // Afficher d dans la console pour le debug
    console.log("d:", d);

    // Trouver le minimum de d et stocker son index dans leaveIndex
    let theta = Infinity;
    let leaveIndex = -1;
    for (let i = 0; i < m; i++) {
      if (d[i] < theta) {
        theta = d[i];
        leaveIndex = i;
      }
    }

    // Afficher theta et leaveIndex dans la console pour le debug
    console.log("theta:", theta);
    console.log("leaveIndex:", leaveIndex);

    // Si theta est égal à l'infini, retourner la solution et la valeur
    if (theta === Infinity) {
      let value = 0;
      for (let i = 0; i < m; i++) {
        value += c[base[i]] * b[i];
      }

      // Afficher x, y et value dans la console pour le debug
      console.log("x:", x);
      console.log("y:", y);
      console.log("value:", value);

      return {
        solution: x,
        value: value,
      };
    }

    // Initialiser enterIndex à -1
    let enterIndex = -1;

    // Initialiser la valeur minimale du ratio à l'infini
    let minRatio = Infinity;

    // Boucle à travers les indices non de base
    for (const element of nonBasic) {
      // Si la valeur de A[leaveIndex][nonBasic[i]] est supérieure à 0
      if (A[leaveIndex][element] > 0) {
        // Calculer le ratio entre c[nonBasic[i]] et A[leaveIndex][nonBasic[i]]
        let ratio = c[element] / A[leaveIndex][element];

        // Si le ratio est inférieur à la valeur minimale du ratio,
        // Mettre à jour la valeur minimale du ratio et l'index d'entrée
        if (ratio < minRatio) {
          minRatio = ratio;
          enterIndex = element;
        }
      }
    }

    // Si l'index d'entrée est toujours égal à -1, cela signifie que le modèle est sans solution,
    // retourner "unbounded" avec une valeur "infini"
    if (enterIndex === -1) {
      return {
        solution: "unbounded",
        value: "infinity",
      };
    }

    // Mettre à jour les valeurs de x[enterIndex] et y[leaveIndex]
    x[enterIndex] = theta;
    y[leaveIndex] = c[enterIndex] / A[leaveIndex][enterIndex];

    // Boucle à travers toutes les lignes du tableau A
    for (let i = 0; i < m; i++) {
      // Si i n'est pas égal à leaveIndex,
      // Soustraire la valeur de theta multipliée par A[i][enterIndex] de b[i]
      // Soustraire la valeur de theta multipliée par y[leaveIndex] multiplié par A[i][enterIndex] de c[i]
      if (i !== leaveIndex) {
        b[i] -= theta * A[i][enterIndex];
        c[i] -= theta * y[leaveIndex] * A[i][enterIndex];
      }
    }

    // Mettre à jour la valeur de c[enterIndex] à 0
    c[enterIndex] = 0;

    // Diviser b[leaveIndex] par A[leaveIndex][enterIndex]
    b[leaveIndex] /= A[leaveIndex][enterIndex];

    // Boucle à travers toutes les colonnes du tableau A
    for (let i = 0; i < n; i++) {
      // Si i n'est pas égal à enterIndex,
      // Diviser A[leaveIndex][i] par A[leaveIndex][enterIndex]
      if (i !== enterIndex) {
        A[leaveIndex][i] /= A[leaveIndex][enterIndex];
      }
    }

    // Mettre à jour la valeur de A[leaveIndex][enterIndex] à 1
    A[leaveIndex][enterIndex] = 1;

    console.log("x", x);
    console.log("y", y);
    console.log("base", base);
    console.log("c", c);
    console.log("A", A);
    console.log("b", b);

    base[leaveIndex] = enterIndex;
  }
}

export default simplexDantzig;
