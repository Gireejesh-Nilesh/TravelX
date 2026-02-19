export type PlaceInfoSection = {
  title: string;
  content: string;
};

export type Place = {
  id: string;
  name: string;
  country: string;
  distanceKm: number;
  price: number;
  image: string;
  images: string[];
  blurb: string;
  coordinates: { lat: number; lng: number };

  // NEW FIELDS
  type: string;
  popularFor: string;

  tags: string[];
  info: PlaceInfoSection[];
};

export const places: Place[] = [
  {
    id: 'santorini',
    name: 'Santorini',
    country: 'Greece',
    distanceKm: 8350,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 2000,
    blurb: 'Whitewashed cliffs, cobalt domes, and sunset views.',
    coordinates: { lat: 36.3932, lng: 25.4615 },

    type: 'Island',
    popularFor: 'Sunsets',

    tags: ['Caldera views', 'Sunsets', 'Cliffside villages'],
    info: [
      {
        title: 'History',
        content:
          'A volcanic island shaped by ancient eruptions, with villages rebuilt over centuries.',
      },
      {
        title: 'Famous For',
        content: 'Blue-domed churches, caldera cruises, and golden sunsets.',
      },
      {
        title: 'Best Time',
        content: 'Late spring to early fall for warm water and bright skies.',
      },
    ],
  },
  {
    id: 'kyoto',
    name: 'Kyoto',
    country: 'Japan',
    distanceKm: 10500,
    image:
      'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1495344517868-8ebaf0a2044a?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1549693578-d683be217e58?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 7000,
    blurb: 'Temples, bamboo groves, and timeless lantern streets.',
    coordinates: { lat: 35.0116, lng: 135.7681 },

    type: 'City',
    popularFor: 'Culture',

    tags: ['Shrines', 'Gardens', 'Tea culture'],
    info: [
      {
        title: 'History',
        content: 'Former imperial capital with centuries of art, craftsmanship, and ceremony.',
      },
      {
        title: 'Famous For',
        content: 'Fushimi Inari gates, Arashiyama bamboo, and Zen gardens.',
      },
      {
        title: 'Best Time',
        content: 'Spring for blossoms and autumn for vivid maple leaves.',
      },
    ],
  },
  {
    id: 'banff',
    name: 'Banff',
    country: 'Canada',
    distanceKm: 3100,
    image:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 7500,
    blurb: 'Turquoise lakes and alpine peaks in every direction.',
    coordinates: { lat: 51.1784, lng: -115.5708 },

    type: 'Mountain',
    popularFor: 'Nature',

    tags: ['Lakes', 'Hikes', 'Wildlife'],
    info: [
      {
        title: 'History',
        content: 'Canada’s oldest national park, founded around natural hot springs.',
      },
      {
        title: 'Famous For',
        content: 'Lake Louise, Moraine Lake, and rugged alpine trails.',
      },
      {
        title: 'Best Time',
        content: 'Summer for hikes, winter for snow sports and frozen lakes.',
      },
    ],
  },

  {
    id: 'cappadocia',
    name: 'Cappadocia',
    country: 'Turkey',
    distanceKm: 6300,
    image:
      'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1473625247510-8ceb1760943f?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 6000,
    blurb: 'Hot-air balloons over surreal volcanic valleys.',
    coordinates: { lat: 38.6431, lng: 34.8289 },

    type: 'Valley',
    popularFor: 'Hot Air Balloons',

    tags: ['Balloons', 'Caves', 'Valleys'],
    info: [
      {
        title: 'History',
        content: 'Ancient volcanic eruptions created the fairy chimneys and caves.',
      },
      {
        title: 'Famous For',
        content: 'Sunrise balloon rides and underground cities.',
      },
      {
        title: 'Best Time',
        content: 'April to June and September to October for clear skies.',
      },
    ],
  },

  {
    id: 'bali',
    name: 'Bali',
    country: 'Indonesia',
    distanceKm: 9700,
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1000&q=80',
    images: [
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 1000,
    blurb: 'Terraced rice fields and tranquil beach temples.',
    coordinates: { lat: -8.3405, lng: 115.092 },

    type: 'Island',
    popularFor: 'Beaches',

    tags: ['Temples', 'Beaches', 'Wellness'],
    info: [
      {
        title: 'History',
        content: 'A spiritual hub blending Hindu culture with island life.',
      },
    ],
  },
  {
    id: 'paris',
    name: 'Paris',
    country: 'France',
    distanceKm: 7400,
    image:
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1522098543979-ffc7f79d6d36?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 8000,
    blurb: 'Romantic boulevards, art, and timeless architecture.',
    coordinates: { lat: 48.8566, lng: 2.3522 },

    type: 'City',
    popularFor: 'Architecture',

    tags: ['Eiffel Tower', 'Museums', 'Cafés'],

    info: [
      {
        title: 'Overview',
        content:
          'Paris is globally admired for its historic landmarks, elegant streets, and cultural heritage.',
      },
      {
        title: 'Famous For',
        content: 'The Eiffel Tower, Louvre Museum, Seine River, and world-class cuisine.',
      },
      {
        title: 'Best Time',
        content: 'Spring and early autumn offer pleasant weather and beautiful city views.',
      },
    ],
  },

  {
    id: 'swiss-alps',
    name: 'Swiss Alps',
    country: 'Switzerland',
    distanceKm: 6800,
    image:
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1521292270410-a8c3a6b6e2f5?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 3000,
    blurb: 'Snow peaks, lakes, and postcard villages.',
    coordinates: { lat: 46.8182, lng: 8.2275 },

    type: 'Mountain',
    popularFor: 'Scenery',

    tags: ['Mountains', 'Lakes', 'Skiing'],

    info: [
      {
        title: 'Landscape',
        content:
          'The Swiss Alps feature dramatic mountain ranges, crystal-clear lakes, and charming alpine towns.',
      },
      {
        title: 'Popular Activities',
        content: 'Skiing, snowboarding, hiking, mountaineering, and scenic rail journeys.',
      },
      {
        title: 'Best Time',
        content: 'Winter for snow sports, summer for hiking and panoramic views.',
      },
    ],
  },

  /* ================= INDIA DESTINATIONS ================= */

  {
    id: 'goa',
    name: 'Goa',
    country: 'India',
    distanceKm: 1510,
    image:
      'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1496566084516-c5b96fcbd5c8?q=80&w=1172&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ],
    price: 10000,
    blurb: 'Golden beaches and vibrant nightlife.',
    coordinates: { lat: 15.2993, lng: 74.124 },

    type: 'Beach',
    popularFor: 'Nightlife',

    tags: ['Beaches', 'Shacks', 'Portuguese heritage'],

    info: [
      {
        title: 'Atmosphere',
        content:
          'Goa is known for its relaxed coastal lifestyle, beach culture, and lively entertainment scene.',
      },
      {
        title: 'Famous For',
        content: 'Beach parties, seafood, colonial architecture, and water sports.',
      },
      {
        title: 'Best Time',
        content: 'November to February for pleasant weather and peak tourism.',
      },
    ],
  },

  {
    id: 'manali',
    name: 'Manali',
    country: 'India',
    distanceKm: 2480,
    image:
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 9000,

    blurb: 'Snowy mountains and adventure escapes.',
    coordinates: { lat: 32.2432, lng: 77.1892 },

    type: 'Mountain',
    popularFor: 'Adventure',

    tags: ['Snow', 'Hiking', 'Valleys'],

    info: [
      {
        title: 'Overview',
        content:
          'Manali is a Himalayan resort town famous for mountain scenery and adventure tourism.',
      },
      {
        title: 'Activities',
        content: 'Trekking, skiing, paragliding, river rafting, and scenic drives.',
      },
      {
        title: 'Best Time',
        content: 'Winter for snow lovers, summer for outdoor exploration.',
      },
    ],
  },

  {
    id: 'jaipur',
    name: 'Jaipur',
    country: 'India',
    distanceKm: 280,
    image:
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 9500,

    blurb: 'The Pink City of forts and palaces.',
    coordinates: { lat: 26.9124, lng: 75.7873 },

    type: 'Heritage',
    popularFor: 'Architecture',

    tags: ['Hawa Mahal', 'Amber Fort', 'Culture'],

    info: [
      {
        title: 'History',
        content:
          'Jaipur is a historic royal city known for its palaces, forts, and vibrant traditions.',
      },
      {
        title: 'Famous For',
        content: 'Hawa Mahal, City Palace, Amber Fort, and colorful bazaars.',
      },
      {
        title: 'Best Time',
        content: 'October to March for comfortable sightseeing weather.',
      },
    ],
  },

  {
    id: 'agra',
    name: 'Agra',
    country: 'India',
    distanceKm: 210,
    image:
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 8500,

    blurb: 'Home of the iconic Taj Mahal.',
    coordinates: { lat: 27.1767, lng: 78.0081 },

    type: 'Heritage',
    popularFor: 'Monuments',

    tags: ['Taj Mahal', 'Mughal history'],

    info: [
      {
        title: 'Significance',
        content: 'Agra houses one of the Seven Wonders of the World, the Taj Mahal.',
      },
      {
        title: 'Famous For',
        content: 'Taj Mahal, Agra Fort, and Mughal architecture.',
      },
      {
        title: 'Best Time',
        content: 'Winter months for pleasant exploration.',
      },
    ],
  },

  {
    id: 'kerala',
    name: 'Kerala Backwaters',
    country: 'India',
    distanceKm: 2300,
    image:
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 8500,
    blurb: 'Serene canals, houseboats, and palm-lined waters.',
    coordinates: { lat: 9.4981, lng: 76.3388 },

    type: 'Nature',
    popularFor: 'Relaxation',

    tags: ['Houseboats', 'Lagoons', 'Greenery'],

    info: [
      {
        title: 'Overview',
        content:
          'Kerala’s backwaters are a network of tranquil canals, rivers, and lakes along the Arabian Sea coast.',
      },
      {
        title: 'Experience',
        content: 'Houseboat stays, village views, coconut groves, and slow-paced scenic cruising.',
      },
      {
        title: 'Best Time',
        content: 'September to March for pleasant weather and lush landscapes.',
      },
    ],
  },

  {
    id: 'ladakh',
    name: 'Ladakh',
    country: 'India',
    distanceKm: 3200,
    image:
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1627894483216-2138af692e32?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 9000,

    blurb: 'High-altitude deserts and dramatic Himalayan landscapes.',
    coordinates: { lat: 34.1526, lng: 77.577 },

    type: 'Mountain',
    popularFor: 'Road Trips',

    tags: ['Monasteries', 'Lakes', 'Biking'],

    info: [
      {
        title: 'Landscape',
        content:
          'Ladakh features rugged mountains, vast valleys, and surreal high-altitude deserts.',
      },
      {
        title: 'Famous For',
        content: 'Pangong Lake, Nubra Valley, Buddhist monasteries, and legendary bike journeys.',
      },
      {
        title: 'Best Time',
        content: 'May to September when roads are open and weather is favorable.',
      },
    ],
  },

  {
    id: 'varanasi',
    name: 'Varanasi',
    country: 'India',
    distanceKm: 680,
    image:
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1599661046827-dacde6976549?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 500,
    blurb: 'Ancient ghats and timeless spiritual energy.',
    coordinates: { lat: 25.3176, lng: 82.9739 },

    type: 'City',
    popularFor: 'Spirituality',

    tags: ['Ganga Aarti', 'Ghats', 'Temples'],

    info: [
      {
        title: 'Significance',
        content:
          'Varanasi is one of the world’s oldest living cities and a major spiritual center of India.',
      },
      {
        title: 'Famous For',
        content: 'Ganga Aarti rituals, sacred ghats, narrow lanes, and ancient temples.',
      },
      {
        title: 'Best Time',
        content: 'October to March for comfortable exploration.',
      },
    ],
  },

  {
    id: 'andaman',
    name: 'Andaman Islands',
    country: 'India',
    distanceKm: 2480,
    image:
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1000&q=80',

    images: [
      'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80',
      'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=1400&q=80',
    ],
    price: 200,
    blurb: 'Crystal-clear waters and untouched beaches.',
    coordinates: { lat: 11.7401, lng: 92.6586 },

    type: 'Island',
    popularFor: 'Beaches',

    tags: ['Snorkeling', 'Coral reefs', 'Tropical waters'],

    info: [
      {
        title: 'Overview',
        content:
          'The Andaman Islands are famous for turquoise waters, white sand beaches, and rich marine life.',
      },
      {
        title: 'Activities',
        content: 'Snorkeling, scuba diving, island hopping, and beach relaxation.',
      },
      {
        title: 'Best Time',
        content: 'November to May for clear skies and calm seas.',
      },
    ],
  },
];
