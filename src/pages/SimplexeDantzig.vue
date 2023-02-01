<template>
    <q-page>
      <q-card>
        <q-card-section>
          <h3>Simplex Algorithm</h3>
          <q-input v-model="numVariables" type="number" label="Number of Variables"></q-input>
          <q-input v-model="numConstraints" type="number" label="Number of Constraints"></q-input>
          <q-btn @click="runSimplex" label="Run Simplex"></q-btn>
          <br /><br />
          <h4>Objective Function:</h4>
          <div v-for="i in numVariables">
            <q-input v-model="objCoefficients[i]" type="number" :label="`Coefficient for x${i + 1}`"></q-input>
          </div>
          <h4>Constraints:</h4>
          <div v-for="i in numConstraints">
            <div v-for="j in numVariables">
              <q-input v-model="constraintCoefficients[i][j]" type="number" :label="`Coefficient for x${j + 1} in constraint ${i + 1}`"></q-input>
            </div>
            <q-input v-model="constraintValues[i]" type="number" :label="`Right-hand side value for constraint ${i + 1}`"></q-input>
          </div>
          <br /><br />
          <q-card-section>
            <h4>Solution:</h4>
            <p v-if="objValue !== null">The maximum value of the objective function is {{ objValue }}</p>
          </q-card-section>
        </q-card-section>
      </q-card>
    </q-page>
  </template>
  
  <script>
  export default {
    data () {
      return {
        numVariables: 2,
        numConstraints: 2,
        objCoefficients: [3, 4],
        constraintCoefficients: [[1, 1], [2, 1]],
        constraintValues: [4, 5],
        variables: [],
        objValue: null
      }
    },
    methods: {
      runSimplex () {
        this.variables = Array(this.numVariables).fill(0)
        this.objValue = null
    
        while (true) {
          let allConstraintsSatisfied = true
    
          for (let i = 0; i < this.numConstraints; i++) {
            let constraintSum = 0
    
            for (let j = 0; j < this.numVariables; j++) {
                constraintSum += this.constraintCoefficients[i][j] * this.variables[j]
          }
  
          if (constraintSum > this.constraintValues[i]) {
            allConstraintsSatisfied = false
            break
          }
        }
  
        if (allConstraintsSatisfied) {
          break
        }
  
        let enteringVariable = -1
        let maxGain = 0
  
        for (let j = 0; j < this.numVariables; j++) {
          let gain = 0
  
          for (let i = 0; i < this.numConstraints; i++) {
            gain += this.constraintCoefficients[i][j] * this.objCoefficients[j]
          }
  
          if (gain > maxGain) {
            maxGain = gain
            enteringVariable = j
          }
        }
  
        if (enteringVariable === -1) {
          break
        }
  
        let leavingConstraint = -1
        let minRatio = Number.POSITIVE_INFINITY
  
        for (let i = 0; i < this.numConstraints; i++) {
          let rhs = this.constraintValues[i]
          let constraintSum = 0
  
          for (let j = 0; j < this.numVariables; j++) {
            constraintSum += this.constraintCoefficients[i][j] * this.variables[j]
          }
  
          if (rhs - constraintSum <= 0) {
            continue
          }
  
          let ratio = this.variables[enteringVariable] / (rhs - constraintSum)
  
          if (ratio < minRatio) {
            minRatio = ratio
            leavingConstraint = i
          }
        }
  
        if (leavingConstraint === -1) {
          break
        }
  
        let pivot = this.constraintCoefficients[leavingConstraint][enteringVariable]
  
        for (let j = 0; j < this.numVariables; j++) {
          this.constraintCoefficients[leavingConstraint][j] /= pivot
        }
  
        this.constraintValues[leavingConstraint] /= pivot
        this.variables[enteringVariable] = 1 / pivot
  
        for (let i = 0; i < this.numConstraints; i++) {
          if (i === leavingConstraint) {
            continue
          }
  
          let pivot = this.constraintCoefficients[i][enteringVariable]
  
          for (let j = 0; j < this.numVariables; j++) {
            this.constraintCoefficients[i][j] -= pivot * this.constraintCoefficients[leavingConstraint][j]
          }
  
          this.constraintValues[i] -= pivot * this.constraintValues[leavingConstraint]
        }
        for (let i = 0; i < this.numConstraints; i++) {
          if (i === leavingConstraint) {
            continue
          }
  
          let pivot = this.constraintCoefficients[i][enteringVariable]
  
          for (let j = 0; j < this.numVariables; j++) {
            this.constraintCoefficients[i][j] -= pivot * this.constraintCoefficients[leavingConstraint][j]
          }
  
          this.constraintValues[i] -= pivot * this.constraintValues[leavingConstraint]
        }
      }
    }
  }
}

let simplex = new Simplex(numVariables, numConstraints, objCoefficients, constraintCoefficients, constraintValues)
simplex.solve()
console.log(simplex.variables)

</script>


  