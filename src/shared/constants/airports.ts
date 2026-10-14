export type Airport = {
  iata: string;
  icao: string;
  name: string;
  city: string;
  state?: string;
  country: string;
  lat: number;
  lng: number;
  timezone: string;
};

/**
 * Filtered OpenFlights dataset containing major Indian airports and primary connected international hubs.
 * Source: OpenFlights Airport Database (Open Database License).
 */
export const AIRPORTS: Airport[] = [
  // Major Indian Metro & Primary Hubs
  {
    iata: "DEL",
    icao: "VIDP",
    name: "Indira Gandhi International Airport",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    lat: 28.5562,
    lng: 77.1,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "BOM",
    icao: "VABB",
    name: "Chhatrapati Shivaji Maharaj International Airport",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    lat: 19.0896,
    lng: 72.8656,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "BLR",
    icao: "VOBL",
    name: "Kempegowda International Airport",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
    lat: 13.1986,
    lng: 77.7066,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "HYD",
    icao: "VOHS",
    name: "Rajiv Gandhi International Airport",
    city: "Hyderabad",
    state: "Telangana",
    country: "India",
    lat: 17.2403,
    lng: 78.4294,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "MAA",
    icao: "VOMM",
    name: "Chennai International Airport",
    city: "Chennai",
    state: "Tamil Nadu",
    country: "India",
    lat: 12.9941,
    lng: 80.1709,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "CCU",
    icao: "VECC",
    name: "Netaji Subhash Chandra Bose International Airport",
    city: "Kolkata",
    state: "West Bengal",
    country: "India",
    lat: 22.6547,
    lng: 88.4467,
    timezone: "Asia/Kolkata",
  },
  // Key Tourist & Leisure Destinations
  {
    iata: "GOI",
    icao: "VAGO",
    name: "Dabolim International Airport",
    city: "Goa (Dabolim)",
    state: "Goa",
    country: "India",
    lat: 15.3808,
    lng: 73.8314,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "GOX",
    icao: "VOGA",
    name: "Manohar International Airport Mopa",
    city: "North Goa (Mopa)",
    state: "Goa",
    country: "India",
    lat: 15.7672,
    lng: 73.8686,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "SXR",
    icao: "VISR",
    name: "Sheikh ul-Alam International Airport",
    city: "Srinagar",
    state: "Jammu and Kashmir",
    country: "India",
    lat: 33.9871,
    lng: 74.7742,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "JAI",
    icao: "VIJP",
    name: "Jaipur International Airport",
    city: "Jaipur",
    state: "Rajasthan",
    country: "India",
    lat: 26.8242,
    lng: 75.8122,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "COK",
    icao: "VOCI",
    name: "Cochin International Airport",
    city: "Kochi",
    state: "Kerala",
    country: "India",
    lat: 10.1556,
    lng: 76.3917,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "IXC",
    icao: "VICG",
    name: "Shaheed Bhagat Singh International Airport",
    city: "Chandigarh (Gate to Manali/Shimla)",
    state: "Punjab/Haryana",
    country: "India",
    lat: 30.6735,
    lng: 76.7885,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "KUU",
    icao: "VIBR",
    name: "Kullu-Manali Airport (Bhuntar)",
    city: "Kullu Manali",
    state: "Himachal Pradesh",
    country: "India",
    lat: 31.8767,
    lng: 77.1544,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "DED",
    icao: "VIDN",
    name: "Jolly Grant Airport",
    city: "Dehradun (Rishikesh)",
    state: "Uttarakhand",
    country: "India",
    lat: 30.1897,
    lng: 78.1803,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "IXL",
    icao: "VILH",
    name: "Kushok Bakula Rimpochee Airport",
    city: "Leh Ladakh",
    state: "Ladakh",
    country: "India",
    lat: 34.1359,
    lng: 77.5465,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "PNQ",
    icao: "VAPO",
    name: "Pune Airport",
    city: "Pune (Lonavala Hub)",
    state: "Maharashtra",
    country: "India",
    lat: 18.5822,
    lng: 73.9197,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "AMD",
    icao: "VAAH",
    name: "Sardar Vallabhbhai Patel International Airport",
    city: "Ahmedabad",
    state: "Gujarat",
    country: "India",
    lat: 23.0772,
    lng: 72.6347,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "IXB",
    icao: "VEBD",
    name: "Bagdogra Airport",
    city: "Siliguri (Darjeeling/Sikkim)",
    state: "West Bengal",
    country: "India",
    lat: 26.6812,
    lng: 88.3286,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "VNS",
    icao: "VIBN",
    name: "Lal Bahadur Shastri International Airport",
    city: "Varanasi",
    state: "Uttar Pradesh",
    country: "India",
    lat: 25.4524,
    lng: 82.8593,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "ATQ",
    icao: "VIAR",
    name: "Sri Guru Ram Dass Jee International Airport",
    city: "Amritsar",
    state: "Punjab",
    country: "India",
    lat: 31.7096,
    lng: 74.7973,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "UDR",
    icao: "VAUD",
    name: "Maharana Pratap Airport",
    city: "Udaipur",
    state: "Rajasthan",
    country: "India",
    lat: 24.6177,
    lng: 73.8961,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "GAU",
    icao: "VEGT",
    name: "Lokpriya Gopinath Bordoloi International Airport",
    city: "Guwahati",
    state: "Assam",
    country: "India",
    lat: 26.1061,
    lng: 91.5859,
    timezone: "Asia/Kolkata",
  },
  {
    iata: "TRV",
    icao: "VOTV",
    name: "Thiruvananthapuram International Airport",
    city: "Thiruvananthapuram",
    state: "Kerala",
    country: "India",
    lat: 8.4821,
    lng: 76.92,
    timezone: "Asia/Kolkata",
  },
  // Key International Connected Hubs
  {
    iata: "DXB",
    icao: "OMDB",
    name: "Dubai International Airport",
    city: "Dubai",
    country: "United Arab Emirates",
    lat: 25.2532,
    lng: 55.3657,
    timezone: "Asia/Dubai",
  },
  {
    iata: "SIN",
    icao: "WSSS",
    name: "Singapore Changi Airport",
    city: "Singapore",
    country: "Singapore",
    lat: 1.3644,
    lng: 103.9915,
    timezone: "Asia/Singapore",
  },
  {
    iata: "BKK",
    icao: "VTBS",
    name: "Suvarnabhumi Airport",
    city: "Bangkok",
    country: "Thailand",
    lat: 13.69,
    lng: 100.7501,
    timezone: "Asia/Bangkok",
  },
  {
    iata: "MLE",
    icao: "VRMM",
    name: "Velana International Airport",
    city: "Male",
    country: "Maldives",
    lat: 4.1918,
    lng: 73.529,
    timezone: "Indian/Maldives",
  },
  {
    iata: "HND",
    icao: "RJTT",
    name: "Tokyo Haneda Airport",
    city: "Tokyo",
    country: "Japan",
    lat: 35.5494,
    lng: 139.7798,
    timezone: "Asia/Tokyo",
  },
  {
    iata: "DPS",
    icao: "WADD",
    name: "Ngurah Rai International Airport",
    city: "Bali (Denpasar)",
    country: "Indonesia",
    lat: -8.7482,
    lng: 115.1672,
    timezone: "Asia/Makassar",
  },
];

/**
 * Fast client-side search for airports matching query string.
 * Matches against IATA code, city name, airport name, and state.
 */
export function searchAirports(query: string, limit = 8): Airport[] {
  if (!query || query.trim().length === 0) {
    return AIRPORTS.slice(0, limit);
  }

  const q = query.trim().toLowerCase();
  return AIRPORTS.filter((a) => {
    return (
      a.iata.toLowerCase().includes(q) ||
      a.city.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      (a.state && a.state.toLowerCase().includes(q)) ||
      a.country.toLowerCase().includes(q)
    );
  }).slice(0, limit);
}

/**
 * Find airport by exact IATA code (case-insensitive).
 */
export function getAirportByIata(iata: string): Airport | undefined {
  const code = iata.trim().toUpperCase();
  return AIRPORTS.find((a) => a.iata === code);
}
