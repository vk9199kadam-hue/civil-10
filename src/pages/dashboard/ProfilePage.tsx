import { useForm } from 'react-hook-form'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'

export function ProfilePage() {
  const { profile, updateProfile } = useAuth()
  const { toast } = useToast()

  const { register, handleSubmit } = useForm({
    defaultValues: {
      full_name: profile?.full_name || '',
      phone: profile?.phone || '',
      agency_name: profile?.agency_name || '',
      rera_number: profile?.rera_number || '',
    },
  })

  const onSubmit = async (data: Record<string, string>) => {
    const { error } = await updateProfile(data)
    if (error) {
      toast('Failed to update profile', 'error')
    } else {
      toast('Profile updated!', 'success')
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-sm text-gray-500">{profile?.email}</span>
          <Badge variant="info" className="capitalize">{profile?.role}</Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl border bg-white p-6 space-y-4">
        <Input label="Full Name" {...register('full_name')} />
        <Input label="Phone Number" type="tel" {...register('phone')} />
        {(profile?.role === 'agent' || profile?.role === 'owner') && (
          <>
            <Input label="Agency / Company Name" {...register('agency_name')} />
            <Input label="RERA Number" {...register('rera_number')} />
          </>
        )}
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  )
}
