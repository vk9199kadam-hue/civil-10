import { cn } from '@/lib/utils'
import { Home, Building2, Map, Factory, Hotel } from 'lucide-react'
import type { PropertyCategory } from '@/types/listings'

interface CategorySelectorProps {
  value?: PropertyCategory
  onChange: (category: PropertyCategory) => void
}

const categories = [
  { value: 'residential' as const, label: 'Residential', description: 'Flats, Villas, PG', icon: Home, color: 'border-blue-500 bg-blue-50 text-blue-700' },
  { value: 'commercial' as const, label: 'Commercial', description: 'Offices, Shops, Warehouses', icon: Building2, color: 'border-purple-500 bg-purple-50 text-purple-700' },
  { value: 'land' as const, label: 'Land & Plots', description: 'NA Plots, Agricultural', icon: Map, color: 'border-amber-500 bg-amber-50 text-amber-700' },
  { value: 'industrial' as const, label: 'Industrial', description: 'Factories, Sheds', icon: Factory, color: 'border-slate-500 bg-slate-50 text-slate-700' },
  { value: 'hospitality' as const, label: 'Hospitality', description: 'Hotels, Resorts', icon: Hotel, color: 'border-rose-500 bg-rose-50 text-rose-700' },
]

export function CategorySelector({ value, onChange }: CategorySelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map(cat => {
        const Icon = cat.icon
        const isSelected = value === cat.value
        return (
          <button
            key={cat.value}
            type="button"
            onClick={() => onChange(cat.value)}
            className={cn(
              'flex items-center gap-4 rounded-xl border-2 p-4 text-left transition-all',
              isSelected
                ? cat.color
                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            )}
          >
            <div className={cn(
              'flex h-12 w-12 items-center justify-center rounded-lg',
              isSelected ? 'bg-white/60' : 'bg-gray-100'
            )}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <div className="font-semibold">{cat.label}</div>
              <div className="text-xs opacity-70">{cat.description}</div>
            </div>
          </button>
        )
      })}
    </div>
  )
}
