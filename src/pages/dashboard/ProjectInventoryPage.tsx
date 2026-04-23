import { useParams } from 'react-router-dom'
import { useProject } from '@/hooks/useProjects'
import { useUnits, useRealtimeUnits } from '@/hooks/useUnits'
import { InventoryGrid } from '@/components/inventory/InventoryGrid'
import { UnitDetailPopover } from '@/components/inventory/UnitDetailPopover'
import { PageLoader } from '@/components/ui/Spinner'
import { useState, useMemo } from 'react'
import type { Unit } from '@/types/units'

export function ProjectInventoryPage() {
  const { id } = useParams<{ id: string }>()
  const { data: project, isLoading } = useProject(id || '')
  const { data: units = [] } = useUnits(id || '')
  useRealtimeUnits(id || '')

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)

  const blocks = useMemo(() => {
    const b = [...new Set(units.map(u => u.block_or_wing))]
    return b.length ? b : ['A']
  }, [units])

  if (isLoading) return <PageLoader />
  if (!project) return <div className="text-center text-gray-500 py-16">Project not found</div>

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
        <p className="text-sm text-gray-500">Inventory Management — {units.length} units</p>
      </div>

      <InventoryGrid
        units={units}
        blocks={blocks}
        onUnitClick={setSelectedUnit}
        isAdmin={true}
      />

      <UnitDetailPopover
        unit={selectedUnit}
        projectId={project.id}
        isAdmin={true}
        onClose={() => setSelectedUnit(null)}
      />
    </div>
  )
}
