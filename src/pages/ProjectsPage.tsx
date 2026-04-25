import { Link } from 'react-router-dom'
import { useProjects } from '@/hooks/useProjects'
import { PageLoader } from '@/components/ui/Spinner'
import { Map, ArrowRight } from 'lucide-react'

export function ProjectsPage() {
  const { data: projects, isLoading } = useProjects()

  if (isLoading) return <PageLoader />

  return (
    <div className="container-app py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">New Projects & Developments</h1>
        <p className="mt-2 text-gray-600">Discover upcoming and ongoing real estate projects in Islampur.</p>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">No projects found</h3>
          <p className="text-gray-500">We couldn't find any projects at the moment. Please check back later.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map(project => (
            <Link 
              key={project.id} 
              to={`/project/${project.slug}`} 
              className="card group overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 flex flex-col"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500">{project.developer_name}</p>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                    {project.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="mb-6 flex items-center gap-2 text-sm text-gray-500">
                  <Map className="h-4 w-4 text-brand-500" />
                  <span>{project.locality}, {project.city}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-0.5">Total Units</div>
                    <div className="font-bold text-gray-900">{project.total_units}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-0.5">Floors</div>
                    <div className="font-bold text-gray-900">{project.total_floors}</div>
                  </div>
                </div>

                <p className="text-sm text-gray-600 line-clamp-2 mb-6 leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="mt-auto bg-brand-600 px-6 py-4 text-white font-semibold flex items-center justify-between group-hover:bg-brand-700 transition-colors">
                <span>View Full Details & Inventory</span>
                <ArrowRight className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
