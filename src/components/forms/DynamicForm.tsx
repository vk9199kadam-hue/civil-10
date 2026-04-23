import { FormField } from './FormField'
import type { FieldConfig } from '@/types/forms'

interface DynamicFormProps {
  fields: FieldConfig[]
  namePrefix?: string
}

export function DynamicForm({ fields, namePrefix }: DynamicFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map(field => (
        <div key={field.name} className={field.type === 'multi-select' || field.type === 'textarea' ? 'sm:col-span-2' : ''}>
          <FormField config={field} namePrefix={namePrefix} />
        </div>
      ))}
    </div>
  )
}
