<script lang="ts">
import PouchDB from 'pouchdb'

export default {
  data() {
    return {
      datas: [], // Stockage des données récupérées
      databaseReference: null as PouchDB.Database | null // Référence de la base de données
    }
  },

  methods: {
    // Initialisation de la base de données
    initDatabase() {
      try {
        const db = new PouchDB(
          'http://admin:Recopy2-Broadways2-Daylong9-Acts0@localhost:5984/newDB'
        )
        this.databaseReference = db
        console.log("Connected to the database 'newDB'")
      } catch (error) {
        console.error('Connection failed:', error)
      }
    },

    // Méthode pour récupérer les données
    async fetchData() {
      if (!this.databaseReference) {
        console.warn('Database not initialized')
        return
      }

      try {
        const result = await this.databaseReference.allDocs({ include_docs: true })
        //this.datas = result.rows.map(row => row.doc);  // Stocke les documents récupérés
        console.log('Data fetched successfully:', result)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
  },

  mounted() {
    this.initDatabase()
    this.fetchData() // Appel pour récupérer les données dès que la base de données est prête
  }
}
</script>
