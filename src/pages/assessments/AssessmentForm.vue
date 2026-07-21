<template>
  <div v-if="visible" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">{{ assessment ? 'Modifier' : 'Créer' }} une évaluation</h2>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">&times;</button>
      </div>

      <form @submit.prevent="onSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Affectation *</label>
            <select v-model="form.assignmentId" required class="w-full border rounded-lg px-3 py-2">
              <option value="">Sélectionner</option>
              <option v-for="a in assignments" :key="a.id" :value="a.id">{{ a.teacherId }} - {{ a.classroomId }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Type d'évaluation *</label>
            <select v-model="form.assessmentTypeId" required class="w-full border rounded-lg px-3 py-2">
              <option value="">Sélectionner</option>
              <option v-for="t in assessmentTypes" :key="t.id" :value="t.id">{{ t.nom }} (coeff: {{ t.coefficient }})</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Période *</label>
            <select v-model="form.periodId" required class="w-full border rounded-lg px-3 py-2">
              <option value="">Sélectionner</option>
              <option v-for="p in periods" :key="p.id" :value="p.id">{{ p.nom }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input v-model="form.titre" type="text" required class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input v-model="form.date" type="date" class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Note maximale</label>
            <input v-model.number="form.noteMax" type="number" class="w-full border rounded-lg px-3 py-2" />
          </div>
          <div class="md:col-span-2">
            <label class="flex items-center">
              <input v-model="form.publie" type="checkbox" class="mr-2" />
              <span class="text-sm font-medium text-gray-700">Publié</span>
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
  assessment: Object,
  visible: Boolean
})

const emit = defineEmits(['close', 'save'])

const saving = ref(false)
const error = ref(null)
const assignments = ref([])
const assessmentTypes = ref([])
const periods = ref([])

const form = reactive({
  assignmentId: '',
  assessmentTypeId: '',
  periodId: '',
  titre: '',
  date: '',
  noteMax: 20,
  publie: false
})

watch(() => props.assessment, (newAssessment) => {
  if (newAssessment) {
    Object.assign(form, newAssessment)
  } else {
    Object.assign(form, { assignmentId: '', assessmentTypeId: '', periodId: '', titre: '', date: '', noteMax: 20, publie: false })
  }
}, { immediate: true })

onMounted(async () => {
  try {
    const [assignmentsRes, typesRes, periodsRes] = await Promise.all([
      fetch('/api/attributions-enseignement').then(r => r.json()),
      fetch('/api/types-evaluations').then(r => r.json()),
      fetch('/api/periodes').then(r => r.json())
    ])
    assignments.value = assignmentsRes
    assessmentTypes.value = typesRes
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
