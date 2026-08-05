<template>
  <div class="max-w-3xl mx-auto space-y-6">
    <h1 class="text-2xl font-bold">Mon profil</h1>

    <section class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
      <h2 class="text-lg font-semibold mb-4">Informations</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm text-ink-muted mb-1">Nom d'utilisateur</label>
          <input v-model="form.username" type="text" class="w-full input-base" />
        </div>

        <div>
          <label class="block text-sm text-ink-muted mb-1">Email</label>
          <input v-model="form.email" type="email" class="w-full input-base" />
        </div>

        <div class="sm:col-span-2">
          <label class="block text-sm text-ink-muted mb-1">Téléphone</label>
          <input v-model="form.telephone" type="text" class="w-full input-base" />
        </div>
      </div>

      <div class="mt-4 flex items-center gap-3">
        <button @click="saveProfile" :disabled="saving" class="btn-primary">Enregistrer</button>
        <span v-if="saveMessage" :class="saveError ? 'text-red-600' : 'text-green-600'">{{ saveMessage }}</span>
      </div>
    </section>

    <section class="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-100 dark:border-slate-700">
      <h2 class="text-lg font-semibold mb-4">Changer le mot de passe</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="sm:col-span-2">
          <label class="block text-sm text-ink-muted mb-1">Mot de passe actuel</label>
          <input v-model="pwd.currentPassword" type="password" class="w-full input-base" />
        </div>

        <div>
          <label class="block text-sm text-ink-muted mb-1">Nouveau mot de passe</label>
          <input v-model="pwd.newPassword" type="password" class="w-full input-base" />
        </div>

        <div>
          <label class="block text-sm text-ink-muted mb-1">Confirmer le mot de passe</label>
          <input v-model="pwd.confirmNewPassword" type="password" class="w-full input-base" />
        </div>
      </div>

      <div class="mt-4 flex items-center gap-3">
        <button @click="changePassword" :disabled="changing" class="btn-primary">Modifier le mot de passe</button>
        <span v-if="pwdMessage" :class="pwdError ? 'text-red-600' : 'text-green-600'">{{ pwdMessage }}</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { updateProfile, changePassword } from '@/api/auth'

const auth = useAuthStore()

const form = reactive({ username: '', email: '', telephone: '' })
const pwd = reactive({ currentPassword: '', newPassword: '', confirmNewPassword: '' })

const saving = ref(false)
const changing = ref(false)
const saveMessage = ref('')
const pwdMessage = ref('')
const saveError = ref(false)
const pwdError = ref(false)

onMounted(() => {
  const u = auth.user
  if (u) {
    form.username = u.username || ''
    form.email = (u as any).email || ''
    form.telephone = (u as any).telephone || ''
  }
})

async function saveProfile() {
  saveMessage.value = ''
  saveError.value = false
  saving.value = true
  try {
    await updateProfile({ username: form.username, email: form.email, telephone: form.telephone })
    await auth.fetchProfile()
    saveMessage.value = 'Profil mis à jour.'
  } catch (err: any) {
    saveError.value = true
    saveMessage.value = err?.response?.data?.message || err?.message || 'Erreur lors de la mise à jour.'
  } finally {
    saving.value = false
  }
}

async function changePassword() {
  pwdMessage.value = ''
  pwdError.value = false

  if (!pwd.currentPassword || !pwd.newPassword) {
    pwdError.value = true
    pwdMessage.value = 'Veuillez remplir tous les champs.'
    return
  }

  if (pwd.newPassword !== pwd.confirmNewPassword) {
    pwdError.value = true
    pwdMessage.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  changing.value = true
  try {
    await changePassword({ currentPassword: pwd.currentPassword, newPassword: pwd.newPassword })
    pwdMessage.value = 'Mot de passe modifié avec succès.'
    pwd.currentPassword = ''
    pwd.newPassword = ''
    pwd.confirmNewPassword = ''
  } catch (err: any) {
    pwdError.value = true
    pwdMessage.value = err?.response?.data?.message || err?.message || 'Erreur lors du changement de mot de passe.'
  } finally {
    changing.value = false
  }
}
</script>

<style scoped>
.input-base { @apply rounded-lg border border-slate-200 px-3 py-2 bg-surface text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/30 dark:bg-slate-900 dark:border-slate-700 }
.btn-primary { @apply bg-brand-600 text-white px-4 py-2 rounded-lg hover:bg-brand-700 disabled:opacity-60 }
</style>
