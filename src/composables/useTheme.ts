import { ref, watchEffect } from 'vue'

const isDark = ref<boolean>(
  localStorage.getItem('scolanote_theme')
    ? localStorage.getItem('scolanote_theme') === 'dark'
    : true // Default to dark theme as requested by Prosoc design
)

export function useTheme() {
  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  const setTheme = (dark: boolean) => {
    isDark.value = dark
  }

  watchEffect(() => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('scolanote_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('scolanote_theme', 'light')
    }
  })

  return {
    isDark,
    toggleTheme,
    setTheme
  }
}
