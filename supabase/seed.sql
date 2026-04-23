-- 1. Create a demo agent (links to auth.users - this would normally be done via UI/Auth)
-- For seeding, we assume IDs for demo purposes or use dummy data
-- In Supabase, you usually seed via the UI or by inserting directly if using local dev.

-- For your specific table structure in Migration 00001:
INSERT INTO public.users (id, full_name, email, role, agency_name, rera_number)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Rajesh Kulkarni', 'rajesh@example.com', 'agent', 'Islampur Realty', 'RERA-ISL-12345'),
('00000000-0000-0000-0000-000000000002', 'Admin User', 'admin@islampurproperty.com', 'admin', 'Platform Admin', NULL);

-- 2. Create property listings
INSERT INTO public.property_listings (id, owner_id, category, title, slug, description, listing_type, price, address_line, locality, carpet_area, category_specs, status, is_featured, is_verified)
VALUES 
-- Residential Flat
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'residential', 'Modern 2 BHK Flat near Bus Stand', '2bhk-flat-near-bus-stand', 'Spacious flat with modular kitchen and 2 balconies.', 'sale', 4500000, 'Mahadeo Nagar', 'Main Road Area', 850, '{"bedrooms": "2", "bathrooms": "2", "furnishing": "semi_furnished", "facing": "east", "amenities": ["lift", "security", "water_supply"]}', 'active', true, true),

-- Commercial Shop
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'commercial', 'Prime Corner Shop in Market Yard', 'prime-corner-shop-market-yard', 'High visibility shop suitable for showroom or boutique.', 'rent', 25000, 'Market Yard', 'Central Islampur', 450, '{"shop_type": "shop", "frontage_ft": 15, "is_corner": true, "washroom": true}', 'active', true, true),

-- Land Plot
(gen_random_uuid(), '00000000-0000-0000-0000-000000000001', 'land', '1500 sqft NA Plot in Shahu Nagar', 'na-plot-shahu-nagar', 'Premium residential plot with clear titles and NA order.', 'sale', 3500000, 'Shahu Nagar Phase 2', 'Near bypass', 1500, '{"plot_type": "na_plot", "na_order": true, "seven_twelve_clear": true, "road_width_ft": 30}', 'active', false, true);

-- 3. Create a Project
INSERT INTO public.projects (id, owner_id, project_type, name, slug, description, developer_name, address_line, locality, total_units, status, is_featured)
VALUES 
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000001', 'apartment', 'Sangam Residency', 'sangam-residency', 'Luxury living in the heart of Islampur city.', 'Deshmukh Developers', 'Bahe Road', 'Sangam Area', 12, 'under_construction', true);

-- 4. Create units for the project (12 units, 2 floors, 6 per floor)
INSERT INTO public.units (id, project_id, unit_number, floor_number, block_or_wing, unit_type, carpet_area, price, status, grid_row, grid_col)
VALUES 
-- Floor 1
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '101', '1', 'A', '2BHK', 850, 4200000, 'sold', 1, 0),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '102', '1', 'A', '2BHK', 850, 4200000, 'booked', 1, 1),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '103', '1', 'A', '1BHK', 550, 2800000, 'available', 1, 2),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '104', '1', 'A', '1BHK', 550, 2800000, 'available', 1, 3),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '105', '1', 'A', '2BHK', 850, 4200000, 'available', 1, 4),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '106', '1', 'A', '3BHK', 1150, 5800000, 'blocked', 1, 5),
-- Floor 2
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '201', '2', 'A', '2BHK', 850, 4300000, 'available', 0, 0),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '202', '2', 'A', '2BHK', 850, 4300000, 'available', 0, 1),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '203', '2', 'A', '1BHK', 550, 2900000, 'available', 0, 2),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '204', '2', 'A', '1BHK', 550, 2900000, 'available', 0, 3),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '205', '2', 'A', '2BHK', 850, 4300000, 'available', 0, 4),
(gen_random_uuid(), '11111111-1111-1111-1111-111111111111', '206', '2', 'A', '3BHK', 1150, 6000000, 'available', 0, 5);

-- 5. Create some inquiries
INSERT INTO public.inquiries (name, phone, message, listing_id, source, status)
VALUES 
('Amol Patil', '9876543210', 'Interested in the 2BHK flat near bus stand.', (SELECT id FROM property_listings WHERE slug = '2bhk-flat-near-bus-stand'), 'website', 'new'),
('Priya Shah', '9123456789', 'Is the corner shop still available for rent?', (SELECT id FROM property_listings WHERE slug = 'prime-corner-shop-market-yard'), 'whatsapp', 'contacted');
