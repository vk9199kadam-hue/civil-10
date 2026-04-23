import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface FormStepperProps {
  steps: { id: string; title: string }[]
  currentStep: number
}

export function FormStepper({ steps, currentStep }: FormStepperProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center gap-2">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <div className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors',
              index < currentStep
                ? 'bg-green-100 text-green-700'
                : index === currentStep
                  ? 'bg-brand-600 text-white'
                  : 'bg-gray-100 text-gray-400'
            )}>
              {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
            </div>
            <span className={cn(
              'text-sm font-medium',
              index <= currentStep ? 'text-gray-900' : 'text-gray-400'
            )}>
              {step.title}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div className={cn(
              'h-px w-6 flex-shrink-0 sm:w-10',
              index < currentStep ? 'bg-green-300' : 'bg-gray-200'
            )} />
          )}
        </div>
      ))}
    </div>
  )
}
