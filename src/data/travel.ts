import manali from "@/assets/dest-manali.jpg";
import goa from "@/assets/dest-goa.jpg";
import japan from "@/assets/dest-japan.jpg";
import kashmir from "@/assets/dest-kashmir.jpg";
import maldives from "@/assets/dest-maldives.jpg";
import hero from "@/assets/hero-mountains.jpg";

export const images = { manali, goa, japan, kashmir, maldives, hero };

export type Destination = {
  id: string;
  name: string;
  region: string;
  category: string;
  price: number;
  rating: number;
  blurb: string;
  image: string;
};

export const destinations: Destination[] = [
  {
    id: "manali",
    name: "Manali",
    region: "Himachal Pradesh, India",
    category: "Hill Stations",
    price: 9800,
    rating: 4.8,
    blurb: "Snow peaks, pine valleys and riverside cafés in the Kullu valley.",
    image: manali,
  },
  {
    id: "goa",
    name: "Goa",
    region: "Goa, India",
    category: "Beaches",
    price: 12400,
    rating: 4.7,
    blurb: "Sun-soaked shacks, Portuguese lanes and long slow sunsets.",
    image: goa,
  },
  {
    id: "kashmir",
    name: "Kashmir",
    region: "Jammu & Kashmir, India",
    category: "Nature",
    price: 18500,
    rating: 4.9,
    blurb: "Shikara rides on Dal Lake with the Pir Panjal on the horizon.",
    image: kashmir,
  },
  {
    id: "kyoto",
    name: "Kyoto",
    region: "Japan",
    category: "International",
    price: 96000,
    rating: 4.9,
    blurb: "Temple gardens, sakura streets and impossibly good ramen.",
    image: japan,
  },
  {
    id: "maldives",
    name: "Maldives",
    region: "Indian Ocean",
    category: "Beaches",
    price: 74000,
    rating: 4.8,
    blurb: "Overwater villas and lagoons in every shade of turquoise.",
    image: maldives,
  },
  {
    id: "lonavala",
    name: "Lonavala",
    region: "Maharashtra, India",
    category: "Weekend Getaways",
    price: 4200,
    rating: 4.5,
    blurb: "Monsoon waterfalls two hours from the city, perfect for a reset.",
    image: hero,
  },
  {
    id: "munnar",
    name: "Munnar",
    region: "Kerala, India",
    category: "Hill Stations",
    price: 8600,
    rating: 4.7,
    blurb: "Endless tea terraces wrapped in morning mist.",
    image: manali,
  },
  {
    id: "rishikesh",
    name: "Rishikesh",
    region: "Uttarakhand, India",
    category: "Adventure",
    price: 6900,
    rating: 4.6,
    blurb: "White-water rafting, cliff jumps and Ganga aarti evenings.",
    image: hero,
  },
  {
    id: "jaipur",
    name: "Jaipur",
    region: "Rajasthan, India",
    category: "Heritage",
    price: 7400,
    rating: 4.6,
    blurb: "Pink city forts, stepwells and rooftop thali dinners.",
    image: goa,
  },
];

export const destinationCategories = [
  "All",
  "Hill Stations",
  "Beaches",
  "Adventure",
  "Heritage",
  "Nature",
  "International",
  "Weekend Getaways",
];

export const hillStations = [
  { name: "Manali", state: "Himachal Pradesh", temp: "8°C", image: manali },
  { name: "Shimla", state: "Himachal Pradesh", temp: "11°C", image: hero },
  { name: "Munnar", state: "Kerala", temp: "17°C", image: manali },
  { name: "Ooty", state: "Tamil Nadu", temp: "15°C", image: hero },
  { name: "Lonavala", state: "Maharashtra", temp: "21°C", image: hero },
  { name: "Mahabaleshwar", state: "Maharashtra", temp: "19°C", image: manali },
  { name: "Darjeeling", state: "West Bengal", temp: "12°C", image: hero },
  { name: "Kashmir", state: "J&K", temp: "6°C", image: kashmir },
];

export type MapPlace = {
  id: string;
  name: string;
  type: "Attractions" | "Hotels" | "Restaurants" | "Activities";
  rating: number;
  distance: string;
  note: string;
  x: number;
  y: number;
};

export const mapPlaces: MapPlace[] = [
  {
    id: "p1",
    name: "Lonavala",
    type: "Attractions",
    rating: 4.8,
    distance: "62 km",
    note: "Beautiful hill station surrounded by waterfalls and greenery.",
    x: 32,
    y: 38,
  },
  {
    id: "p2",
    name: "Tiger Point Viewpoint",
    type: "Attractions",
    rating: 4.6,
    distance: "68 km",
    note: "Cliff-edge sunrise views over the Sahyadri valley.",
    x: 58,
    y: 26,
  },
  {
    id: "p3",
    name: "The Valley Retreat",
    type: "Hotels",
    rating: 4.5,
    distance: "64 km",
    note: "Boutique stay with infinity pool facing the ghats.",
    x: 46,
    y: 62,
  },
  {
    id: "p4",
    name: "Hilltop Chai House",
    type: "Restaurants",
    rating: 4.7,
    distance: "61 km",
    note: "Local Maharashtrian plates and legendary masala chai.",
    x: 72,
    y: 55,
  },
  {
    id: "p5",
    name: "Kayaking at Pawna Lake",
    type: "Activities",
    rating: 4.9,
    distance: "74 km",
    note: "Sunset kayaking and lakeside camping under the stars.",
    x: 20,
    y: 70,
  },
  {
    id: "p6",
    name: "Della Adventure Park",
    type: "Activities",
    rating: 4.4,
    distance: "66 km",
    note: "Zipline, ATV and 50+ adventure experiences.",
    x: 84,
    y: 34,
  },
];

export const quickPrompts = [
  "Weekend trip",
  "Budget trip",
  "Family vacation",
  "Adventure trip",
  "Solo trip",
  "Hill station",
  "Beach vacation",
  "International trip",
];

export const flights = [
  { airline: "IndiGo 6E-247", dep: "06:10 DEL", arr: "08:25 GOI", duration: "2h 15m", stops: "Non-stop", price: 4899 },
  { airline: "Air India AI-882", dep: "09:40 DEL", arr: "12:20 GOI", duration: "2h 40m", stops: "Non-stop", price: 5640 },
  { airline: "Vistara UK-863", dep: "14:05 DEL", arr: "18:35 GOI", duration: "4h 30m", stops: "1 stop", price: 4320 },
];

export const hotels = [
  { name: "Coco Sands Resort", rating: 4.7, location: "Candolim, Goa", amenities: ["Pool", "Breakfast", "Beachfront"], price: 3200, image: goa },
  { name: "Pine Ridge Cottages", rating: 4.6, location: "Old Manali", amenities: ["Fireplace", "Valley view", "Café"], price: 2450, image: manali },
  { name: "Lake House Srinagar", rating: 4.8, location: "Dal Lake", amenities: ["Houseboat", "Kitchen", "Shikara"], price: 3800, image: kashmir },
];

export const rentals = [
  { name: "Mahindra Thar", type: "SUV · Manual", seats: 4, price: 3400 },
  { name: "Royal Enfield Himalayan", type: "Bike · 411cc", seats: 2, price: 1200 },
  { name: "Maruti Swift", type: "Hatchback · Auto", seats: 5, price: 1800 },
];

export const railBus = [
  { operator: "Rajdhani Express", dep: "16:55 NDLS", arr: "08:05 MAO", duration: "15h 10m", price: 2140 },
  { operator: "VRL Volvo Sleeper", dep: "20:30 Pune", arr: "06:15 Goa", duration: "9h 45m", price: 1290 },
  { operator: "Shatabdi Express", dep: "07:20 NDLS", arr: "12:45 CDG", duration: "5h 25m", price: 980 },
];

export type FutureTrip = {
  id: string;
  emoji: string;
  name: string;
  target: number;
  saved: number;
  targetDate: string;
  monthsLeft: number;
  travelers: number;
  image: string;
};

export const initialFutureTrips: FutureTrip[] = [
  {
    id: "ft1",
    emoji: "🇯🇵",
    name: "Japan 2027",
    target: 120000,
    saved: 36000,
    targetDate: "December 2027",
    monthsLeft: 16,
    travelers: 2,
    image: japan,
  },
  {
    id: "ft2",
    emoji: "🏔",
    name: "Kashmir Winter",
    target: 50000,
    saved: 15000,
    targetDate: "January 2027",
    monthsLeft: 9,
    travelers: 3,
    image: kashmir,
  },
  {
    id: "ft3",
    emoji: "🌴",
    name: "Maldives Escape",
    target: 80000,
    saved: 22000,
    targetDate: "October 2027",
    monthsLeft: 14,
    travelers: 2,
    image: maldives,
  },
];

export const myTrips = {
  Upcoming: [
    {
      name: "Goa Trip",
      dates: "12 Dec – 17 Dec",
      status: ["✈ Flight booked", "🏨 Hotel booked", "🚗 Car booked"],
      image: goa,
    },
    {
      name: "Manali Weekend",
      dates: "24 Jan – 27 Jan",
      status: ["✈ Flight booked", "🏨 Hotel pending"],
      image: manali,
    },
  ],
  Past: [
    {
      name: "Kashmir Spring",
      dates: "04 Apr – 10 Apr",
      status: ["✅ Completed", "⭐ Rated 5.0"],
      image: kashmir,
    },
  ],
  Saved: [
    {
      name: "Kyoto Sakura",
      dates: "Flexible · Mar 2027",
      status: ["💾 Saved plan", "🔔 Price alert on"],
      image: japan,
    },
  ],
};

export const inr = (n: number) =>
  "₹" + Math.round(n).toLocaleString("en-IN", { maximumFractionDigits: 0 });

export type TravelPackage = {
  id: string;
  name: string;
  region: string;
  nights: number;
  includes: string[];
  price: number;
  rating: number;
  image: string;
};

export const packages: TravelPackage[] = [
  {
    id: "pkg-goa",
    name: "Goa Beach Escape",
    region: "North Goa, India",
    nights: 4,
    includes: ["Return flights", "Beachfront stay", "Breakfast", "Sunset cruise"],
    price: 24999,
    rating: 4.7,
    image: goa,
  },
  {
    id: "pkg-manali",
    name: "Himachal Snow Trail",
    region: "Manali & Solang, India",
    nights: 5,
    includes: ["Volvo transfers", "Cottage stay", "Solang activities", "All breakfasts"],
    price: 18499,
    rating: 4.6,
    image: manali,
  },
  {
    id: "pkg-kashmir",
    name: "Kashmir Houseboat Week",
    region: "Srinagar & Gulmarg, India",
    nights: 6,
    includes: ["Houseboat night", "Shikara ride", "Gondola pass", "Private cab"],
    price: 32999,
    rating: 4.9,
    image: kashmir,
  },
  {
    id: "pkg-maldives",
    name: "Maldives Overwater Villa",
    region: "South Malé Atoll",
    nights: 4,
    includes: ["Return flights", "Overwater villa", "Half board", "Snorkel trip"],
    price: 89999,
    rating: 4.8,
    image: maldives,
  },
  {
    id: "pkg-japan",
    name: "Japan Sakura Circuit",
    region: "Tokyo · Kyoto · Osaka",
    nights: 8,
    includes: ["Return flights", "JR Pass", "3 city stays", "Guided temple walk"],
    price: 149999,
    rating: 4.9,
    image: japan,
  },
  {
    id: "pkg-rishikesh",
    name: "Rishikesh Adventure Weekend",
    region: "Uttarakhand, India",
    nights: 2,
    includes: ["Riverside camp", "Rafting", "Cliff jump", "Bonfire dinner"],
    price: 6999,
    rating: 4.5,
    image: hero,
  },
];
