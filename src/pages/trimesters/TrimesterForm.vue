<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">{{ trimester ? 'Modifier' : 'Créer' }} un trimestre</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">&times;</button>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Année scolaire *</label>
            <select v-model="form.academicYearId" required class="w-full border rounded-lg px-3 py-2">
              <option value="">Sélectionner</option>
              <option v-for="year in academicYears" :key="year.id" :value="year.id">{{ year.libelle }}</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input v-model="form.nom" type="text" required class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Ordre</label>
            <input v-model.number="form.ordre" type="number" class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date début</label>
            <input v-model="form.dateDebut" type="date" class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date fin</label>
            <input v-model="form.dateFin" type="date" class="w-full border rounded-lg px-3 py-2" />
          </div>
        </div>

        <div v-if="error" class="mt-4 bg-red-50 text-red-600 p-3 rounded-lg">{{ error }}</div>

        <div class="flex justify-end gap-2 mt-6">
          <button type="button" @click="$emit('close')" class="px-4 py-2 border rounded-lg hover:bg-gray-50">Annuler</button>
          <button type="submit" :disabled="saving" class="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50">
            {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, onMounted } from 'vue'

const props = defineProps({
  trimester: Object,
  visible: Boolean
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref(null)
const academicYears = ref([])

const form = reactive({
  academicYearId: '',
  nom: '',
  ordre: null,
  dateDebut: '',
  dateFin: ''
})

watch(() => props.trimester, (newTrimester) => {
  if (newTrimester) {
    Object.assign(form, newTrimester)
  } else {
    Object.assign(form, {
      academicYearId: '',
      nom: '',
      ordre: null,
      dateDebut: '',
      dateFin: ''
    })
  }
}, { immediate: true })

onMounted(async () => {
  try {
    const response = await fetch('/api/annees-academiques')
    const data = await response.json()
    academicYears.value = data
  } catch (e) {
    console.error('Erreur lors du chargement des années scolaires', e)
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
