<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Générer un bulletin</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">&times;</button>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Classe *</label>
            <select v-model="form.classroomId" required class="w-full border rounded-lg px-3 py-2">
              <option value="">Sélectionner</option>
              <option v-for="c in classrooms" :key="c.id" :value="c.id">{{ c.nom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Période *</label>
            <select v-model="form.periodId" required class="w-full border rounded-lg px-3 py-2">
              <option value="">Sélectionner</option>
              <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.nom }}</option>
            </select>
          </div>
        </div>

        <div v-if="error" class="mt-4 bg-red-50 text-red-600 p-3 rounded-lg">{{ error }}</div>

        <div class="flex justify-end gap-2 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
          <button type="submit" :disabled="saving" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {{ saving ? 'Génération...' : 'Générer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'

const props = defineProps({
  visible: Boolean
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref(null)
const classrooms = ref([])
const periods = ref([])

const form = reactive({
  classroomId: '',
  periodId: ''
})

onMounted(async () => {
  try {
    const [classroomsRes, periodsRes] = await Promise.all([
      fetch('/api/salles').then(r => r.json()),
      fetch('/api/periodes').then(r => r.json())
    ])
    classrooms.value = classroomsRes
    periods.value = periodsRes
  } catch (e) {
    console.error('Erreur lors du chargement', e)
  }
})

async function onSubmit() {
  saving.value = true
  error.value = null
  try {
    await emit('save', { ...form })
  } catch (e) {
    error.value = e.response?.data?.message || 'Erreur'
  } finally {
    saving.value = false
  }
}
</script>
