<template>
  <div>
    <q-page style="padding: 50px;">
      <q-form @submit.prevent="runSimplex">
        <q-input
          v-model="c"
          label="Coûts (séparés par des virgules)"
          type="text"
        />
        <q-input
          v-model="A"
          label="Matrice de contraintes (séparé par des ','chaque ligne séparée par des ';')"
          type="text"
        />
        <q-input
          v-model="b"
          label="Vecteur de limites (séparées par des virgules)"
          type="text"
        />
        <q-input
          v-model="n"
          label="Nombre de variables d'optimisation"
          type="number"
        />
        <q-input
          v-model="m"
          label="Nombre de contraintes"
          type="number"
        />
        <q-btn type="submit" color="primary">Exécuter simplexe</q-btn>
      </q-form>
    </q-page>

    <p v-if="result" style="padding: 50px;">Le résultat de l'algorithme est: {{ result }}</p>
    
    <div v-if="results.length" style="padding: 50px;">
      <h3>Résultats:</h3>
      <ul>
        <li v-for="(result, index) in results" :key="index">{{ result }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import simplexDantzig from '../router/simplexDantzig.js';

export default {
  name: 'IndexPage',
  data() {
    return {
      results: [],
      c: '',
      A: '',
      b: '',
      n: '',
      m: '',
      result: "",
    };
  },
  methods: {
    runSimplex() {
      const c = this.c.split(',').map(Number);
      const A = this.A.split(';').map(row => row.split(',').map(Number));
      const b = this.b.split(',').map(Number);
      const n = Number(this.n);
      const m = Number(this.m);
      
      const result = simplexDantzig(c, A, b, n, m);
      this.results = [
        `Solution optimale: ${result.x ? `[${result.x}]` : 'Non trouvée'}`,
        `Valeur optimale: ${result.value ? result.value : 'Non disponible'}`,
      ];
      console.log(result.x)
      console.log(this.results)
    },
  },
};
</script>

