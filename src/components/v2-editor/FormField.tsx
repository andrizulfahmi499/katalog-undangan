interface FormFieldProps {
  label: string
  hint?: string
  children: React.ReactNode
  required?: boolean
}

export default function FormField({ label, hint, children, required }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-[#4A4A4A]">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-[#B0A898]">{hint}</p>}
    </div>
  )
}

export function TextInput({ value, onChange, placeholder, type = 'text', ...props }: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  type?: string
  [key: string]: any
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C9B8] bg-[#FAFAF8] text-[#2D2D2D] placeholder-[#B0A898] focus:outline-none focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40]/20 transition-all text-sm"
      {...props}
    />
  )
}

export function TextArea({ value, onChange, placeholder, rows = 3, ...props }: {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  rows?: number
  [key: string]: any
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C9B8] bg-[#FAFAF8] text-[#2D2D2D] placeholder-[#B0A898] focus:outline-none focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40]/20 transition-all text-sm resize-none"
      {...props}
    />
  )
}

export function SelectInput({ value, onChange, options, placeholder }: {
  value: string
  onChange: (val: string) => void
  options: { value: string; label: string }[]
  placeholder?: string
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3.5 py-2.5 rounded-lg border border-[#D4C9B8] bg-[#FAFAF8] text-[#2D2D2D] focus:outline-none focus:border-[#3A5A40] focus:ring-1 focus:ring-[#3A5A40]/20 transition-all text-sm"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
