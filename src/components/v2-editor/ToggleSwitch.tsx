'use client'

interface ToggleSwitchProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  label?: string
  description?: string
}

export default function ToggleSwitch({ enabled, onChange, label, description }: ToggleSwitchProps) {
  return (
    <div className="flex items-center justify-between">
      {(label || description) && (
        <div>
          {label && <span className="text-sm font-medium text-[#4A4A4A]">{label}</span>}
          {description && <p className="text-xs text-[#8B7E6F]">{description}</p>}
        </div>
      )}
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors flex-shrink-0 ${
          enabled ? 'bg-[#3A5A40]' : 'bg-[#D4C9B8]'
        }`}
      >
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`} />
      </button>
    </div>
  )
}
