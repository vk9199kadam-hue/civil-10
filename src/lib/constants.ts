export const APP_NAME = 'Islampur Property'
export const DEFAULT_CITY = 'Islampur'
export const DEFAULT_DISTRICT = 'Sangli'
export const DEFAULT_STATE = 'Maharashtra'

export const PROPERTY_CATEGORIES = [
  { value: 'residential', label: 'Residential', icon: 'Home', color: 'bg-category-residential', textColor: 'text-category-residential' },
  { value: 'commercial', label: 'Commercial', icon: 'Building2', color: 'bg-category-commercial', textColor: 'text-category-commercial' },
  { value: 'land', label: 'Land & Plots', icon: 'Map', color: 'bg-category-land', textColor: 'text-category-land' },
  { value: 'industrial', label: 'Industrial', icon: 'Factory', color: 'bg-category-industrial', textColor: 'text-category-industrial' },
  { value: 'hospitality', label: 'Hospitality', icon: 'Hotel', color: 'bg-category-hospitality', textColor: 'text-category-hospitality' },
] as const

export const LISTING_TYPES = [
  { value: 'sale', label: 'Sale' },
  { value: 'rent', label: 'Rent' },
  { value: 'lease', label: 'Lease' },
] as const

export const LISTING_STATUSES = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'active', label: 'Active', color: 'bg-green-100 text-green-700' },
  { value: 'sold', label: 'Sold', color: 'bg-red-100 text-red-700' },
  { value: 'rented', label: 'Rented', color: 'bg-blue-100 text-blue-700' },
  { value: 'expired', label: 'Expired', color: 'bg-yellow-100 text-yellow-700' },
  { value: 'archived', label: 'Archived', color: 'bg-gray-100 text-gray-500' },
] as const

export const UNIT_STATUSES = [
  { value: 'available', label: 'Available', color: 'bg-status-available', emoji: '🟢' },
  { value: 'booked', label: 'Booked', color: 'bg-status-booked', emoji: '🟡' },
  { value: 'sold', label: 'Sold', color: 'bg-status-sold', emoji: '🔴' },
  { value: 'blocked', label: 'Blocked', color: 'bg-status-blocked', emoji: '⚫' },
] as const

export const PROJECT_STATUSES = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'under_construction', label: 'Under Construction' },
  { value: 'ready_to_move', label: 'Ready to Move' },
  { value: 'completed', label: 'Completed' },
] as const

export const PROJECT_TYPES = [
  { value: 'apartment', label: 'Apartment' },
  { value: 'villa', label: 'Villa' },
  { value: 'plotted', label: 'Plotted Development' },
  { value: 'commercial_complex', label: 'Commercial Complex' },
  { value: 'mixed', label: 'Mixed Use' },
] as const

export const USER_ROLES = [
  { value: 'user', label: 'Buyer/Renter' },
  { value: 'owner', label: 'Property Owner' },
  { value: 'agent', label: 'Agent/Broker' },
  { value: 'admin', label: 'Admin' },
] as const

export const FURNISHING_OPTIONS = [
  { value: 'unfurnished', label: 'Unfurnished' },
  { value: 'semi_furnished', label: 'Semi-Furnished' },
  { value: 'fully_furnished', label: 'Fully Furnished' },
] as const

export const FACING_DIRECTIONS = [
  { value: 'north', label: 'North' },
  { value: 'south', label: 'South' },
  { value: 'east', label: 'East' },
  { value: 'west', label: 'West' },
  { value: 'north_east', label: 'North-East' },
  { value: 'north_west', label: 'North-West' },
  { value: 'south_east', label: 'South-East' },
  { value: 'south_west', label: 'South-West' },
] as const

export const AREA_UNITS = [
  { value: 'sqft', label: 'Sq.ft' },
  { value: 'sqm', label: 'Sq.m' },
  { value: 'acre', label: 'Acre' },
  { value: 'hectare', label: 'Hectare' },
  { value: 'guntha', label: 'Guntha' },
] as const

export const ISLAMPUR_LOCALITIES = [
  'Islampur City',
  'Walwa',
  'Ashta',
  'Sangli Road',
  'Miraj Road',
  'Station Area',
  'Market Yard',
  'MIDC Area',
  'Krishna Nagar',
  'Shivaji Nagar',
  'Gandhi Chowk',
  'Bus Stand Area',
  'College Road',
  'Hospital Road',
  'Bypass Road',
] as const
