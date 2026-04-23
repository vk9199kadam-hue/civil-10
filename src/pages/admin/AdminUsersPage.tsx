import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { collection, query, getDocs, doc, updateDoc, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Badge } from '@/components/ui/Badge'
import { Select } from '@/components/ui/Select'
import { PageLoader } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { getRelativeTime } from '@/lib/utils'
import type { UserProfile } from '@/types/users'

export function AdminUsersPage() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  const { data: users, isLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const q = query(collection(db, 'users'), orderBy('created_at', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as unknown as UserProfile[]
    },
  })

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: string; role: string }) => {
      const docRef = doc(db, 'users', id)
      await updateDoc(docRef, { role })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] })
      toast('Role updated', 'success')
    },
  })

  if (isLoading) return <PageLoader />

  const roleColors: Record<string, string> = {
    user: 'bg-gray-100 text-gray-700',
    owner: 'bg-blue-100 text-blue-700',
    agent: 'bg-purple-100 text-purple-700',
    admin: 'bg-red-100 text-red-700',
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Users ({users?.length || 0})</h1>
      <div className="space-y-3">
        {users?.map(user => (
          <div key={user.id} className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900">{user.full_name}</span>
                <Badge variant="custom" className={roleColors[user.role]}>{user.role}</Badge>
              </div>
              <p className="text-sm text-gray-500">{user.email} {user.phone && `| ${user.phone}`}</p>
              <p className="text-xs text-gray-400">Joined {getRelativeTime(user.created_at)}</p>
            </div>
            <div className="w-36">
              <Select
                options={[
                  { value: 'user', label: 'User' },
                  { value: 'owner', label: 'Owner' },
                  { value: 'agent', label: 'Agent' },
                  { value: 'admin', label: 'Admin' },
                ]}
                value={user.role}
                onChange={(e) => updateRole.mutate({ id: user.id, role: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
