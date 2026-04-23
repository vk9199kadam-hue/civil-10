import { useInquiries, useUpdateInquiryStatus } from '@/hooks/useInquiries'
import { Badge } from '@/components/ui/Badge'
import { PageLoader } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { getRelativeTime } from '@/lib/utils'
import { Phone } from 'lucide-react'

const statusColors: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  contacted: 'bg-amber-100 text-amber-700',
  interested: 'bg-green-100 text-green-700',
  converted: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-500',
}

export function AdminInquiriesPage() {
  const { data: inquiries, isLoading } = useInquiries()
  const updateStatus = useUpdateInquiryStatus()
  const { toast } = useToast()

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await updateStatus.mutateAsync({ id, status: status as 'new' | 'contacted' | 'interested' | 'converted' | 'closed' })
      toast('Status updated', 'success')
    } catch {
      toast('Failed to update', 'error')
    }
  }

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">All Inquiries ({inquiries?.length || 0})</h1>
      <div className="space-y-3">
        {inquiries?.map(inq => (
          <div key={inq.id} className="card p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <span className="font-semibold text-gray-900">{inq.name}</span>
                <span className="ml-2 inline-flex items-center gap-1 text-sm text-gray-500"><Phone className="h-3.5 w-3.5" /> {inq.phone}</span>
              </div>
              <Badge variant="custom" className={statusColors[inq.status]}>{inq.status}</Badge>
            </div>
            {inq.message && <p className="text-sm text-gray-600 mb-2">{inq.message}</p>}
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex gap-2">
                {inq.listing && <span>Property: {inq.listing.title}</span>}
                {inq.project && <span>Project: {inq.project.name}</span>}
              </div>
              <span>{getRelativeTime(inq.created_at)}</span>
            </div>
            <div className="mt-2 flex gap-1">
              {['new', 'contacted', 'interested', 'converted', 'closed'].map(s => (
                <button
                  key={s}
                  onClick={() => handleStatusChange(inq.id, s)}
                  className={`rounded px-2 py-1 text-xs capitalize transition-colors ${inq.status === s ? 'bg-brand-100 text-brand-700 font-medium' : 'text-gray-400 hover:bg-gray-100 hover:text-gray-600'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
