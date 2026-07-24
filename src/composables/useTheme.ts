import { ref, watchEffect } from 'vue'

const isDark = ref<boolean>(
  localStorage.getItem('gestbulletin_theme')
    ? localStorage.getItem('gestbulletin_theme') === 'dark'
    : false // GestBulletin default: light theme
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
      localStorage.setItem('gestbulletin_theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('gestbulletin_theme', 'light')
    }
  })

  return {
    isDark,
    toggleTheme,
    setTheme
  }
}
