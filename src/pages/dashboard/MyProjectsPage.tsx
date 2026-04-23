import { Link } from 'react-router-dom'
import { useMyProjects } from '@/hooks/useProjects'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import { PageLoader } from '@/components/ui/Spinner'
import { formatPrice, getRelativeTime } from '@/lib/utils'
import { Plus, Grid3X3, ExternalLink } from 'lucide-react'

export function MyProjectsPage() {
  const { data: projects, isLoading } = useMyProjects()

  if (isLoading) return <PageLoader />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-sm text-gray-500">{projects?.length || 0} projects</p>
        </div>
        <Link to="/dashboard/projects/new">
          <Button className="gap-2"><Plus className="h-4 w-4" /> New Project</Button>
        </Link>
      </div>

      {!projects || projects.length === 0 ? (
        <EmptyState
          title="No projects yet"
          description="Create a project to manage multi-unit developments."
          action={<Link to="/dashboard/projects/new"><Button>Create Project</Button></Link>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {projects.map(project => (
            <div key={project.id} className="card p-5 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{project.name}</h3>
                  <p className="text-sm text-gray-500">{project.locality}, {project.city}</p>
                </div>
                <Badge variant="custom" className="bg-blue-100 text-blue-700 capitalize">{project.status.replace(/_/g, ' ')}</Badge>
              </div>
              <div className="flex gap-4 text-sm text-gray-600">
                <span>{project.total_units} units</span>
                <span>{project.total_floors} floors</span>
                {project.price_range_min && <span>From {formatPrice(project.price_range_min)}</span>}
              </div>
              <div className="text-xs text-gray-400">{getRelativeTime(project.created_at)}</div>
              <div className="flex gap-2 pt-1">
                <Link to={`/dashboard/projects/${project.id}/inventory`}>
                  <Button variant="secondary" size="sm" className="gap-1.5"><Grid3X3 className="h-3.5 w-3.5" /> Inventory</Button>
                </Link>
                <Link to={`/project/${project.slug}`}>
                  <Button variant="ghost" size="sm" className="gap-1.5"><ExternalLink className="h-3.5 w-3.5" /> View</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
