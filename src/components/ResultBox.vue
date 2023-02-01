<template>
    <div>
      <h2>Résultats</h2>
      <p v-for="result in results">{{ result }}</p>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ResultBox',
    props: ['results'],
  };
  </script>
  