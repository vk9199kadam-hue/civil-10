import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { PageLoader } from '@/components/ui/Spinner'

// Public pages
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })))
const SearchPage = lazy(() => import('@/pages/SearchPage').then(m => ({ default: m.SearchPage })))
const ListingDetailPage = lazy(() => import('@/pages/ListingDetailPage').then(m => ({ default: m.ListingDetailPage })))
const ProjectDetailPage = lazy(() => import('@/pages/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })))
const LoginPage = lazy(() => import('@/pages/LoginPage').then(m => ({ default: m.LoginPage })))
const SignupPage = lazy(() => import('@/pages/SignupPage').then(m => ({ default: m.SignupPage })))
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage').then(m => ({ default: m.NotFoundPage })))

// Dashboard pages
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage').then(m => ({ default: m.DashboardPage })))
const MyListingsPage = lazy(() => import('@/pages/dashboard/MyListingsPage').then(m => ({ default: m.MyListingsPage })))
const ListingFormPage = lazy(() => import('@/pages/dashboard/ListingFormPage').then(m => ({ default: m.ListingFormPage })))
const MyProjectsPage = lazy(() => import('@/pages/dashboard/MyProjectsPage').then(m => ({ default: m.MyProjectsPage })))
const ProjectFormPage = lazy(() => import('@/pages/dashboard/ProjectFormPage').then(m => ({ default: m.ProjectFormPage })))
const ProjectInventoryPage = lazy(() => import('@/pages/dashboard/ProjectInventoryPage').then(m => ({ default: m.ProjectInventoryPage })))
const InquiriesPage = lazy(() => import('@/pages/dashboard/InquiriesPage').then(m => ({ default: m.InquiriesPage })))
const ProfilePage = lazy(() => import('@/pages/dashboard/ProfilePage').then(m => ({ default: m.ProfilePage })))

// Admin pages
const AdminDashboardPage = lazy(() => import('@/pages/admin/AdminDashboardPage').then(m => ({ default: m.AdminDashboardPage })))
const AdminListingsPage = lazy(() => import('@/pages/admin/AdminListingsPage').then(m => ({ default: m.AdminListingsPage })))
const AdminUsersPage = lazy(() => import('@/pages/admin/AdminUsersPage').then(m => ({ default: m.AdminUsersPage })))
const AdminInquiriesPage = lazy(() => import('@/pages/admin/AdminInquiriesPage').then(m => ({ default: m.AdminInquiriesPage })))

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'property/:slug', element: <ListingDetailPage /> },
      { path: 'project/:slug', element: <ProjectDetailPage /> },
      { path: 'projects', element: <SearchPage /> },
      { path: 'login', element: <LoginPage /> },
      { path: 'signup', element: <SignupPage /> },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
  {
    path: 'dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'listings', element: <MyListingsPage /> },
      { path: 'listings/new', element: <ListingFormPage /> },
      { path: 'listings/:id/edit', element: <ListingFormPage /> },
      { path: 'projects', element: <MyProjectsPage /> },
      { path: 'projects/new', element: <ProjectFormPage /> },
      { path: 'projects/:id/inventory', element: <ProjectInventoryPage /> },
      { path: 'inquiries', element: <InquiriesPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },
  {
    path: 'admin',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'listings', element: <AdminListingsPage /> },
      { path: 'users', element: <AdminUsersPage /> },
      { path: 'inquiries', element: <AdminInquiriesPage /> },
    ],
  },
])

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  )
}
