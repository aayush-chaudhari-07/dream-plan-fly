-- ==============================================================================
-- Seed Script: supabase/seed.sql
-- Description: Realistic Indian inventory seed for stays, rentals, transit, packages.
-- ==============================================================================

-- 1. Seed Stays
insert into public.inventory_stays (id, name, destination, location, lat, lng, rating, reviews_count, property_type, amenities, price, original_price, image, description)
values
  ('stay-goa-1', 'Taj Fort Aguada Resort & Spa', 'Goa', 'Sinquerim, Candolim, North Goa', 15.4989, 73.7675, 4.8, 1420, 'Resort', array['Oceanfront Pool', 'Spa & Wellness', 'Free Breakfast', 'Beach Access', 'Fine Dining', 'Free Wi-Fi'], 14500, 17500, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80', 'Iconic clifftop luxury resort with panoramic Arabian Sea views and Portuguese colonial heritage.'),
  ('stay-goa-2', 'W Goa Vagator', 'Goa', 'Vagator Beach, North Goa', 15.6028, 73.7336, 4.7, 980, 'Resort', array['Rock Pool', 'Sunset Bar', 'Spa', 'Pet Friendly', 'Fitness Centre', 'Free Breakfast'], 18200, 22000, 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80', 'Vibrant beachside luxury resort situated under the dramatic red cliffs of Chapora Fort.'),
  ('stay-goa-3', 'Zostel Goa (Morjim Beach)', 'Goa', 'Morjim Beach Road, North Goa', 15.6178, 73.7381, 4.5, 650, 'Backpacker Hostel', array['Co-working Space', 'Cafe', 'Surf Rentals', 'Community Events', 'High-Speed Wi-Fi'], 1499, 1999, 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80', 'Lively beachfront hostel popular with digital nomads, solo backpackers, and surfers.'),
  ('stay-manali-1', 'The Himalayan Luxury Castle & Resort', 'Manali', 'Hadimba Temple Road, Manali', 32.2472, 77.1812, 4.9, 890, 'Heritage Palace', array['Heated Mountain Pool', 'Pine Forest Trail', 'Fireplace Suites', 'Spa', 'Bar'], 12500, 15000, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80', 'Victorian Gothic style castle amidst snow-capped peaks and century-old cedar trees.'),
  ('stay-manali-2', 'Apple Country Mountain Resort', 'Manali', 'Log Huts Area, Old Manali', 32.2536, 77.1742, 4.6, 720, 'Boutique Hotel', array['Apple Orchard Views', 'Steam & Sauna', 'Multi-Cuisine Dining', 'Balcony Rooms'], 6800, 8500, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?auto=format&fit=crop&w=1200&q=80', 'Perched high above the valley in Old Manali with panoramic vistas of Rohtang peaks.'),
  ('stay-kashmir-1', 'The Lalit Grand Palace Srinagar', 'Kashmir', 'Gupkar Road, Dal Lake, Srinagar', 34.0792, 74.8465, 4.8, 1100, 'Heritage Palace', array['Dal Lake View', 'Palatial Gardens', 'Heated Indoor Pool', 'Royal Wazwan Dining'], 24000, 28500, 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80', 'Former royal residence of Maharaja Pratap Singh with Himalayan backdrop and Mughal chinar trees.'),
  ('stay-kashmir-2', 'Khyber Himalayan Resort & Spa Gulmarg', 'Kashmir', 'Near Gondola, Gulmarg', 34.0484, 74.3805, 4.9, 1350, 'Resort', array['Gondola Ski Access', 'L''Occitane Spa', 'Heated Glass Pool', 'Himalayan Views'], 32000, 38000, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', 'World-class alpine luxury ski resort perched at 8,825 feet with direct access to Gulmarg Gondola.'),
  ('stay-jaipur-1', 'Rambagh Palace Jaipur', 'Jaipur', 'Bhawani Singh Road, Jaipur', 26.8967, 75.8078, 5.0, 2200, 'Heritage Palace', array['Mughal Gardens', 'Peacock Courtyard', 'Jiva Spa', 'Polo Bar', 'Butler Service'], 38000, 45000, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80', 'The jewel of Jaipur, legendary royal palace offering authentic Maharaja hospitality.'),
  ('stay-jaipur-2', 'Samode Haveli Jaipur', 'Jaipur', 'Gangapole, Old City, Jaipur', 26.9312, 75.8341, 4.7, 840, 'Boutique Hotel', array['Frescoed Courtyards', 'Marble Pool', 'Rooftop Restaurant', 'Spa'], 11500, 14000, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', 'Traditional aristocratic Rajasthani haveli with hand-painted frescoes and tranquil courtyards.'),
  ('stay-munnar-1', 'Blanket Luxury Villa & Spa', 'Munnar', 'Attukad Waterfalls Road, Pallivasal, Munnar', 10.0526, 77.0519, 4.8, 930, 'Resort', array['Waterfall Facing', 'Infinity Pool', 'Ayurvedic Spa', 'Tea Garden Walks'], 9800, 12000, 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80', 'Eco-luxury mountain resort directly facing the thunderous Attukad Waterfalls and tea plantations.')
on conflict (id) do update set
  price = excluded.price,
  original_price = excluded.original_price,
  rating = excluded.rating;

-- 2. Seed Rentals
insert into public.inventory_rentals (id, name, category, destination, pickup_location, seats, transmission, fuel, rating, price, original_price, image, included)
values
  ('rental-1', 'Mahindra Thar 4x4 (Hard Top)', 'SUV', 'Manali', 'Mall Road / Volvo Bus Stand, Manali', 4, 'Automatic', 'Diesel', 4.9, 4500, 5500, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80', array['Comprehensive Insurance', 'Unlimited Kilometers', 'Snow Chains (Winter)', '24/7 Roadside Assistance']),
  ('rental-2', 'Royal Enfield Himalayan 450', 'Adventure Bike', 'Manali', 'Old Manali Bridge Hub', 2, 'Manual', 'Petrol', 4.8, 1800, 2200, 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=800&q=80', array['Dual Helmets', 'Pannier Mounts', 'Basic Tool Kit', 'Permit Assistance']),
  ('rental-3', 'Hyundai Creta SX (Sunroof)', 'SUV', 'Goa', 'Goa Airport (GOI/GOX) & Panjim', 5, 'Automatic', 'Petrol', 4.7, 2800, 3400, 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=800&q=80', array['Free Airport Delivery', 'Unlimited Kilometers', 'Zero Hidden Charges']),
  ('rental-4', 'Honda Activa 6G Scooter', 'Scooter', 'Goa', 'Calangute & Anjuna Hubs', 2, 'Automatic', 'Petrol', 4.6, 450, 600, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80', array['Two Helmets', 'Mobile Phone Mount', 'Full Tank Delivery']),
  ('rental-5', 'Toyota Innova Crysta (Luxury Cap)', 'SUV', 'Jaipur', 'Jaipur Airport & Railway Station', 7, 'Manual', 'Diesel', 4.9, 3800, 4600, 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80', array['All-India Tourist Permit', 'Clean AC Interior', 'Toll Pass Included'])
on conflict (id) do update set
  price = excluded.price,
  rating = excluded.rating;

-- 3. Seed Transit
insert into public.inventory_transit (id, type, operator, service_name, number_or_code, origin, destination, departure_time, arrival_time, duration, classes, frequency, rating)
values
  ('transit-1', 'train', 'Indian Railways (IRCTC)', 'Vande Bharat Express (20901)', 'VB-20901', 'Mumbai Central (MMCT)', 'Madgaon Junction Goa (MAO)', '05:25', '13:10', '7h 45m', '[{"className": "Executive Chair Car (EC)", "price": 3115, "seatsAvailable": 14}, {"className": "AC Chair Car (CC)", "price": 1695, "seatsAvailable": 48}]'::jsonb, 'Daily (except Friday)', 4.8),
  ('transit-2', 'train', 'Indian Railways (IRCTC)', 'Vande Bharat Express (22436)', 'VB-22436', 'New Delhi (NDLS)', 'Varanasi Junction (BSB)', '06:00', '14:00', '8h 00m', '[{"className": "Executive Chair Car (EC)", "price": 3350, "seatsAvailable": 8}, {"className": "AC Chair Car (CC)", "price": 1750, "seatsAvailable": 32}]'::jsonb, 'Daily (except Monday, Thursday)', 4.9),
  ('transit-3', 'train', 'Indian Railways (IRCTC)', 'Jaipur Vande Bharat (20978)', 'VB-20978', 'Delhi Cantt (DEC)', 'Jaipur Junction (JP)', '18:40', '22:45', '4h 05m', '[{"className": "Executive Chair Car (EC)", "price": 1875, "seatsAvailable": 19}, {"className": "AC Chair Car (CC)", "price": 1050, "seatsAvailable": 64}]'::jsonb, 'Daily (except Wednesday)', 4.7),
  ('transit-4', 'bus', 'Zingbus Electric Luxury Sleeper', 'Zingbus EV-Lounge', 'ZB-DEL-MAN', 'Majnu Ka Tilla, Delhi', 'Private Bus Stand, Manali', '19:30', '08:15', '12h 45m', '[{"className": "AC Sleeper (Upper)", "price": 1450, "seatsAvailable": 6}, {"className": "AC Sleeper (Lower)", "price": 1650, "seatsAvailable": 4}]'::jsonb, 'Daily (Every Evening)', 4.6),
  ('transit-5', 'bus', 'KSRTC Airavat Club Class Multi-Axle', 'Airavat Diamond Class', 'KA-BLR-COK', 'Shantinagar, Bengaluru', 'Vyttila Hub, Kochi', '21:00', '06:30', '9h 30m', '[{"className": "Semi-Sleeper AC", "price": 1280, "seatsAvailable": 18}]'::jsonb, 'Daily (Every Night)', 4.5)
on conflict (id) do update set
  rating = excluded.rating;

-- 4. Seed Packages
insert into public.inventory_packages (id, name, destination, duration_days, duration_nights, rating, reviews_count, includes, highlights, price, original_price, image)
values
  ('pkg-1', 'Golden Triangle Royal Heritage Expedition', 'Jaipur', 5, 4, 4.9, 310, array['4-Star Heritage Stays', 'Private AC Chauffeur', 'Monument Tickets', 'Daily Breakfast & Dinner', 'Taj Mahal Sunrise Tour'], array['Taj Mahal & Agra Fort', 'Amber Palace Elephant Hill', 'Hawa Mahal & City Palace', 'Chand Baori Stepwell'], 34999, 42000, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'),
  ('pkg-2', 'Kashmir White Paradise & Dal Lake Luxury', 'Kashmir', 6, 5, 4.9, 420, array['Luxury Houseboat Stay', 'Gulmarg Gondola Phase 1 & 2 Passes', 'Pahalgam Valley Transfers', 'Wazwan Feast', 'Shikara Sunset Ride'], array['Dal Lake Floating Market', 'Gulmarg Apharwat Peak Snow', 'Betaab & Aru Valleys', 'Mughal Terraced Gardens'], 44500, 53000, 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80'),
  ('pkg-3', 'Goa Beachside Serenity & Coastal Catamaran', 'Goa', 4, 3, 4.8, 280, array['5-Star Beachfront Resort', 'Sunset Catamaran Sailing', 'Old Goa Heritage Walk', 'Daily Buffet Breakfast', 'Airport Transfers'], array['Private Beach Loungers', 'Dolphin Watching at Sea', 'Fontainhas Latin Quarter', 'Dudhsagar Waterfalls Day Trip'], 27999, 33500, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80'),
  ('pkg-4', 'Manali High Alpine Escape & Solang Adventure', 'Manali', 5, 4, 4.7, 350, array['Cottage Stay with Fireplace', 'Rohtang / Atal Tunnel Permit', 'Paragliding at Solang Valley', 'Bonfire Evening with Music', 'Breakfast & Dinner'], array['Atal Tunnel & Sissu Valley', 'Solang Valley Snow Sports', 'Old Manali Cafe Crawl', 'Jogini Waterfalls Hike'], 21999, 26500, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80')
on conflict (id) do update set
  price = excluded.price,
  rating = excluded.rating;
