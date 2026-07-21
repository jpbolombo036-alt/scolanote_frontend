<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Écoles</h1>
      <button @click="openCreateForm" class="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
        Nouvelle école
      </button>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
      {{ error }}
    </div>

    <div v-if="loading" class="text-center py-8">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
    </div>

    <div v-else class="bg-white shadow rounded-lg overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Province</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commune</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="school in schools" :key="school.id">
            <td class="px-6 py-4 whitespace-nowrap font-medium">{{ school.nom }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ school.code }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ school.province }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ school.communeTerritoire }}</td>
            <td class="px-6 py-4 whitespace-nowrap">{{ school.email }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-right">
              <button @click="openEditForm(school)" class="text-primary-600 hover:text-primary-800 mr-2">Modifier</button>
              <button @click="deleteSchool(school.id)" class="text-red-600 hover:text-red-800">Supprimer</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <SchoolForm v-if="showForm" :school="editingSchool" @save="saveSchool" @close="showForm = false" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      schools: [],
      loading: false,
      error: null,
      showForm: false,
      editingSchool: null,
      searchQuery: '',
      pagination: {
        page: 0,
        size: 10,
        totalPages: 0,
        totalElements: 0
      }
    }
  },
  async mounted() {
    await this.loadSchools()
  },
  methods: {
    async loadSchools() {
      this.loading = true
      this.error = null
      try {
        const response = await axios.get('/api/ecoles', {
          params: {
            page: this.pagination.page,
            size: this.pagination.size,
            sort: 'nom,asc'
          }
        })
        this.schools = response.data.content
        this.pagination.totalPages = response.data.totalPages
        this.pagination.totalElements = response.data.totalElements
      } catch (e) {
        this.error = e.response?.data?.message || 'Erreur lors du chargement'
      } finally {
        this.loading = false
      }
    },
    openCreateForm() {
      this.editingSchool = null
      this.showForm = true
    },
    openEditForm(school) {
      this.editingSchool = school
      this.showForm = true
    },
    async saveSchool(schoolData) {
      try {
        if (this.editingSchool) {
          await axios.put(`/api/ecoles/${this.editingSchool.id}`, schoolData)
        } else {
          await axios.post('/api/ecoles', schoolData)
        }
        this.showForm = false
        await this.loadSchools()
      } catch (e) {
        alert(e.response?.data?.message || 'Erreur lors de la sauvegarde')
      }
    },
    async deleteSchool(id) {
      if (!confirm('Êtes-vous sûr de vouloir supprimer cette école ?')) return
      try {
        await axios.delete(`/api/ecoles/${id}`)
        await this.loadSchools()
      } catch (e) {
        alert(e.response?.data?.message || 'Erreur lors de la suppression')
      }
    },
    onPageChange(page) {
      this.pagination.page = page
      this.loadSchools()
    }
  }
}
</script>
