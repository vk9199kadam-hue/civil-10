import { cn } from '@/lib/utils'

interface TabsProps {
  tabs: { value: string; label: string; count?: number }[]
  activeTab: string
  onChange: (value: string) => void
  className?: string
}

export function Tabs({ tabs, activeTab, onChange, className }: TabsProps) {
  return (
    <div className={cn('flex gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 scrollbar-hide', className)}>
      {tabs.map(tab => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={cn(
            'flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors',
            activeTab === tab.value
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span className={cn(
              'rounded-full px-1.5 py-0.5 text-xs',
              activeTab === tab.value ? 'bg-brand-100 text-brand-700' : 'bg-gray-200 text-gray-600'
            )}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}
