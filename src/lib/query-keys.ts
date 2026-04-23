export const queryKeys = {
  listings: {
    all: ['listings'] as const,
    list: (filters?: Record<string, unknown>) => ['listings', 'list', filters] as const,
    detail: (id: string) => ['listings', 'detail', id] as const,
    byOwner: (ownerId: string) => ['listings', 'owner', ownerId] as const,
    featured: ['listings', 'featured'] as const,
  },
  projects: {
    all: ['projects'] as const,
    list: (filters?: Record<string, unknown>) => ['projects', 'list', filters] as const,
    detail: (id: string) => ['projects', 'detail', id] as const,
    byOwner: (ownerId: string) => ['projects', 'owner', ownerId] as const,
    featured: ['projects', 'featured'] as const,
  },
  units: {
    all: ['units'] as const,
    byProject: (projectId: string) => ['units', 'project', projectId] as const,
    detail: (id: string) => ['units', 'detail', id] as const,
  },
  inquiries: {
    all: ['inquiries'] as const,
    list: (filters?: Record<string, unknown>) => ['inquiries', 'list', filters] as const,
    byListing: (listingId: string) => ['inquiries', 'listing', listingId] as const,
    byProject: (projectId: string) => ['inquiries', 'project', projectId] as const,
  },
  media: {
    byListing: (listingId: string) => ['media', 'listing', listingId] as const,
    byProject: (projectId: string) => ['media', 'project', projectId] as const,
  },
  users: {
    profile: (id: string) => ['users', 'profile', id] as const,
    all: ['users', 'all'] as const,
  },
  inventoryLogs: {
    byProject: (projectId: string) => ['inventory-logs', 'project', projectId] as const,
  },
  stats: {
    admin: ['stats', 'admin'] as const,
    dashboard: (userId: string) => ['stats', 'dashboard', userId] as const,
  },
}
