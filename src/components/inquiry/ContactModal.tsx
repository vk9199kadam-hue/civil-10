import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { inquirySchema, type InquiryFormData } from '@/lib/validations/inquiry.schema'
import { useCreateInquiry } from '@/hooks/useInquiries'
import { useToast } from '@/components/ui/Toast'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

interface ContactModalProps {
  open: boolean
  onClose: () => void
  listingId?: string
  projectId?: string
  unitId?: string
  propertyTitle: string
}

export function ContactModal({ open, onClose, listingId, projectId, unitId, propertyTitle }: ContactModalProps) {
  const { toast } = useToast()
  const createInquiry = useCreateInquiry()
  const [submitted, setSubmitted] = useState(false)

  const { register, handleSubmit, formState: { errors }, reset } = useForm<InquiryFormData>({
    resolver: zodResolver(inquirySchema),
  })

  const onSubmit = async (data: InquiryFormData) => {
    try {
      await createInquiry.mutateAsync({
        ...data,
        listing_id: listingId,
        project_id: projectId,
        unit_id: unitId,
        source: 'website',
      })
      setSubmitted(true)
      toast('Inquiry sent successfully!', 'success')
      setTimeout(() => {
        reset()
        setSubmitted(false)
        onClose()
      }, 2000)
    } catch {
      toast('Failed to send inquiry. Please try again.', 'error')
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Contact Owner" size="md">
      {submitted ? (
        <div className="py-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Inquiry Sent!</h3>
          <p className="mt-1 text-sm text-gray-500">The owner will contact you shortly.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <p className="text-sm text-gray-600">
            Inquiring about: <span className="font-medium text-gray-900">{propertyTitle}</span>
          </p>
          <Input label="Your Name *" placeholder="Enter your full name" error={errors.name?.message} {...register('name')} />
          <Input label="Phone Number *" placeholder="10-digit mobile number" type="tel" error={errors.phone?.message} {...register('phone')} />
          <Input label="Email (Optional)" placeholder="your@email.com" type="email" error={errors.email?.message} {...register('email')} />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Message (Optional)</label>
            <textarea
              className="input-field min-h-[80px] resize-none"
              placeholder="I'm interested in this property..."
              {...register('message')}
            />
          </div>
          <Button type="submit" loading={createInquiry.isPending} className="w-full">
            Send Inquiry
          </Button>
        </form>
      )}
    </Modal>
  )
}
