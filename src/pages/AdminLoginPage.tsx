import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { Shield, Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'

const adminLoginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type AdminLoginForm = z.infer<typeof adminLoginSchema>

export function AdminLoginPage() {
  const { signIn, user, profile, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as any)?.from?.pathname || '/admin'

  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { register, handleSubmit, formState: { errors } } = useForm<AdminLoginForm>({
    resolver: zodResolver(adminLoginSchema),
  })

  // If already admin, redirect immediately
  useEffect(() => {
    if (!loading && user && profile?.role === 'admin') {
      navigate(from, { replace: true })
    }
  }, [user, profile, loading, navigate, from])

  const onSubmit = async (data: AdminLoginForm) => {
    setIsLoading(true)
    setError(null)

    const { error: signInError } = await signIn(data.email, data.password)

    if (signInError) {
      setIsLoading(false)
      setError('Invalid email or password. Admin access only.')
      return
    }

    // Auth state will update — useEffect above will redirect if admin
    // If not admin, show error
    setTimeout(() => {
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="admin-login-root">
      {/* Animated background */}
      <div className="admin-login-bg">
        <div className="admin-login-orb orb-1" />
        <div className="admin-login-orb orb-2" />
        <div className="admin-login-orb orb-3" />
      </div>

      <div className="admin-login-card">
        {/* Header */}
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="admin-login-title">Admin Portal</h1>
          <p className="admin-login-subtitle">Islampur Civil Project</p>
          <div className="admin-login-badge">
            <Lock className="h-3 w-3" />
            Secure Access Only
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="admin-login-form" noValidate>

          {/* Error Alert */}
          {error && (
            <div className="admin-login-error">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email */}
          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-email">
              Admin Email
            </label>
            <div className="admin-input-wrap">
              <Mail className="admin-input-icon" />
              <input
                id="admin-email"
                type="email"
                autoComplete="email"
                placeholder="admin@example.com"
                className={`admin-input ${errors.email ? 'admin-input-error' : ''}`}
                {...register('email')}
              />
            </div>
            {errors.email && (
              <p className="admin-field-error">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-password">
              Password
            </label>
            <div className="admin-input-wrap">
              <Lock className="admin-input-icon" />
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Enter admin password"
                className={`admin-input admin-input-password ${errors.password ? 'admin-input-error' : ''}`}
                {...register('password')}
              />
              <button
                type="button"
                className="admin-eye-btn"
                onClick={() => setShowPassword(p => !p)}
                tabIndex={-1}
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="admin-field-error">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="admin-submit-btn"
          >
            {isLoading ? (
              <span className="admin-submit-loading">
                <span className="admin-spinner" />
                Verifying...
              </span>
            ) : (
              <>
                <Shield className="h-4 w-4" />
                Sign In as Admin
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="admin-login-footer">
          Not an admin?{' '}
          <a href="/" className="admin-login-link">Go to main site</a>
        </p>
      </div>

      <style>{`
        .admin-login-root {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0f0f1a;
          position: relative;
          overflow: hidden;
          padding: 1rem;
        }

        .admin-login-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .admin-login-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.35;
          animation: orbFloat 8s ease-in-out infinite;
        }

        .orb-1 {
          width: 400px; height: 400px;
          background: radial-gradient(circle, #6c3bff, transparent);
          top: -100px; left: -100px;
          animation-delay: 0s;
        }

        .orb-2 {
          width: 300px; height: 300px;
          background: radial-gradient(circle, #ff3b6c, transparent);
          bottom: -80px; right: -80px;
          animation-delay: 3s;
        }

        .orb-3 {
          width: 250px; height: 250px;
          background: radial-gradient(circle, #3b82f6, transparent);
          top: 50%; left: 60%;
          animation-delay: 5s;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(20px, -20px) scale(1.05); }
          66% { transform: translate(-15px, 15px) scale(0.95); }
        }

        .admin-login-card {
          position: relative;
          z-index: 10;
          width: 100%;
          max-width: 420px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 2.5rem 2rem;
          backdrop-filter: blur(24px);
          box-shadow:
            0 0 0 1px rgba(255,255,255,0.05),
            0 32px 64px rgba(0,0,0,0.5),
            inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .admin-login-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .admin-login-icon {
          width: 64px; height: 64px;
          background: linear-gradient(135deg, #6c3bff, #a855f7);
          border-radius: 18px;
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 1.25rem;
          box-shadow: 0 8px 32px rgba(108,59,255,0.4);
        }

        .admin-login-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: -0.02em;
          margin: 0 0 0.25rem;
        }

        .admin-login-subtitle {
          color: rgba(255,255,255,0.5);
          font-size: 0.875rem;
          margin: 0 0 1rem;
        }

        .admin-login-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.375rem;
          background: rgba(108,59,255,0.15);
          border: 1px solid rgba(108,59,255,0.3);
          color: #a78bfa;
          font-size: 0.7rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          padding: 0.3rem 0.75rem;
          border-radius: 100px;
        }

        .admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .admin-login-error {
          display: flex;
          align-items: center;
          gap: 0.625rem;
          background: rgba(239,68,68,0.12);
          border: 1px solid rgba(239,68,68,0.3);
          color: #fca5a5;
          padding: 0.75rem 1rem;
          border-radius: 10px;
          font-size: 0.875rem;
        }

        .admin-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .admin-label {
          font-size: 0.8125rem;
          font-weight: 600;
          color: rgba(255,255,255,0.7);
          letter-spacing: 0.02em;
        }

        .admin-input-wrap {
          position: relative;
        }

        .admin-input-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          width: 16px; height: 16px;
          color: rgba(255,255,255,0.3);
          pointer-events: none;
        }

        .admin-input {
          width: 100%;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0.75rem 1rem 0.75rem 2.75rem;
          color: #fff;
          font-size: 0.9375rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .admin-input::placeholder { color: rgba(255,255,255,0.25); }

        .admin-input:focus {
          border-color: #6c3bff;
          background: rgba(108,59,255,0.08);
          box-shadow: 0 0 0 3px rgba(108,59,255,0.2);
        }

        .admin-input-error {
          border-color: rgba(239,68,68,0.5) !important;
        }

        .admin-input-password {
          padding-right: 3rem;
        }

        .admin-eye-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: rgba(255,255,255,0.35);
          cursor: pointer;
          padding: 0.25rem;
          transition: color 0.2s;
        }

        .admin-eye-btn:hover { color: rgba(255,255,255,0.7); }

        .admin-field-error {
          font-size: 0.8rem;
          color: #fca5a5;
          margin: 0;
        }

        .admin-submit-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #6c3bff, #a855f7);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 0.9375rem;
          font-weight: 700;
          padding: 0.875rem;
          cursor: pointer;
          margin-top: 0.5rem;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 24px rgba(108,59,255,0.4);
        }

        .admin-submit-btn:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
          box-shadow: 0 8px 32px rgba(108,59,255,0.5);
        }

        .admin-submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .admin-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .admin-submit-loading {
          display: flex;
          align-items: center;
          gap: 0.625rem;
        }

        .admin-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .admin-login-footer {
          text-align: center;
          margin-top: 1.75rem;
          font-size: 0.8125rem;
          color: rgba(255,255,255,0.35);
        }

        .admin-login-link {
          color: #a78bfa;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }

        .admin-login-link:hover { color: #c4b5fd; }
      `}</style>
    </div>
  )
}
