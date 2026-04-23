import type { FieldConfig } from '@/types/forms'

export const RESIDENTIAL_FIELDS: FieldConfig[] = [
  { name: 'bedrooms', label: 'Bedrooms (BHK)', type: 'select', required: true, options: [
    { value: '1', label: '1 BHK' }, { value: '2', label: '2 BHK' }, { value: '3', label: '3 BHK' },
    { value: '4', label: '4 BHK' }, { value: '5', label: '5+ BHK' },
  ]},
  { name: 'bathrooms', label: 'Bathrooms', type: 'select', options: [
    { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4+' },
  ]},
  { name: 'balconies', label: 'Balconies', type: 'select', options: [
    { value: '0', label: '0' }, { value: '1', label: '1' }, { value: '2', label: '2' }, { value: '3', label: '3+' },
  ]},
  { name: 'furnishing', label: 'Furnishing', type: 'select', options: [
    { value: 'unfurnished', label: 'Unfurnished' },
    { value: 'semi_furnished', label: 'Semi-Furnished' },
    { value: 'fully_furnished', label: 'Fully Furnished' },
  ]},
  { name: 'facing', label: 'Facing', type: 'select', options: [
    { value: 'north', label: 'North' }, { value: 'south', label: 'South' },
    { value: 'east', label: 'East' }, { value: 'west', label: 'West' },
    { value: 'north_east', label: 'North-East' }, { value: 'north_west', label: 'North-West' },
    { value: 'south_east', label: 'South-East' }, { value: 'south_west', label: 'South-West' },
  ]},
  { name: 'floor_number', label: 'Floor Number', type: 'number', placeholder: 'e.g. 3' },
  { name: 'total_floors', label: 'Total Floors', type: 'number', placeholder: 'e.g. 7' },
  { name: 'parking', label: 'Parking', type: 'select', options: [
    { value: 'none', label: 'None' }, { value: 'covered', label: 'Covered' },
    { value: 'open', label: 'Open' }, { value: 'both', label: 'Covered + Open' },
  ]},
  { name: 'age_of_property', label: 'Age of Property', type: 'select', options: [
    { value: 'new', label: 'New Construction' }, { value: '1-3', label: '1-3 Years' },
    { value: '3-5', label: '3-5 Years' }, { value: '5-10', label: '5-10 Years' },
    { value: '10+', label: '10+ Years' },
  ]},
  { name: 'possession_date', label: 'Possession Date', type: 'text', placeholder: 'e.g. Dec 2025' },
  { name: 'amenities', label: 'Amenities', type: 'multi-select', options: [
    { value: 'lift', label: 'Lift' }, { value: 'security', label: '24x7 Security' },
    { value: 'garden', label: 'Garden' }, { value: 'gym', label: 'Gym' },
    { value: 'swimming_pool', label: 'Swimming Pool' }, { value: 'power_backup', label: 'Power Backup' },
    { value: 'water_supply', label: '24x7 Water' }, { value: 'cctv', label: 'CCTV' },
    { value: 'children_play_area', label: 'Children Play Area' }, { value: 'club_house', label: 'Club House' },
    { value: 'rainwater_harvesting', label: 'Rainwater Harvesting' },
  ]},
]

export const COMMERCIAL_FIELDS: FieldConfig[] = [
  { name: 'shop_type', label: 'Property Type', type: 'select', required: true, options: [
    { value: 'office', label: 'Office Space' }, { value: 'shop', label: 'Shop/Showroom' },
    { value: 'warehouse', label: 'Warehouse/Godown' }, { value: 'coworking', label: 'Co-working Space' },
  ]},
  { name: 'frontage_ft', label: 'Frontage (ft)', type: 'number', placeholder: 'e.g. 20' },
  { name: 'ceiling_height_ft', label: 'Ceiling Height (ft)', type: 'number', placeholder: 'e.g. 12' },
  { name: 'power_load_kw', label: 'Power Load (kW)', type: 'number', placeholder: 'e.g. 10' },
  { name: 'washroom', label: 'Washroom', type: 'toggle' },
  { name: 'parking', label: 'Parking Available', type: 'toggle' },
  { name: 'is_corner', label: 'Corner Property', type: 'toggle' },
  { name: 'floor_number', label: 'Floor Number', type: 'number', placeholder: 'e.g. 0 for ground' },
  { name: 'internet_ready', label: 'Internet Ready', type: 'toggle' },
  { name: 'fire_noc', label: 'Fire NOC', type: 'toggle' },
  { name: 'lock_in_period', label: 'Lock-in Period (months)', type: 'number', placeholder: 'e.g. 36' },
]

export const LAND_FIELDS: FieldConfig[] = [
  { name: 'plot_type', label: 'Plot Type', type: 'select', required: true, options: [
    { value: 'na_plot', label: 'NA Plot' }, { value: 'agricultural', label: 'Agricultural Land' },
    { value: 'industrial_plot', label: 'Industrial Plot' }, { value: 'commercial_plot', label: 'Commercial Plot' },
  ]},
  { name: 'plot_length', label: 'Plot Length (ft)', type: 'number', placeholder: 'e.g. 50' },
  { name: 'plot_width', label: 'Plot Width (ft)', type: 'number', placeholder: 'e.g. 30' },
  { name: 'zone', label: 'Zone', type: 'text', placeholder: 'e.g. Residential Zone' },
  { name: 'road_width_ft', label: 'Road Width (ft)', type: 'number', placeholder: 'e.g. 30' },
  { name: 'is_corner', label: 'Corner Plot', type: 'toggle' },
  { name: 'boundary_wall', label: 'Boundary Wall', type: 'toggle' },
  { name: 'water', label: 'Water Supply', type: 'toggle' },
  { name: 'electricity', label: 'Electricity', type: 'toggle' },
  { name: 'drainage', label: 'Drainage', type: 'toggle' },
  { name: 'na_order', label: 'NA Order Available', type: 'toggle' },
  { name: 'seven_twelve_clear', label: '7/12 Extract Clear', type: 'toggle' },
  { name: 'flood_risk', label: 'Flood Risk Zone', type: 'select', options: [
    { value: 'none', label: 'No Risk' }, { value: 'low', label: 'Low Risk' },
    { value: 'medium', label: 'Medium Risk' }, { value: 'high', label: 'High Risk (Krishna River Area)' },
  ]},
  { name: 'soil_type', label: 'Soil Type', type: 'select', options: [
    { value: 'black', label: 'Black Soil' }, { value: 'red', label: 'Red Soil' },
    { value: 'laterite', label: 'Laterite' }, { value: 'alluvial', label: 'Alluvial' },
  ]},
]

export const INDUSTRIAL_FIELDS: FieldConfig[] = [
  { name: 'shed_type', label: 'Property Type', type: 'select', required: true, options: [
    { value: 'factory', label: 'Factory' }, { value: 'shed', label: 'Industrial Shed' },
    { value: 'workshop', label: 'Workshop' }, { value: 'cold_storage', label: 'Cold Storage' },
  ]},
  { name: 'power_load_kw', label: 'Power Capacity (kW)', type: 'number', placeholder: 'e.g. 100' },
  { name: 'ceiling_height_ft', label: 'Clear Height (ft)', type: 'number', placeholder: 'e.g. 20' },
  { name: 'loading_dock', label: 'Loading Dock', type: 'toggle' },
  { name: 'crane', label: 'Crane Available', type: 'toggle' },
  { name: 'water_supply', label: '24x7 Water Supply', type: 'toggle' },
  { name: 'fire_safety', label: 'Fire Safety System', type: 'toggle' },
  { name: 'pollution_clearance', label: 'Pollution Clearance', type: 'toggle' },
  { name: 'factory_license', label: 'Factory License', type: 'toggle' },
  { name: 'labor_shed', label: 'Labor Shed Available', type: 'toggle' },
  { name: 'transport_connectivity', label: 'Transport Connectivity', type: 'select', options: [
    { value: 'excellent', label: 'Excellent (Highway)' }, { value: 'good', label: 'Good (Main Road)' },
    { value: 'average', label: 'Average' }, { value: 'poor', label: 'Poor' },
  ]},
]

export const HOSPITALITY_FIELDS: FieldConfig[] = [
  { name: 'property_subtype', label: 'Property Type', type: 'select', required: true, options: [
    { value: 'hotel', label: 'Hotel' }, { value: 'resort', label: 'Resort' },
    { value: 'restaurant', label: 'Restaurant' }, { value: 'banquet', label: 'Banquet Hall' },
  ]},
  { name: 'rooms', label: 'Number of Rooms', type: 'number', placeholder: 'e.g. 30' },
  { name: 'star_rating', label: 'Star Rating', type: 'select', options: [
    { value: '1', label: '1 Star' }, { value: '2', label: '2 Star' }, { value: '3', label: '3 Star' },
    { value: '4', label: '4 Star' }, { value: '5', label: '5 Star' }, { value: 'unrated', label: 'Unrated' },
  ]},
  { name: 'restaurant_capacity', label: 'Restaurant Capacity', type: 'number', placeholder: 'Seats' },
  { name: 'banquet_hall', label: 'Banquet Hall', type: 'toggle' },
  { name: 'banquet_capacity', label: 'Banquet Capacity', type: 'number', placeholder: 'Persons' },
  { name: 'pool', label: 'Swimming Pool', type: 'toggle' },
  { name: 'conference_rooms', label: 'Conference Rooms', type: 'number', placeholder: 'Count' },
  { name: 'tourism_license', label: 'Tourism License', type: 'toggle' },
  { name: 'fire_safety_cert', label: 'Fire Safety Certificate', type: 'toggle' },
  { name: 'occupancy_rate', label: 'Avg Occupancy Rate (%)', type: 'number', placeholder: 'e.g. 65' },
]

export const CATEGORY_FIELD_CONFIGS: Record<string, FieldConfig[]> = {
  residential: RESIDENTIAL_FIELDS,
  commercial: COMMERCIAL_FIELDS,
  land: LAND_FIELDS,
  industrial: INDUSTRIAL_FIELDS,
  hospitality: HOSPITALITY_FIELDS,
}
