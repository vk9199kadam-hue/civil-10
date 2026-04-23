import { useParams } from 'react-router-dom'
import { useListing } from '@/hooks/useListings'
import { ImageGallery } from '@/components/media/ImageGallery'
import { ContactModal } from '@/components/inquiry/ContactModal'
import { StickyBottomCTA } from '@/components/inquiry/StickyBottomCTA'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { PageLoader } from '@/components/ui/Spinner'
import { formatPrice, formatArea, getWhatsAppUrl, getCallUrl } from '@/lib/utils'
import { CATEGORY_FIELD_CONFIGS } from '@/lib/category-configs'
import { MapPin, Phone, MessageCircle, Shield, Calendar, Eye } from 'lucide-react'
import { useState } from 'react'

export function ListingDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data: listing, isLoading } = useListing(slug || '')
  const [contactOpen, setContactOpen] = useState(false)

  if (isLoading) return <PageLoader />
  if (!listing) return <div className="container-app py-16 text-center text-gray-500">Property not found</div>

  const specs = listing.category_specs as Record<string, unknown>
  const fields = CATEGORY_FIELD_CONFIGS[listing.category] || []
  const ownerPhone = listing.owner?.phone || ''

  const whatsappMsg = `Hi, I'm interested in: ${listing.title} (${formatPrice(listing.price)}). Please share details.`

  return (
    <div className="pb-20 md:pb-0">
      <div className="container-app py-6">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <ImageGallery images={listing.media || []} />

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant="info" className="capitalize">{listing.category}</Badge>
                <Badge variant="custom" className="bg-gray-100 text-gray-700 capitalize">{listing.listing_type}</Badge>
                {listing.rera_number && (
                  <Badge variant="success" className="gap-1"><Shield className="h-3 w-3" /> RERA: {listing.rera_number}</Badge>
                )}
                {listing.is_verified && <Badge variant="success">Verified</Badge>}
              </div>

              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{listing.title}</h1>

              <div className="mt-2 flex items-center gap-1 text-gray-500">
                <MapPin className="h-4 w-4" />
                <span>{listing.address_line}, {listing.locality}, {listing.city}</span>
              </div>

              <div className="mt-4 flex flex-wrap items-baseline gap-4">
                <span className="text-3xl font-extrabold text-brand-700">{formatPrice(listing.price)}</span>
                {listing.is_negotiable && <Badge variant="success">Negotiable</Badge>}
                {listing.carpet_area && (
                  <span className="text-sm text-gray-500">
                    | {formatArea(listing.carpet_area, listing.area_unit)}
                    {listing.price && listing.carpet_area && (
                      <> ({formatPrice(Math.round(listing.price / listing.carpet_area))}/sqft)</>
                    )}
                  </span>
                )}
              </div>
            </div>

            {/* Specs Table */}
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">Property Details</h2>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3">
                {fields.map(field => {
                  const val = specs[field.name]
                  if (val === undefined || val === null || val === '') return null
                  let display = String(val)
                  if (typeof val === 'boolean') display = val ? 'Yes' : 'No'
                  if (Array.isArray(val)) display = val.join(', ')
                  if (field.options) {
                    const opt = field.options.find(o => o.value === String(val))
                    if (opt) display = opt.label
                  }
                  return (
                    <div key={field.name} className="text-sm">
                      <span className="text-gray-500">{field.label}</span>
                      <div className="font-medium text-gray-900">{display}</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Description */}
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Description</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-600">{listing.description}</p>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {listing.view_count} views</span>
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Listed {new Date(listing.created_at).toLocaleDateString('en-IN')}</span>
            </div>
          </div>

          {/* Sidebar - Contact Card */}
          <div className="hidden lg:block">
            <div className="sticky top-20 rounded-xl border bg-white p-6 shadow-sm">
              {listing.owner && (
                <div className="mb-4">
                  <div className="font-semibold text-gray-900">{listing.owner.full_name}</div>
                  <div className="text-sm text-gray-500 capitalize">{listing.owner.role}</div>
                </div>
              )}
              <div className="space-y-3">
                {ownerPhone && (
                  <a href={getCallUrl(ownerPhone)} className="w-full">
                    <Button variant="secondary" className="w-full gap-2">
                      <Phone className="h-4 w-4" /> Call Now
                    </Button>
                  </a>
                )}
                {ownerPhone && (
                  <a href={getWhatsAppUrl(ownerPhone, whatsappMsg)} target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button variant="whatsapp" className="w-full gap-2">
                      <MessageCircle className="h-4 w-4" /> WhatsApp
                    </Button>
                  </a>
                )}
                <Button className="w-full" onClick={() => setContactOpen(true)}>
                  Send Inquiry
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {ownerPhone && (
        <StickyBottomCTA
          phone={ownerPhone}
          propertyTitle={listing.title}
          onEnquireClick={() => setContactOpen(true)}
        />
      )}

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        listingId={listing.id}
        propertyTitle={listing.title}
      />
    </div>
  )
}
