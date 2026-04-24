import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

export const useSubmit = (successMessage, redirectPath = null) => {
  const navigate = useNavigate()

  const handleSubmit = async (submitFn, formData, setLoading, additionalValidation = null) => {
    // Additional validation if provided
    if (additionalValidation) {
      const validationError = additionalValidation(formData)
      if (validationError) {
        toast.error(validationError)
        return
      }
    }

    setLoading(true)
    try {
      const res = await submitFn(formData)
      toast.success(successMessage)
      if (redirectPath) navigate(redirectPath)
      return res
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { handleSubmit }
}