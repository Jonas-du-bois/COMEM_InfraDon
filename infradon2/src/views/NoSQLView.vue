<template>
  <div class="example-component">
    <h1>{{ message }}</h1>
    <button @click="incrementNumber">Cliquez-moi</button>
  </div>
</template>

<script>
export default {
  name: 'ExampleComponent',
  data() {
    return {
      number: 0
    };
  },
  methods: {
    incrementNumber() {
      this.number++;
    }
  },
  computed: {
    message() {
      return `Le numéro est : ${this.number}`;
    }
  }
};
</script>

<style scoped>
.example-component {
  text-align: center;
  margin-top: 20px;
}

button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
