import { useFormContext } from 'react-hook-form'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { FieldConfig } from '@/types/forms'

interface FormFieldProps {
  config: FieldConfig
  namePrefix?: string
}

export function FormField({ config, namePrefix = 'category_specs' }: FormFieldProps) {
  const { register, setValue, watch } = useFormContext()
  const fieldName = `${namePrefix}.${config.name}`

  if (config.type === 'toggle') {
    const checked = watch(fieldName) ?? false
    return (
      <div className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3">
        <span className="text-sm font-medium text-gray-700">{config.label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => setValue(fieldName, !checked, { shouldDirty: true })}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-brand-600' : 'bg-gray-200'}`}
        >
          <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
      </div>
    )
  }

  if (config.type === 'select' && config.options) {
    return (
      <Select
        label={config.label}
        options={config.options}
        placeholder={`Select ${config.label}`}
        {...register(fieldName)}
      />
    )
  }

  if (config.type === 'multi-select' && config.options) {
    const selectedValues: string[] = watch(fieldName) ?? []
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">{config.label}</label>
        <div className="flex flex-wrap gap-2">
          {config.options.map(opt => {
            const isSelected = selectedValues.includes(opt.value)
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  const newVal = isSelected
                    ? selectedValues.filter(v => v !== opt.value)
                    : [...selectedValues, opt.value]
                  setValue(fieldName, newVal, { shouldDirty: true })
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  if (config.type === 'textarea') {
    return (
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">{config.label}</label>
        <textarea
          className="input-field min-h-[80px] resize-none"
          placeholder={config.placeholder}
          {...register(fieldName)}
        />
      </div>
    )
  }

  return (
    <Input
      label={config.label}
      type={config.type === 'number' ? 'number' : 'text'}
      placeholder={config.placeholder}
      suffix={config.unit}
      {...register(fieldName, {
        valueAsNumber: config.type === 'number',
      })}
    />
  )
}
