import { ref, watchEffect } from 'vue'

const getInitialDark = () => {
  const stored = localStorage.getItem('gestbulletin_theme')
  if (stored === 'dark') return true
  if (stored === 'light') return false
  // Fallback to OS preference
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return false
}

const isDark = ref<boolean>(getInitialDark())

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

  // React to system theme changes
  if (typeof window !== 'undefined' && window.matchMedia) {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => {
      // Only auto-switch when user has not explicitly chosen a theme
      const stored = localStorage.getItem('gestbulletin_theme')
      if (!stored) {
        isDark.value = e.matches
      }
    }
    try {
      mq.addEventListener('change', handler)
    } catch {
      mq.addListener(handler)
    }
  }

  return {
    isDark,
    toggleTheme,
    setTheme
  }
}
