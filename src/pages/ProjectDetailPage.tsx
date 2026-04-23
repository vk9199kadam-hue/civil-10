import { useParams } from 'react-router-dom'
import { useProject } from '@/hooks/useProjects'
import { useUnits, useRealtimeUnits, useInventorySummary } from '@/hooks/useUnits'
import { ImageGallery } from '@/components/media/ImageGallery'
import { InventoryGrid } from '@/components/inventory/InventoryGrid'
import { UnitDetailPopover } from '@/components/inventory/UnitDetailPopover'
import { ContactModal } from '@/components/inquiry/ContactModal'
import { StickyBottomCTA } from '@/components/inquiry/StickyBottomCTA'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/Spinner'
import { formatPrice } from '@/lib/utils'
import { MapPin, Shield, Phone, MessageCircle } from 'lucide-react'
import { useState, useMemo } from 'react'
import type { Unit } from '@/types/units'

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: project, isLoading } = useProject(slug || '')
  const { data: units = [] } = useUnits(project?.id || '')
  useRealtimeUnits(project?.id || '')

  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null)
  const [contactOpen, setContactOpen] = useState(false)
  const summary = useInventorySummary(units)

  const blocks = useMemo(() => {
    const b = [...new Set(units.map(u => u.block_or_wing))]
    return b.length ? b : ['A']
  }, [units])

  if (isLoading) return <PageLoader />
  if (!project) return <div className="container-app py-16 text-center text-gray-500">Project not found</div>

  const ownerPhone = project.owner?.phone || ''

  return (
    <div className="pb-20 md:pb-0">
      <div className="container-app py-6 space-y-8">
        <ImageGallery images={project.media || []} />

        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <Badge variant="info" className="capitalize">{project.project_type.replace('_', ' ')}</Badge>
            <Badge variant="custom" className="bg-green-100 text-green-700 capitalize">{project.status.replace(/_/g, ' ')}</Badge>
            {project.rera_number && (
              <Badge variant="success" className="gap-1"><Shield className="h-3 w-3" /> RERA: {project.rera_number}</Badge>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{project.name}</h1>
          <p className="mt-1 text-gray-600">{project.developer_name}</p>
          <div className="mt-2 flex items-center gap-1 text-gray-500">
            <MapPin className="h-4 w-4" />
            <span>{project.address_line}, {project.locality}, {project.city}</span>
          </div>
          {(project.price_range_min || project.price_range_max) && (
            <div className="mt-3 text-2xl font-bold text-brand-700">
              {project.price_range_min ? formatPrice(project.price_range_min) : ''}
              {project.price_range_min && project.price_range_max ? ' - ' : ''}
              {project.price_range_max ? formatPrice(project.price_range_max) : ''}
            </div>
          )}
        </div>

        {/* Key Highlights */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div className="rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{project.total_units}</div>
            <div className="text-xs text-gray-500">Total Units</div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-status-available">{summary.available}</div>
            <div className="text-xs text-gray-500">Available</div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-gray-900">{project.total_floors}</div>
            <div className="text-xs text-gray-500">Floors</div>
          </div>
          <div className="rounded-lg border p-4 text-center">
            <div className="text-2xl font-bold text-status-sold">{summary.sold}</div>
            <div className="text-xs text-gray-500">Sold</div>
          </div>
        </div>

        {/* Inventory Grid */}
        {units.length > 0 && (
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">Unit Availability</h2>
            <InventoryGrid
              units={units}
              blocks={blocks}
              onUnitClick={setSelectedUnit}
              isAdmin={false}
            />
          </div>
        )}

        {/* Description */}
        <div className="rounded-xl border bg-white p-6">
          <h2 className="mb-3 text-lg font-semibold text-gray-900">About this Project</h2>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{project.description}</p>
        </div>

        {/* Amenities */}
        {project.amenities && (project.amenities as string[]).length > 0 && (
          <div className="rounded-xl border bg-white p-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Amenities</h2>
            <div className="flex flex-wrap gap-2">
              {(project.amenities as string[]).map(a => (
                <Badge key={a} variant="custom" className="bg-gray-100 text-gray-700 capitalize">{a.replace(/_/g, ' ')}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Contact */}
        <div className="hidden rounded-xl border bg-white p-6 md:block">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Interested?</h2>
          <div className="flex gap-3">
            {ownerPhone && (
              <>
                <a href={`tel:${ownerPhone}`}><Button variant="secondary" className="gap-2"><Phone className="h-4 w-4" /> Call</Button></a>
                <a href={`https://wa.me/91${ownerPhone}`} target="_blank" rel="noopener noreferrer">
                  <Button variant="whatsapp" className="gap-2"><MessageCircle className="h-4 w-4" /> WhatsApp</Button>
                </a>
              </>
            )}
            <Button onClick={() => setContactOpen(true)}>Send Inquiry</Button>
          </div>
        </div>
      </div>

      {ownerPhone && (
        <StickyBottomCTA phone={ownerPhone} propertyTitle={project.name} onEnquireClick={() => setContactOpen(true)} />
      )}

      <UnitDetailPopover
        unit={selectedUnit}
        projectId={project.id}
        isAdmin={false}
        onClose={() => setSelectedUnit(null)}
      />

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        projectId={project.id}
        propertyTitle={project.name}
      />
    </div>
  )
}
