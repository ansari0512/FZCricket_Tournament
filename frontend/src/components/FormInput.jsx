export default function FormInput({
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  showPassToggle = false,
  showPass,
  setShowPass
}) {
  const baseClasses = 'input no-upper'
  const finalClassName = className ? `${baseClasses} ${className}` : baseClasses

  if (type === 'password' && showPassToggle) {
    return (
      <div className="relative">
        <input
          type={showPass ? 'text' : 'password'}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`${finalClassName} pr-12`}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShowPass(!showPass)}
          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
        >
          {showPass ? '🙈' : '👁️'}
        </button>
      </div>
    )
  }

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={finalClassName}
      required={required}
    />
  )
}