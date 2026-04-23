import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { unitUpdateSchema, type UnitUpdateFormData } from '@/lib/validations/unit.schema'
import { useUpdateUnitStatus } from '@/hooks/useUnits'
import { useToast } from '@/components/ui/Toast'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Input } from '@/components/ui/Input'
import { formatPrice } from '@/lib/utils'
import type { Unit } from '@/types/units'

interface UnitDetailPopoverProps {
  unit: Unit | null
  projectId: string
  isAdmin: boolean
  onClose: () => void
}

export function UnitDetailPopover({ unit, projectId, isAdmin, onClose }: UnitDetailPopoverProps) {
  const { toast } = useToast()
  const updateStatus = useUpdateUnitStatus()
  const [isEditing, setIsEditing] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<UnitUpdateFormData>({
    resolver: zodResolver(unitUpdateSchema),
    values: unit ? {
      status: unit.status,
      price: unit.price,
      buyer_name: unit.buyer_name,
      buyer_phone: unit.buyer_phone,
      remarks: unit.remarks,
    } : undefined,
  })

  if (!unit) return null

  const onSubmit = async (data: UnitUpdateFormData) => {
    try {
      await updateStatus.mutateAsync({ ...data, unitId: unit.id, projectId })
      toast('Unit updated successfully', 'success')
      setIsEditing(false)
      onClose()
    } catch {
      toast('Failed to update unit', 'error')
    }
  }

  const statusColors: Record<string, string> = {
    available: 'text-emerald-600', booked: 'text-amber-600', sold: 'text-red-600', blocked: 'text-gray-700',
  }

  return (
    <Modal open={!!unit} onClose={onClose} title={`Unit ${unit.unit_number}`} size="md">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div><span className="text-gray-500">Type:</span> <span className="font-medium">{unit.unit_type}</span></div>
          <div><span className="text-gray-500">Floor:</span> <span className="font-medium">{unit.floor_number}</span></div>
          <div><span className="text-gray-500">Block:</span> <span className="font-medium">{unit.block_or_wing}</span></div>
          <div>
            <span className="text-gray-500">Status:</span>{' '}
            <span className={`font-bold capitalize ${statusColors[unit.status]}`}>{unit.status}</span>
          </div>
          {unit.carpet_area && <div><span className="text-gray-500">Area:</span> <span className="font-medium">{unit.carpet_area} sqft</span></div>}
          {unit.price && <div><span className="text-gray-500">Price:</span> <span className="font-medium">{formatPrice(unit.price)}</span></div>}
        </div>

        {isAdmin && !isEditing && (
          <Button variant="secondary" className="w-full" onClick={() => setIsEditing(true)}>
            Edit Unit
          </Button>
        )}

        {isAdmin && isEditing && (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 border-t pt-4">
            <Select
              label="Status"
              options={[
                { value: 'available', label: 'Available' },
                { value: 'booked', label: 'Booked' },
                { value: 'sold', label: 'Sold' },
                { value: 'blocked', label: 'Blocked' },
              ]}
              error={errors.status?.message}
              {...register('status')}
            />
            <Input label="Price" type="number" prefix="₹" error={errors.price?.message} {...register('price', { valueAsNumber: true })} />
            <Input label="Buyer Name" {...register('buyer_name')} />
            <Input label="Buyer Phone" {...register('buyer_phone')} />
            <Input label="Remarks" {...register('remarks')} />
            <div className="flex gap-2">
              <Button type="submit" loading={updateStatus.isPending} className="flex-1">Save</Button>
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)} className="flex-1">Cancel</Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  )
}
