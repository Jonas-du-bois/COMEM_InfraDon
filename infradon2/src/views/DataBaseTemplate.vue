<script lang="ts">
import DatabaseManager from '../components/DatabaseManager.vue'

export default {
  components: {
    DatabaseManager
  },

  data() {
    return {
      // Pas besoin de gérer la base de données manuellement ici
    }
  },

  mounted() {
    // Aucune initialisation de la base de données n'est nécessaire ici
  }
}
</script>

<template>
  <div class="example-component">
    <!-- Utilisation du composant DatabaseManager 
    <DatabaseManager :remoteURL="'http://admin:Recopy2-Broadways2-Daylong9-Acts0@localhost:5984/newdb'"
    :localURL="'newdb'" />
    -->
    <DatabaseManager :remoteURL="'http://admin:admin@localhost:5984/newdb'" :localURL="'newdb'" />
  </div>
</template>