import { Phone, MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { getWhatsAppUrl, getCallUrl } from '@/lib/utils'

interface StickyBottomCTAProps {
  phone: string
  propertyTitle: string
  onEnquireClick: () => void
}

export function StickyBottomCTA({ phone, propertyTitle, onEnquireClick }: StickyBottomCTAProps) {
  const whatsappMsg = `Hi, I'm interested in: ${propertyTitle}. Please share more details.`

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t bg-white px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex gap-2">
        <a href={getCallUrl(phone)} className="flex-1">
          <Button variant="secondary" className="w-full gap-2">
            <Phone className="h-4 w-4" /> Call
          </Button>
        </a>
        <a href={getWhatsAppUrl(phone, whatsappMsg)} target="_blank" rel="noopener noreferrer" className="flex-1">
          <Button variant="whatsapp" className="w-full gap-2">
            <MessageCircle className="h-4 w-4" /> WhatsApp
          </Button>
        </a>
        <Button onClick={onEnquireClick} className="flex-1">
          Enquire
        </Button>
      </div>
    </div>
  )
}
