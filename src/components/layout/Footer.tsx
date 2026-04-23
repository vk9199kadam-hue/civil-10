import { Link } from 'react-router-dom'
import { APP_NAME } from '@/lib/constants'
import { Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-gray-50">
      <div className="container-app py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white font-bold text-sm">IP</div>
              <span className="text-lg font-bold text-gray-900">{APP_NAME}</span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Your trusted property platform for Islampur, Sangli. Find flats, plots, shops, land and more.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Property Types</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/search?category=residential" className="hover:text-brand-600">Residential</Link></li>
              <li><Link to="/search?category=commercial" className="hover:text-brand-600">Commercial</Link></li>
              <li><Link to="/search?category=land" className="hover:text-brand-600">Land & Plots</Link></li>
              <li><Link to="/search?category=industrial" className="hover:text-brand-600">Industrial</Link></li>
              <li><Link to="/search?category=hospitality" className="hover:text-brand-600">Hospitality</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link to="/search" className="hover:text-brand-600">Search Properties</Link></li>
              <li><Link to="/projects" className="hover:text-brand-600">Projects</Link></li>
              <li><Link to="/dashboard/listings/new" className="hover:text-brand-600">Post Property</Link></li>
              <li><Link to="/login" className="hover:text-brand-600">Login</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold text-gray-900">Contact</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gray-400" /> Islampur, Sangli, Maharashtra</li>
              <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-gray-400" /> +91 XXXXX XXXXX</li>
              <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-gray-400" /> info@islampurproperty.com</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
