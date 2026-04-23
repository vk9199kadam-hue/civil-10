import { useInquiries, useUpdateInquiryStatus } from '@/hooks/useInquiries'
import { Badge } from '@/components/ui/Badge'

import { PageLoader } from '@/components/ui/Spinner'
import { EmptyState } from '@/components/ui/EmptyState'
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

export function InquiriesPage() {
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Inquiries</h1>
        <p className="text-sm text-gray-500">{inquiries?.length || 0} inquiries received</p>
      </div>

      {!inquiries || inquiries.length === 0 ? (
        <EmptyState title="No inquiries yet" description="Inquiries from interested buyers will appear here." />
      ) : (
        <div className="space-y-3">
          {inquiries.map(inq => (
            <div key={inq.id} className="card p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-semibold text-gray-900">{inq.name}</div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {inq.phone}</span>
                    {inq.email && <span>{inq.email}</span>}
                  </div>
                </div>
                <Badge variant="custom" className={statusColors[inq.status]}>{inq.status}</Badge>
              </div>
              {inq.message && <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{inq.message}</p>}
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{getRelativeTime(inq.created_at)}</span>
                <div className="flex gap-1">
                  {['contacted', 'interested', 'converted', 'closed'].map(s => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(inq.id, s)}
                      className={`rounded px-2 py-1 capitalize hover:bg-gray-100 ${inq.status === s ? 'font-bold text-brand-600' : 'text-gray-500'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
