const AUTO_ORDRE_FIELDS = ['ordre', 'numeroOrdre', 'numero_ordre']

export function useNumeroOrdre() {
  function cleanPayload(payload) {
    const cleaned = { ...payload }
    for (const field of AUTO_ORDRE_FIELDS) {
      delete cleaned[field]
    }
    return cleaned
  }

  return {
    cleanPayload
  }
}
