export interface FieldOption {
  value: string
  label: string
}

export interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'number' | 'select' | 'toggle' | 'multi-select' | 'textarea'
  required?: boolean
  placeholder?: string
  unit?: string
  options?: FieldOption[]
}

export interface FormStep {
  id: string
  title: string
  description: string
}
