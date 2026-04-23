import { Link, useNavigate } from 'react-router-dom'
import { Search, ArrowRight, Home, Building2, Map, Factory, Hotel, TrendingUp, Shield, Users } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import { useFeaturedListings } from '@/hooks/useListings'
import { useState } from 'react'

const categories = [
  { icon: Home, label: 'Residential', value: 'residential', desc: 'Flats, Villas, PG', color: 'bg-blue-100 text-blue-600' },
  { icon: Building2, label: 'Commercial', value: 'commercial', desc: 'Shops, Offices', color: 'bg-purple-100 text-purple-600' },
  { icon: Map, label: 'Land & Plots', value: 'land', desc: 'NA Plots, Farm Land', color: 'bg-amber-100 text-amber-600' },
  { icon: Factory, label: 'Industrial', value: 'industrial', desc: 'Factories, Sheds', color: 'bg-slate-100 text-slate-600' },
  { icon: Hotel, label: 'Hospitality', value: 'hospitality', desc: 'Hotels, Resorts', color: 'bg-rose-100 text-rose-600' },
]

const trustBadges = [
  { icon: Shield, label: 'RERA Verified', desc: 'All properties are RERA compliant' },
  { icon: Users, label: '500+ Happy Clients', desc: 'Trusted by Islampur residents' },
  { icon: TrendingUp, label: 'Best Prices', desc: 'Direct owner listings, no middlemen' },
]

export function HomePage() {
  const navigate = useNavigate()
  const { data: featured, isLoading } = useFeaturedListings()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-4 py-16 text-white sm:py-24">
        <div className="container-app text-center">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Find Your Dream Property<br />in <span className="text-amber-300">Islampur</span>
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-base text-blue-100 sm:text-lg">
            Flats, Plots, Shops, Land & more in Islampur, Sangli. Verified listings with RERA compliance.
          </p>

          <form onSubmit={handleSearch} className="mx-auto mt-8 flex max-w-xl gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by location, project, or type..."
                className="w-full rounded-xl border-0 bg-white py-3.5 pl-11 pr-4 text-gray-900 shadow-lg placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
            <Button type="submit" className="rounded-xl bg-amber-500 px-6 text-gray-900 hover:bg-amber-400 shadow-lg">
              Search
            </Button>
          </form>

          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm">
            <span className="text-blue-200">Popular:</span>
            {['2 BHK Flat', 'NA Plot', 'Shop for Rent', 'Farm Land'].map(term => (
              <Link
                key={term}
                to={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full border border-white/30 px-3 py-1 text-white/90 hover:bg-white/10"
              >
                {term}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-app py-12">
        <h2 className="mb-6 text-xl font-bold text-gray-900 sm:text-2xl">Browse by Category</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map(cat => {
            const Icon = cat.icon
            return (
              <Link
                key={cat.value}
                to={`/search?category=${cat.value}`}
                className="card flex flex-col items-center p-5 text-center transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${cat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div className="font-semibold text-gray-900">{cat.label}</div>
                <div className="mt-0.5 text-xs text-gray-500">{cat.desc}</div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Listings */}
      <section className="bg-gray-50 py-12">
        <div className="container-app">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">Featured Properties</h2>
            <Link to="/search" className="flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700">
              View All <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <PropertyGrid listings={featured ?? []} loading={isLoading} emptyTitle="No featured properties yet" />
        </div>
      </section>

      {/* Trust Badges */}
      <section className="container-app py-12">
        <div className="grid gap-6 sm:grid-cols-3">
          {trustBadges.map(badge => {
            const Icon = badge.icon
            return (
              <div key={badge.label} className="flex items-start gap-4 rounded-xl border p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{badge.label}</div>
                  <div className="mt-0.5 text-sm text-gray-500">{badge.desc}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-600 px-4 py-12 text-center text-white">
        <h2 className="text-2xl font-bold">Want to Sell or Rent Your Property?</h2>
        <p className="mx-auto mt-2 max-w-lg text-blue-100">
          List your property for free. Reach thousands of buyers in Islampur and Sangli district.
        </p>
        <Link to="/dashboard/listings/new">
          <Button className="mt-6 bg-white text-brand-700 hover:bg-gray-100 shadow-lg">
            Post Your Property Free
          </Button>
        </Link>
      </section>
    </div>
  )
}
