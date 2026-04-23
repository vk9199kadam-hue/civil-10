import { cn } from '@/lib/utils'
import type { Unit, UnitStatus } from '@/types/units'
import { useState } from 'react'

interface InventoryGridProps {
  units: Unit[]
  blocks: string[]
  onUnitClick?: (unit: Unit) => void
  isAdmin?: boolean
}

const statusColors: Record<UnitStatus, string> = {
  available: 'bg-status-available hover:bg-emerald-600 text-white cursor-pointer',
  booked: 'bg-status-booked text-white',
  sold: 'bg-status-sold text-white',
  blocked: 'bg-status-blocked text-white',
}

const statusEmojis: Record<UnitStatus, string> = {
  available: '🟢',
  booked: '🟡',
  sold: '🔴',
  blocked: '⚫',
}

export function InventoryGrid({ units, blocks, onUnitClick, isAdmin }: InventoryGridProps) {
  const [activeBlock, setActiveBlock] = useState(blocks[0] || '')

  const blockUnits = units.filter(u => u.block_or_wing === activeBlock)
  const maxFloor = Math.max(...blockUnits.map(u => u.floor_number), 0)
  const maxCol = Math.max(...blockUnits.map(u => u.grid_col), 0)

  const summary = {
    available: units.filter(u => u.status === 'available').length,
    booked: units.filter(u => u.status === 'booked').length,
    sold: units.filter(u => u.status === 'sold').length,
    blocked: units.filter(u => u.status === 'blocked').length,
  }

  return (
    <div className="space-y-4">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-sm">
        {Object.entries(statusEmojis).map(([status, emoji]) => (
          <span key={status} className="flex items-center gap-1.5">
            <span>{emoji}</span>
            <span className="capitalize text-gray-600">{status}</span>
            <span className="font-semibold text-gray-900">({summary[status as UnitStatus]})</span>
          </span>
        ))}
        <span className="ml-auto text-gray-500">Total: {units.length}</span>
      </div>

      {/* Block Tabs */}
      {blocks.length > 1 && (
        <div className="flex gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1 scrollbar-hide">
          {blocks.map(block => (
            <button
              key={block}
              onClick={() => setActiveBlock(block)}
              className={cn(
                'rounded-md px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap',
                activeBlock === block ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {block}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      <div className="overflow-x-auto rounded-xl border bg-white p-4">
        <div className="inline-grid gap-1.5" style={{ gridTemplateColumns: `auto repeat(${maxCol + 1}, 1fr)` }}>
          {/* Header row */}
          <div />
          {Array.from({ length: maxCol + 1 }, (_, i) => (
            <div key={`h-${i}`} className="text-center text-xs font-medium text-gray-400 pb-1">
              Unit {i + 1}
            </div>
          ))}

          {/* Floor rows (top to bottom: highest floor first) */}
          {Array.from({ length: maxFloor + 1 }, (_, fi) => {
            const floor = maxFloor - fi
            return [
              <div key={`f-${floor}`} className="flex items-center pr-2 text-xs font-medium text-gray-400">
                F{floor}
              </div>,
              ...Array.from({ length: maxCol + 1 }, (_, col) => {
                const unit = blockUnits.find(u => u.floor_number === floor && u.grid_col === col)
                if (!unit) return <div key={`e-${floor}-${col}`} className="h-12 w-16 sm:w-20" />
                return (
                  <button
                    key={unit.id}
                    onClick={() => (isAdmin || unit.status === 'available') && onUnitClick?.(unit)}
                    disabled={!isAdmin && unit.status !== 'available'}
                    className={cn(
                      'flex h-12 w-16 sm:w-20 flex-col items-center justify-center rounded-lg text-xs font-medium transition-all',
                      statusColors[unit.status],
                      (isAdmin || unit.status === 'available') && 'hover:scale-105 hover:shadow-md',
                      !isAdmin && unit.status !== 'available' && 'cursor-default opacity-80'
                    )}
                    title={`${unit.unit_number} - ${unit.unit_type} - ${unit.status}`}
                  >
                    <span className="font-bold leading-tight">{unit.unit_number}</span>
                    <span className="text-[10px] opacity-80">{unit.unit_type}</span>
                  </button>
                )
              })
            ]
          }).flat()}
        </div>
      </div>
    </div>
  )
}
