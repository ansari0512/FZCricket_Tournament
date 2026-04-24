import { useState } from 'react'

export const useForm = (initialState = {}) => {
  const [form, setForm] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const updateField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const resetForm = () => {
    setForm(initialState)
  }

  return {
    form,
    setForm,
    loading,
    setLoading,
    showPass,
    setShowPass,
    updateField,
    resetForm
  }
}