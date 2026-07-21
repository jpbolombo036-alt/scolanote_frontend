<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Tableau de bord</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="text-3xl font-bold text-primary-600">{{ stats.schools }}</div>
        <div class="text-gray-600">Écoles</div>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <div class="text-3xl font-bold text-primary-600">{{ stats.students }}</div>
        <div class="text-gray-600">Élèves</div>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <div class="text-3xl font-bold text-primary-600">{{ stats.teachers }}</div>
        <div class="text-gray-600">Professeurs</div>
      </div>
      <div class="bg-white shadow rounded-lg p-6">
        <div class="text-3xl font-bold text-primary-600">{{ stats.reportCards }}</div>
        <div class="text-gray-600">Bulletins générés</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const stats = ref({
  schools: 0,
  students: 0,
  teachers: 0,
  reportCards: 0
})

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')
    const headers = { Authorization: `Bearer ${token}` }
    
    const [schoolsRes, studentsRes, teachersRes, bulletinsRes] = await Promise.all([
      axios.get('/api/ecoles', { headers }),
      axios.get('/api/eleves', { headers }),
      axios.get('/api/enseignants', { headers }),
      axios.get('/api/bulletins', { headers })
    ])
    
    stats.value.schools = schoolsRes.data.totalElements || schoolsRes.data.length || 0
    stats.value.students = studentsRes.data.totalElements || studentsRes.data.length || 0
    stats.value.teachers = teachersRes.data.totalElements || teachersRes.data.length || 0
    stats.value.reportCards = bulletinsRes.data.totalElements || bulletinsRes.data.length || 0
  } catch (e) {
    console.error('Erreur lors du chargement des statistiques', e)
  }
})
</script>
