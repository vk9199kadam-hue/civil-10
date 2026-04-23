import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { signupSchema, type SignupFormData } from '@/lib/validations/auth.schema'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { APP_NAME } from '@/lib/constants'

export function SignupPage() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { role: 'user' },
  })

  const onSubmit = async (data: SignupFormData) => {
    setLoading(true)
    const { error } = await signUp(data.email, data.password, {
      full_name: data.full_name,
      phone: data.phone,
      role: data.role,
    })
    setLoading(false)
    if (error) {
      toast(error.message || 'Signup failed', 'error')
    } else {
      toast('Account created! Please check your email to verify.', 'success')
      navigate('/login')
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-brand-600 text-xl font-bold text-white">IP</div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="mt-1 text-sm text-gray-500">Join {APP_NAME} to list or find properties</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input label="Full Name" placeholder="Enter your name" error={errors.full_name?.message} {...register('full_name')} />
          <Input label="Email" type="email" placeholder="you@example.com" error={errors.email?.message} {...register('email')} />
          <Input label="Phone (Optional)" type="tel" placeholder="10-digit mobile" error={errors.phone?.message} {...register('phone')} />
          <Select
            label="I am a"
            options={[
              { value: 'user', label: 'Buyer / Renter (Looking for property)' },
              { value: 'owner', label: 'Property Owner' },
              { value: 'agent', label: 'Agent / Broker' },
            ]}
            error={errors.role?.message}
            {...register('role')}
          />
          <Input label="Password" type="password" placeholder="Min 6 characters" error={errors.password?.message} {...register('password')} />
          <Input label="Confirm Password" type="password" placeholder="Re-enter password" error={errors.confirm_password?.message} {...register('confirm_password')} />
          <Button type="submit" loading={loading} className="w-full">Create Account</Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
