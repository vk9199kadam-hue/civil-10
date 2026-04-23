# Islampur Property Management Platform - Implementation Plan

## Context

Build a mobile-first real estate web application for Islampur (Sangli, Maharashtra) — a Tier-2/3 Indian market. The platform replicates core 99acres functionality with a trust-driven, psychology-optimized UI. It supports 5 property categories (Residential, Commercial, Land & Plots, Industrial, Hospitality) with real-time inventory grids for multi-unit projects.

**Key architectural decision:** No separate Express backend. Supabase provides PostgreSQL + Auth + Storage + Realtime out of the box. Frontend deploys to Vercel.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite |
| Styling | Tailwind CSS + shadcn/ui (Radix primitives) |
| State | TanStack React Query (server state) |
| Forms | React Hook Form + Zod validation |
| Backend/DB | Firebase (Cloud Firestore - NoSQL) |
| Auth | Firebase Auth (Email/Pass + Phone OTP) |
| Storage | Firebase Storage (Images, Documents) |
| Realtime | Firestore Snapshots (Realtime Inventory) |
| Deploy | Vercel (frontend) + Firebase (Backend) |
| Routing | React Router v7 |
| Icons | Lucide React |
| Gallery | Embla Carousel |
| Image Compression | browser-image-compression |

## Project Structure

```
civil project/
├── public/
├── src/
│   ├── main.tsx                     # Entry: providers + ReactDOM
│   ├── App.tsx                      # Route definitions
│   ├── components/
│   │   ├── ui/                      # shadcn/ui primitives (Button, Modal, Sheet, etc.)
│   │   ├── layout/                  # PublicLayout, DashboardLayout, Header, Footer, MobileNav
│   │   ├── property/                # PropertyCard, PropertyGrid, PriceDisplay, CategoryBadge
│   │   ├── inventory/               # InventoryGrid, UnitCell, UnitDetailPopover, StatusBadge
│   │   ├── media/                   # ImageGallery, ImageUploader, SortableImageGrid
│   │   ├── search/                  # SearchBar, SearchFilters, ActiveFilters, SortDropdown
│   │   ├── inquiry/                 # ContactModal, WhatsAppButton, CallButton, StickyBottomCTA
│   │   └── forms/                   # DynamicForm, FormField, CategorySelector, FormStepper
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── SearchPage.tsx
│   │   ├── ListingDetailPage.tsx
│   │   ├── ProjectDetailPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── SignupPage.tsx
│   │   ├── NotFoundPage.tsx
│   │   ├── dashboard/               # MyListings, ListingForm, MyProjects, ProjectInventory, etc.
│   │   └── admin/                   # AdminDashboard, AdminListings, AdminUsers, AdminInquiries
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useListings.ts           # CRUD + search hooks wrapping Supabase in React Query
│   │   ├── useProjects.ts
│   │   ├── useUnits.ts              # Includes useRealtimeUnits() with Supabase Realtime
│   │   ├── useInquiries.ts
│   │   ├── useMedia.ts
│   │   └── useSearch.ts
│   ├── providers/
│   │   ├── AuthProvider.tsx
│   │   └── QueryProvider.tsx
│   ├── lib/
│   │   ├── supabase.ts              # Supabase client singleton
│   │   ├── constants.ts             # Status colors, category colors, defaults
│   │   ├── category-configs.ts      # FieldConfig[] per category (drives dynamic forms)
│   │   ├── utils.ts                 # formatPrice, generateSlug, cn(), getWhatsAppUrl
│   │   ├── image-utils.ts           # Client-side compression + WebP conversion
│   │   ├── query-keys.ts            # React Query key factory
│   │   └── validations/             # Zod schemas per entity
│   ├── types/
│   │   ├── database.ts              # Supabase-generated types
│   │   ├── listings.ts              # PropertyListing, CategorySpecs (discriminated union)
│   │   ├── projects.ts              # Project, FloorPlan, Block
│   │   ├── units.ts                 # Unit, UnitStatus
│   │   ├── users.ts                 # UserProfile, UserRole
│   │   ├── inquiries.ts
│   │   ├── media.ts
│   │   └── forms.ts                 # FieldConfig types
│   └── styles/
│       └── globals.css              # Tailwind directives + global styles
├── supabase/
│   ├── migrations/
│   │   ├── 00001_create_users.sql
│   │   ├── 00002_create_property_listings.sql
│   │   ├── 00003_create_projects_and_units.sql
│   │   ├── 00004_create_inquiries_and_logs.sql
│   │   ├── 00005_create_media.sql
│   │   ├── 00006_enable_rls_policies.sql
│   │   ├── 00007_create_functions.sql
│   │   └── 00008_create_storage_buckets.sql
│   └── seed.sql
├── tests/
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── vercel.json
├── .env.local
└── .env.example
```

## Database Schema

### Core Tables

**`users`** — Profile data linked to `auth.users` via UUID
- id (uuid PK), full_name, phone, email, role (user|owner|agent|admin), avatar_url, agency_name, rera_number, preferences (jsonb), created_at, updated_at
- Auto-created by trigger on auth.users INSERT

**`property_listings`** — Standalone single-property listings
- id (uuid PK), owner_id (FK users), category (enum: residential|commercial|land|industrial|hospitality), title, slug (unique), description, listing_type (sale|rent|lease), price (numeric), price_unit, is_negotiable, address_line, locality, city, district, state, pincode, location (PostGIS point), carpet_area, built_up_area, area_unit, **category_specs (JSONB)**, rera_number, status (draft|active|sold|rented|expired|archived), is_featured, is_verified, view_count, published_at, created_at, updated_at
- GIN index on category_specs for JSONB queries
- Composite indexes on (city, category, status), (owner_id, status), price, locality

**`projects`** — Multi-unit developments (apartments, plotted layouts)
- id (uuid PK), owner_id (FK), project_type (apartment|villa|plotted|commercial_complex|mixed), name, slug, description, developer_name, rera_number, address/location fields, total_units, total_floors, units_per_floor, **floor_plan (JSONB)**, amenities (JSONB), specifications (JSONB), status (upcoming|under_construction|ready_to_move|completed), possession_date, price_range_min/max, is_featured, timestamps

**`units`** — Individual units within a project
- id (uuid PK), project_id (FK), unit_number, floor_number, block_or_wing, unit_type, carpet_area, price, **status (available|booked|sold|blocked)**, booked_by (FK nullable), buyer_name, buyer_phone, remarks, grid_row, grid_col, status_changed_at, timestamps
- Unique index on (project_id, floor_number, unit_number)
- Composite index on (project_id, status) — primary inventory query

**`inquiries`** — Lead capture
- id, user_id (nullable), listing_id (nullable FK), project_id (nullable FK), unit_id (nullable FK), name, phone, email, message, source (website|whatsapp|call|walkin), status (new|contacted|interested|converted|closed), metadata (jsonb), timestamps

**`inventory_logs`** — Audit trail for unit changes
- id, unit_id (FK), changed_by (FK), old_status, new_status, reason, metadata (jsonb), created_at
- Created by DB trigger on units.status UPDATE

**`media`** — Images, documents linked to listings/projects
- id, listing_id (nullable FK), project_id (nullable FK), storage_path, public_url, alt_text, media_type (image|video|document|floor_plan), mime_type, file_size, sort_order, is_cover, created_at

### JSONB category_specs shapes

- **Residential:** bedrooms, bathrooms, balconies, furnishing, facing, floor_number, total_floors, parking, age_of_property, amenities[]
- **Commercial:** shop_type, frontage_ft, ceiling_height_ft, power_load_kw, washroom, parking, is_corner, floor_number
- **Land & Plots:** plot_type, zone, road_width_ft, is_corner, boundary_wall, water, electricity, na_order, seven_twelve_clear, flood_risk
- **Industrial:** shed_type, power_load_kw, ceiling_height_ft, loading_dock, crane, water_supply, fire_safety
- **Hospitality:** rooms, restaurant_capacity, star_rating, pool, banquet_hall, conference_rooms, license_type

### RLS Policies (all tables)

- **Public read** for active listings/projects/units
- **Owner/agent CRUD** on own listings/projects
- **Admin full access** on all tables
- **Anyone can INSERT** inquiries (contact form)
- **inventory_logs INSERT** via trigger only (security definer)

### DB Functions & Triggers

1. `handle_new_user()` — trigger on auth.users INSERT → creates users profile
2. `log_unit_status_change()` — trigger on units UPDATE → inserts inventory_logs
3. `generate_units_from_plan(project_id)` — parses floor_plan JSONB → batch-inserts units
4. `increment_view_count(listing_id)` — atomic counter increment via RPC
5. `search_listings(filters JSONB)` — server-side search function

## Implementation Order

### Phase 1: Scaffolding & Foundation
1. Initialize Vite + React + TypeScript project
2. Install all dependencies (supabase-js, tanstack-query, react-router, react-hook-form, zod, tailwind, shadcn/ui, embla-carousel, lucide-react, browser-image-compression)
3. Configure Tailwind with custom theme (category colors, status colors, Indian-market typography)
4. Set up shadcn/ui components (Button, Input, Select, Dialog, Sheet, Popover, Tabs, Toast, Badge, Skeleton)
5. Configure path aliases, ESLint, Prettier
6. Create Supabase client singleton + env vars

### Phase 2: Database & Auth
7. Write all 8 SQL migrations
8. Write seed.sql with sample data (1 listing per category, 1 project with 30 units)
9. Implement AuthProvider (session management, role detection)
10. Build Login + Signup pages
11. Implement route guards (ProtectedRoute, AdminRoute)
12. Build Profile page

### Phase 3: Types, Validation & Core Libraries
13. Define all TypeScript types (listings, projects, units, users, inquiries, media, forms)
14. Define Zod validation schemas per entity
15. Build category-configs.ts (FieldConfig[] for all 5 categories)
16. Build utility functions (formatPrice, generateSlug, cn, getWhatsAppUrl)
17. Build React Query key factory + all data hooks

### Phase 4: Listings CRUD
18. Build DynamicForm + FormField components (data-driven form rendering)
19. Build CategorySelector component (5 category cards)
20. Build ListingForm wizard (5 steps: Category → Basic → Specs → Media → Review)
21. Build ImageUploader with client-side compression
22. Build MyListings dashboard page
23. Build listing edit/delete functionality

### Phase 5: Projects & Inventory Grid
24. Build ProjectForm (basic info + floor plan configurator)
25. Build ProjectConfigurator (define blocks, floors, units → preview grid)
26. Implement generate_units_from_plan (DB function or client-side)
27. Build InventoryGrid component (color-coded cells, block tabs, legend, summary stats)
28. Build UnitCell + UnitDetailPopover (click to view/edit)
29. Set up Supabase Realtime subscription for units → merge into React Query cache
30. Build inventory log viewer
31. Build MyProjects dashboard page

### Phase 6: Public Browse & Search
32. Build PublicLayout (Header, Footer, MobileNav with bottom tab bar)
33. Build HomePage (hero, featured listings/projects, category links)
34. Build PropertyCard + PropertyGrid (responsive, loading skeletons)
35. Build SearchPage with SearchFilters (category, price range, area, BHK, locality)
36. Build ListingDetailPage (gallery, specs, map pin, RERA badge, contact CTAs)
37. Build ProjectDetailPage (gallery, amenities, public inventory grid, contact CTAs)
38. Build StickyBottomCTA (mobile: Call + WhatsApp + Enquire)

### Phase 7: Inquiries & Contact
39. Build ContactModal (name, phone, message → inserts inquiry)
40. Build WhatsAppButton + CallButton
41. Build InquiriesPage for property owners (mini-CRM)

### Phase 8: Admin Panel
42. Build AdminLayout with sidebar
43. Build AdminDashboard with platform stats
44. Build AdminListings (moderate, feature, manage)
45. Build AdminUsers (role management)
46. Build AdminInquiries

### Phase 9: Polish & Deploy
47. Responsive audit across all breakpoints (360px–1920px)
48. Loading states, error boundaries, 404 page
49. Route-based code splitting (React.lazy)
50. Vercel deployment config + environment variables
51. Final QA pass

## Key Design Decisions

1. **JSONB for category specs** — Single table + JSONB column instead of 5 category tables. Validates at app layer via Zod discriminated unions. GIN index enables querying.

2. **React Query + Realtime hybrid** — React Query for all standard data fetching. Supabase Realtime ONLY for inventory grid (units table). Realtime patches the React Query cache directly for instant UI updates.

3. **Client-side image compression** — `browser-image-compression` reduces photos before upload. Critical for Indian 3G/4G networks. WebP conversion via Canvas API.

4. **Multi-step form wizard** — 5-step progressive disclosure for listing creation. Reduces cognitive load on mobile. Single react-hook-form instance persists state across steps.

5. **shadcn/ui for UI primitives** — Accessible Radix-based components (Dialog, Popover, Select, Sheet, Toast) copied into repo. Saves building from scratch while maintaining full control.

6. **Slug-based public URLs** — `/property/2bhk-flat-islampur-abc123` for SEO. UUID-based for dashboard routes.

7. **No Redux/Zustand** — Auth in React Context, server state in React Query, form state in react-hook-form. Sufficient for this app's complexity.

## Supabase Storage Buckets

| Bucket | Public | Purpose | Max Size |
|--------|--------|---------|----------|
| listing-images | Yes (read) | Property photos | 10 MB |
| project-images | Yes (read) | Project photos, floor plans | 10 MB |
| documents | No | RERA docs, private files | 20 MB |
| avatars | Yes (read) | User profile photos | 5 MB |

## Verification Plan

1. **Build check:** `npm run build` — zero TypeScript errors
2. **Lint:** `npm run lint` — zero ESLint errors
3. **Unit tests:** `npm run test` — all utils, validations, pure components pass
4. **Manual testing flow:**
   - Create account → login → create listing (each category) → upload images → publish
   - Create project → configure floors/units → generate grid → change unit statuses → verify real-time updates
   - Browse as public user → search → filter → view detail → submit inquiry
   - Admin: moderate listings, manage users, view inquiries
5. **Mobile testing:** Chrome DevTools responsive mode at 360px, 390px, 414px widths
6. **Vercel preview deploy:** Verify production build works
