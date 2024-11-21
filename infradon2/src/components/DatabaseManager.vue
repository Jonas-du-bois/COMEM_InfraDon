// src/components/DatabaseManager.vue

<script lang="ts">
import { defineComponent } from 'vue'
import type { PropType } from 'vue'
import { createDatabaseService } from '../services/database.service'
import type { DatabaseDocument } from '../types/database.types'

export default defineComponent({
  name: 'DatabaseManager',

  props: {
    // Prop pour recevoir l'URL de la base de données
    remoteURL: {
      type: String as PropType<string>,
      required: true
    },
    localURL: {
      type: String as PropType<string>,
      required: true
    }
  },

  data() {
    return {
      documents: [] as DatabaseDocument[],
      newDocument: {
        title: '',
        content: ''
      },
      status: {
        message: '',
        type: 'info' as 'info' | 'success' | 'error'
      },
      isLoading: false,
      databaseService: null as ReturnType<typeof createDatabaseService> | null // Instance de DatabaseService
    }
  },

  methods: {
    updateStatus(message: string, type: 'info' | 'success' | 'error') {
      this.status = { message, type }
    },

    async initializeDatabase() {
      try {
        // Utilisation de la prop dbUrl pour initialiser la base de données
        //this.databaseService = createDatabaseService(this.dbUrl);
        this.databaseService = createDatabaseService(this.remoteURL, this.localURL)
        this.updateStatus('Try to connect database', 'success')
        await this.databaseService.initialize()
        this.updateStatus('Connected to database', 'success')
        await this.replicate()
      } catch (error: any) {
        this.updateStatus(error.message, 'error')
      }
    },

    async replicate() {
      if (!this.databaseService) return
      console.log('Call 1');
      await this.databaseService.replicateFromRemote()

      this.fetchDocuments()
    },

    async fetchDocuments() {
      if (!this.databaseService) return
      this.isLoading = true
      try {
        this.documents = await this.databaseService.getAllDocuments()
        this.updateStatus(`${this.documents.length} documents loaded`, 'success')
      } catch (error: any) {
        this.updateStatus(error.message, 'error')
      } finally {
        this.isLoading = false
      }
    },

    async addDocument() {
      if (!this.newDocument.title || !this.newDocument.content) {
        this.updateStatus('Title and content are required', 'error')
        return
      }
      if (!this.databaseService) return

      this.isLoading = true
      try {
        await this.databaseService.createDocument({
          title: this.newDocument.title,
          content: this.newDocument.content,
          createdAt: new Date().toISOString()
        })

        this.updateStatus('Document added successfully', 'success')
        this.newDocument.title = ''
        this.newDocument.content = ''
        await this.fetchDocuments()
      } catch (error: any) {
        this.updateStatus(error.message, 'error')
      } finally {
        this.isLoading = false
      }
    },

    async deleteDocument(id: string) {
      if (!this.databaseService) return
      this.isLoading = true
      try {
        await this.databaseService.deleteDocument(id)
        this.updateStatus('Document deleted successfully', 'success')
        await this.fetchDocuments()
      } catch (error: any) {
        this.updateStatus(error.message, 'error')
      } finally {
        this.isLoading = false
      }
    }
  },

  async mounted() {
    await this.initializeDatabase()
  },

  async unmounted() {
    if (this.databaseService) {
      await this.databaseService.close()
    }
  }
})
</script>

<template>
  <div class="database-manager p-6 max-w-4xl mx-auto bg-white shadow-lg rounded-lg">
    <h1 class="text-3xl font-semibold mb-6 text-center text-gray-800">Database Manager</h1>

    <!-- Status Message -->
    <div v-if="status.message" :class="[
      'px-6 py-4 rounded-lg mb-6 text-center text-sm font-medium',
      {
        'bg-blue-100 border-blue-400 text-blue-700': status.type === 'info',
        'bg-green-100 border-green-400 text-green-700': status.type === 'success',
        'bg-red-100 border-red-400 text-red-700': status.type === 'error'
      }
    ]">
      <p>{{ status.message }}</p>
    </div>

    <!-- Add Document Form -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 class="text-xl font-semibold mb-4">Add New Document</h2>
      <form @submit.prevent="addDocument" class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Title</label>
          <input v-model="newDocument.title" type="text"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-blue-500"
            placeholder="Enter document title" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Content</label>
          <textarea v-model="newDocument.content"
            class="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-3 focus:ring-2 focus:ring-blue-500" rows="4"
            placeholder="Enter document content"></textarea>
        </div>

        <button type="submit" :disabled="isLoading"
          class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200">
          {{ isLoading ? 'Adding...' : 'Add Document' }}
        </button>
      </form>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="flex justify-center my-6">
      <div class="animate-spin rounded-full h-10 w-10 border-b-4 border-blue-500"></div>
    </div>

    <!-- Documents List -->
    <div v-else-if="documents.length > 0" class="space-y-4">
      <h2 class="text-xl font-semibold mb-4">Documents</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="doc in documents" :key="doc._id"
          class="bg-white p-6 rounded-lg shadow-md flex justify-between items-start">
          <div>
            <h3 class="font-semibold text-gray-800 text-lg">{{ doc.title }}</h3>
            <p class="text-gray-600 mt-2">{{ doc.content }}</p>
            <p class="text-sm text-gray-500 mt-3">
              Created: {{ new Date(doc.createdAt).toLocaleString() }}
            </p>
          </div>
          <button @click="deleteDocument(doc._id!)" class="text-red-600 hover:text-red-800 mt-4">
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- No Data State -->
    <div v-else class="text-center py-8 text-gray-600">No documents found in the database.</div>
  </div>
</template>
