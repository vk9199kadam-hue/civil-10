import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, FormProvider } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { listingBaseSchema, type ListingFormData } from '@/lib/validations/listing.schema'
import { CATEGORY_FIELD_CONFIGS } from '@/lib/category-configs'
import { useCreateListing } from '@/hooks/useListings'
import { useUploadMedia } from '@/hooks/useMedia'
import { useToast } from '@/components/ui/Toast'
import { FormStepper } from '@/components/forms/FormStepper'
import { CategorySelector } from '@/components/forms/CategorySelector'
import { DynamicForm } from '@/components/forms/DynamicForm'
import { ImageUploader } from '@/components/media/ImageUploader'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { formatPrice } from '@/lib/utils'
import type { PropertyCategory } from '@/types/listings'

const STEPS = [
  { id: 'category', title: 'Category' },
  { id: 'basic', title: 'Basic Info' },
  { id: 'specs', title: 'Details' },
  { id: 'media', title: 'Photos' },
  { id: 'review', title: 'Review' },
]

export function ListingFormPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const createListing = useCreateListing()
  const uploadMedia = useUploadMedia()
  const [step, setStep] = useState(0)
  const [images, setImages] = useState<File[]>([])
  const [publishing, setPublishing] = useState(false)

  const methods = useForm<ListingFormData>({
    resolver: zodResolver(listingBaseSchema),
    defaultValues: {
      category: 'residential',
      listing_type: 'sale',
      price_unit: 'total',
      is_negotiable: false,
      city: 'Islampur',
      district: 'Sangli',
      state: 'Maharashtra',
      area_unit: 'sqft',
      status: 'draft',
      category_specs: {},
    },
  })

  const { register, watch, setValue, handleSubmit, formState: { errors } } = methods
  const category = watch('category') as PropertyCategory
  const formData = watch()

  const categoryFields = CATEGORY_FIELD_CONFIGS[category] || []

  const next = () => setStep(s => Math.min(s + 1, STEPS.length - 1))
  const prev = () => setStep(s => Math.max(s - 1, 0))

  const onPublish = async (data: ListingFormData) => {
    setPublishing(true)
    try {
      data.status = 'active'
      window.setTimeout(() => {
        if (publishing) {
           toast('Saving is taking a long time. Is your internet connected?', 'error')
           setPublishing(false)
        }
      }, 5000)

      const listing = await Promise.race([
        createListing.mutateAsync(data),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase took too long to save! Check Database Rules.')), 8000))
      ]) as any;

      // Try to upload images, but don't fail the whole property if storage is disabled
      if (images.length > 0) {
        try {
          for (let i = 0; i < images.length; i++) {
            await Promise.race([
              uploadMedia.mutateAsync({
                file: images[i],
                listingId: listing.id,
                sortOrder: i,
                isCover: i === 0,
              }),
              new Promise((_, reject) => setTimeout(() => reject(new Error('Storage upload blocked.')), 3000))
            ])
          }
        } catch (mediaErr: any) {
          console.error("Storage Error:", mediaErr);
          toast(`Photo upload failed: ${mediaErr?.message}. Property saved.`, 'error')
          navigate('/dashboard/listings')
          setPublishing(false)
          return
        }
      }

      toast('Property listed successfully!', 'success')
      navigate('/dashboard/listings')
    } catch (err: any) {
      toast(err?.message || 'Failed to publish. Please try again.', 'error')
    }
    setPublishing(false)
  }

  const handleFormError = (errors: any) => {
    console.log('Form Errors:', errors)
    const firstError = Object.values(errors)[0] as any
    if (firstError?.message) {
      toast(`Please fix: ${firstError.message}`, 'error')
    } else {
      toast('Please fill in all required fields correctly.', 'error')
    }
  }

  const onSaveDraft = async () => {
    const data = methods.getValues()
    setPublishing(true)
    try {
      data.status = 'draft'
      await createListing.mutateAsync(data)
      toast('Draft saved!', 'success')
      navigate('/dashboard/listings')
    } catch {
      toast('Failed to save draft.', 'error')
    }
    setPublishing(false)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Post New Property</h1>
        <p className="text-sm text-gray-500">Fill in the details to list your property</p>
      </div>

      <FormStepper steps={STEPS} currentStep={step} />

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onPublish, handleFormError)} className="space-y-6">

          {/* Step 0: Category */}
          {step === 0 && (
            <div className="rounded-xl border bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold">Select Property Category</h2>
              <CategorySelector value={category} onChange={(c) => setValue('category', c)} />
              <div className="mt-6 flex justify-end">
                <Button type="button" onClick={next}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="rounded-xl border bg-white p-6 space-y-4">
              <h2 className="text-lg font-semibold">Basic Information</h2>
              <Input label="Property Title *" placeholder="e.g. 2 BHK Flat in Krishna Nagar" error={errors.title?.message} {...register('title')} />
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Description *</label>
                <textarea className="input-field min-h-[100px]" placeholder="Describe your property..." {...register('description')} />
                {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <Select label="Listing Type" options={[{ value: 'sale', label: 'Sale' }, { value: 'rent', label: 'Rent' }, { value: 'lease', label: 'Lease' }]} {...register('listing_type')} />
                <Input label="Price *" type="number" prefix="₹" error={errors.price?.message} {...register('price', { valueAsNumber: true })} />
                <Select label="Price Unit" options={[{ value: 'total', label: 'Total' }, { value: 'per_sqft', label: 'Per Sq.ft' }, { value: 'per_month', label: 'Per Month' }]} {...register('price_unit')} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <Input label="Carpet Area" type="number" suffix="sqft" {...register('carpet_area', { valueAsNumber: true })} />
                <Input label="Built-up Area" type="number" suffix="sqft" {...register('built_up_area', { valueAsNumber: true })} />
              </div>
              <Input label="Address *" placeholder="Full address" error={errors.address_line?.message} {...register('address_line')} />
              <div className="grid gap-4 sm:grid-cols-3">
                <Input label="Locality *" placeholder="e.g. Krishna Nagar" error={errors.locality?.message} {...register('locality')} />
                <Input label="City" value="Islampur" {...register('city')} />
                <Input label="Pincode *" placeholder="6-digit" error={errors.pincode?.message} {...register('pincode')} />
              </div>
              <Input label="RERA Number" placeholder="Optional" {...register('rera_number')} />
              <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={prev}>Back</Button>
                <Button type="button" onClick={next}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 2: Category Specs */}
          {step === 2 && (
            <div className="rounded-xl border bg-white p-6 space-y-4">
              <h2 className="text-lg font-semibold capitalize">{category} Details</h2>
              <DynamicForm fields={categoryFields} />
              <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={prev}>Back</Button>
                <Button type="button" onClick={next}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 3: Photos */}
          {step === 3 && (
            <div className="rounded-xl border bg-white p-6 space-y-4">
              <h2 className="text-lg font-semibold">Property Photos</h2>
              <p className="text-sm text-gray-500">Upload 3-20 images. First image becomes the cover photo.</p>
              <ImageUploader images={images} onChange={setImages} />
              <div className="flex justify-between">
                <Button type="button" variant="secondary" onClick={prev}>Back</Button>
                <Button type="button" onClick={next}>Next</Button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="rounded-xl border bg-white p-6 space-y-4">
              <h2 className="text-lg font-semibold">Review & Publish</h2>
              <div className="rounded-lg bg-gray-50 p-4 space-y-2 text-sm">
                <div><span className="text-gray-500">Category:</span> <Badge variant="info" className="capitalize ml-1">{formData.category}</Badge></div>
                <div><span className="text-gray-500">Title:</span> <span className="font-medium">{formData.title || '—'}</span></div>
                <div><span className="text-gray-500">Price:</span> <span className="font-bold text-brand-700">{formData.price ? formatPrice(formData.price) : '—'}</span></div>
                <div><span className="text-gray-500">Location:</span> <span className="font-medium">{formData.locality || '—'}, {formData.city}</span></div>
                <div><span className="text-gray-500">Photos:</span> <span className="font-medium">{images.length} image{images.length !== 1 ? 's' : ''}</span></div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                <Button type="button" variant="secondary" onClick={prev}>Back</Button>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={onSaveDraft} loading={publishing}>Save Draft</Button>
                  <Button type="submit" loading={publishing}>Publish Now</Button>
                </div>
              </div>
            </div>
          )}
        </form>
      </FormProvider>
    </div>
  )
}
