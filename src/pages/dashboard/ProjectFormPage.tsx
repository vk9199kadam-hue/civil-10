import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { projectSchema, type ProjectFormData } from '@/lib/validations/project.schema'
import { useCreateProject } from '@/hooks/useProjects'
import { useBulkCreateUnits } from '@/hooks/useUnits'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { PROJECT_TYPES, PROJECT_STATUSES } from '@/lib/constants'

export function ProjectFormPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const createProject = useCreateProject()
  const bulkCreateUnits = useBulkCreateUnits()
  const [loading, setLoading] = useState(false)

  const [blocks, setBlocks] = useState([{ name: 'A', floors: 5, unitsPerFloor: 4, unitType: '2BHK' }])

  const { register, handleSubmit, formState: { errors } } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      project_type: 'apartment',
      city: 'Islampur',
      pincode: '',
      status: 'upcoming',
      total_floors: 5,
      units_per_floor: 4,
      amenities: [],
    },
  })

  const addBlock = () => {
    const letter = String.fromCharCode(65 + blocks.length)
    setBlocks(prev => [...prev, { name: letter, floors: 5, unitsPerFloor: 4, unitType: '2BHK' }])
  }

  const updateBlock = (index: number, field: string, value: string | number) => {
    setBlocks(prev => prev.map((b, i) => i === index ? { ...b, [field]: value } : b))
  }

  const removeBlock = (index: number) => {
    if (blocks.length > 1) setBlocks(prev => prev.filter((_, i) => i !== index))
  }

  const totalUnits = blocks.reduce((sum, b) => sum + b.floors * b.unitsPerFloor, 0)

  const onSubmit = async (data: ProjectFormData) => {
    setLoading(true)
    try {
      data.total_floors = Math.max(...blocks.map(b => b.floors))
      data.units_per_floor = blocks[0]?.unitsPerFloor || 4

      const project = await createProject.mutateAsync(data)

      const units = blocks.flatMap(block =>
        Array.from({ length: block.floors }, (_, floorIdx) =>
          Array.from({ length: block.unitsPerFloor }, (_, unitIdx) => ({
            project_id: project.id,
            unit_number: `${block.name}-${floorIdx + 1}0${unitIdx + 1}`,
            floor_number: floorIdx,
            block_or_wing: block.name,
            unit_type: block.unitType,
            grid_row: floorIdx,
            grid_col: unitIdx,
          }))
        ).flat()
      )

      if (units.length > 0) {
        await bulkCreateUnits.mutateAsync(units)
      }

      toast(`Project published with ${units.length} units!`, 'success')
      navigate(`/dashboard/projects/${project.id}/inventory`)
    } catch {
      toast('Failed to create project', 'error')
    }
    setLoading(false)
  }

  const onFormError = (errors: any) => {
    console.log('Project Form Errors:', errors)
    const firstError = Object.values(errors)[0] as any
    if (firstError?.message) {
      toast(`Please fix: ${firstError.message}`, 'error')
    } else {
      toast('Please fill in all required fields.', 'error')
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create New Project</h1>
        <p className="text-sm text-gray-500">Set up a multi-unit development with inventory grid</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit, onFormError)} className="space-y-6">

        <div className="rounded-xl border bg-white p-6 space-y-4">
          <h2 className="text-lg font-semibold">Project Details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Project Name *" placeholder="e.g. Krishna Heights" error={errors.name?.message} {...register('name')} />
            <Input label="Developer Name *" placeholder="Developer / Builder" error={errors.developer_name?.message} {...register('developer_name')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select label="Project Type" options={PROJECT_TYPES.map(t => ({ value: t.value, label: t.label }))} {...register('project_type')} />
            <Select label="Status" options={PROJECT_STATUSES.map(s => ({ value: s.value, label: s.label }))} {...register('status')} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Description *</label>
            <textarea className="input-field min-h-[80px]" placeholder="About this project..." {...register('description')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Input label="Address *" placeholder="Full address" error={errors.address_line?.message} {...register('address_line')} />
            <Input label="Locality *" placeholder="e.g. Station Area" error={errors.locality?.message} {...register('locality')} />
            <Input label="Pincode *" placeholder="6-digit" error={errors.pincode?.message} {...register('pincode')} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Min Price" type="number" prefix="₹" {...register('price_range_min', { valueAsNumber: true })} />
            <Input label="Max Price" type="number" prefix="₹" {...register('price_range_max', { valueAsNumber: true })} />
          </div>
          <Input label="RERA Number" placeholder="Optional" {...register('rera_number')} />
          <Input label="Possession Date" placeholder="e.g. Dec 2026" {...register('possession_date')} />
        </div>

        {/* Block Configurator */}
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Unit Configuration</h2>
              <p className="text-sm text-gray-500">Total units: <span className="font-bold text-brand-700">{totalUnits}</span></p>
            </div>
            <Button type="button" variant="secondary" size="sm" onClick={addBlock}>+ Add Block</Button>
          </div>

          {blocks.map((block, index) => (
            <div key={index} className="rounded-lg border p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-medium text-gray-900">Block {block.name}</span>
                {blocks.length > 1 && (
                  <button type="button" onClick={() => removeBlock(index)} className="text-xs text-red-500 hover:text-red-700">Remove</button>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Floors</label>
                  <input type="number" min={1} value={block.floors} onChange={(e) => updateBlock(index, 'floors', Number(e.target.value))} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Units/Floor</label>
                  <input type="number" min={1} value={block.unitsPerFloor} onChange={(e) => updateBlock(index, 'unitsPerFloor', Number(e.target.value))} className="input-field" />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-gray-600">Unit Type</label>
                  <select value={block.unitType} onChange={(e) => updateBlock(index, 'unitType', e.target.value)} className="input-field">
                    <option value="1BHK">1 BHK</option>
                    <option value="2BHK">2 BHK</option>
                    <option value="3BHK">3 BHK</option>
                    <option value="4BHK">4 BHK</option>
                    <option value="shop">Shop</option>
                    <option value="office">Office</option>
                    <option value="plot">Plot</option>
                  </select>
                </div>
              </div>
              <p className="text-xs text-gray-400">{block.floors * block.unitsPerFloor} units in this block</p>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/projects')}>Cancel</Button>
          <Button type="submit" loading={loading}>Publish Project ({totalUnits} units)</Button>
        </div>
      </form>
    </div>
  )
}
