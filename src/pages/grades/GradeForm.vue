<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">{{ grade ? 'Modifier' : 'Créer' }} une note</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">&times;</button>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Évaluation *</label>
            <select v-model="form.assessmentId" required class="w-full border rounded-lg px-3 py-2">
              <option value="">Sélectionner</option>
              <option v-for="a in assessments" :key="a.id" :value="a.id">{{ a.titre }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Élève *</label>
            <select v-model="form.studentId" required class="w-full border rounded-lg px-3 py-2">
              <option value="">Sélectionner</option>
              <option v-for="s in students" :key="s.id" :value="s.id">{{ s.nom }} {{ s.postnom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <input v-model.number="form.note" type="number" step="0.01" class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Observation</label>
            <input v-model="form.observation" type="text" class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div class="md:col-span-2">
            <label class="flex items-center">
              <input v-model="form.absence" type="checkbox" class="mr-2" />
              <span class="text-sm font-medium text-gray-700">Absent</span>
            </label>
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
  grade: Object,
  visible: Boolean
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref(null)
const assessments = ref([])
const students = ref([])

const form = reactive({
  assessmentId: '',
  studentId: '',
  note: null,
  absence: false,
  observation: ''
})

watch(() => props.grade, (newGrade) => {
  if (newGrade) {
    Object.assign(form, newGrade)
  } else {
    Object.assign(form, { assessmentId: '', studentId: '', note: null, absence: false, observation: '' })
  }
}, { immediate: true })

onMounted(async () => {
  try {
    const [assessmentsRes, studentsRes] = await Promise.all([
      fetch('/api/evaluations').then(r => r.json()),
      fetch('/api/eleves').then(r => r.json())
    ])
    assessments.value = assessmentsRes
    students.value = studentsRes
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
