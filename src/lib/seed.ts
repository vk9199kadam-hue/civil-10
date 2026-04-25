import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const SAMPLE_LISTINGS = [
  {
    title: 'Luxury 3 BHK Apartment in Islampur',
    description: 'Beautiful spacious apartment with modern amenities, 24/7 water supply, and modular kitchen.',
    price: 4500000,
    category: 'apartment',
    listing_type: 'sale',
    city: 'Islampur',
    locality: 'Vidya Nagar',
    bedrooms: 3,
    bathrooms: 2,
    area_sqft: 1250,
    status: 'active',
    is_featured: true,
    owner_id: 'seed-admin',
    slug: 'luxury-3-bhk-islampur-vidya-nagar',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000'],
  },
  {
    title: 'Modern 2 BHK Flat near Sangli City',
    description: 'Well-ventilated flat with prime location advantage. Close to schools and hospitals.',
    price: 3500000,
    category: 'apartment',
    listing_type: 'sale',
    city: 'Sangli',
    locality: 'Vishrambag',
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 950,
    status: 'active',
    is_featured: true,
    owner_id: 'seed-admin',
    slug: 'modern-2-bhk-sangli-vishrambag',
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000'],
  },
  {
    title: 'Independent Bungalow in Sangli',
    description: 'Spacious independent house with a private garden and parking space.',
    price: 8500000,
    category: 'house',
    listing_type: 'sale',
    city: 'Sangli',
    locality: 'Miraj Road',
    bedrooms: 4,
    bathrooms: 3,
    area_sqft: 2200,
    status: 'active',
    is_featured: false,
    owner_id: 'seed-admin',
    slug: 'bungalow-sangli-miraj-road',
    images: ['https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=1000'],
  },
  {
    title: 'Prime Commercial Plot',
    description: 'Perfect for building offices or a small shopping complex.',
    price: 12000000,
    category: 'land',
    listing_type: 'sale',
    city: 'Islampur',
    locality: 'Main Road',
    area_sqft: 5000,
    status: 'active',
    is_featured: false,
    owner_id: 'seed-admin',
    slug: 'commercial-plot-islampur',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=1000'],
  }
];

export async function seedDatabase() {
  console.log('Seeding started...');
  try {
    for (const listing of SAMPLE_LISTINGS) {
      await addDoc(collection(db, 'listings'), {
        ...listing,
        created_at: serverTimestamp(),
        updated_at: serverTimestamp(),
      });
    }
    console.log('Seeding complete!');
    return true;
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
}
