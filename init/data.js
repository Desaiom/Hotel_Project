const Listing = require("../models/listing");

function createListing({
  title,
  description,
  images,
  location,
  country,
  coordinates,
  price,
  category,
  maxGuests,
  owner,
  amenities = [],
}) {
  return {
    title,
    description,

    images: images.map((url, index) => ({
      url,
      filename: `${title.toLowerCase().replace(/\s+/g, "-")}-${index + 1}`,
    })),

    price,
    basePrice: price,
    category,
    maxGuests,
    owner: owner._id,
    location,
    country,
    amenities,

    geometry: {
      type: "Point",
      coordinates,
    },
  };
}

async function seedListings(hosts) {
  console.log("🧹 Removing old listings...");

  await Listing.deleteMany({});

  const listings = [];
  listings.push(
    createListing({
      title: "Luxury Beach Villa",
      description:
        "Private villa overlooking the Arabian Sea with an infinity pool and stunning sunset views.",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
      ],
      location: "Goa",
      country: "India",
      coordinates: [73.8278, 15.4909],
      price: 12500,
      category: "Villa",
      maxGuests: 8,
      owner: hosts[0],
      amenities: ["WiFi", "Pool", "Kitchen", "Parking", "Beach Access"],
    }),
  );

  listings.push(
    createListing({
      title: "Mountain Cabin Retreat",
      description:
        "Beautiful wooden cabin surrounded by pine forests and Himalayan views.",
      images: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
        "https://images.unsplash.com/photo-1448375240586-882707db888b",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
        "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
      ],
      location: "Manali",
      country: "India",
      coordinates: [77.1892, 32.2396],
      price: 6900,
      category: "Cabin",
      maxGuests: 4,
      owner: hosts[2],
      amenities: ["Fireplace", "Parking", "WiFi", "Mountain View"],
    }),
  );

  listings.push(
    createListing({
      title: "Royal Heritage Haveli",
      description:
        "Experience royal Rajasthan inside a beautifully restored haveli.",
      images: [
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
      ],
      location: "Jaipur",
      country: "India",
      coordinates: [75.7873, 26.9124],
      price: 9800,
      category: "Heritage",
      maxGuests: 6,
      owner: hosts[1],
      amenities: ["Breakfast", "WiFi", "Parking", "Garden"],
    }),
  );

  listings.push(
    createListing({
      title: "Modern Studio Apartment",
      description:
        "Luxury apartment in the center of Bangalore close to IT parks.",
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
        "https://images.unsplash.com/photo-1460317442991-0ec209397118",
      ],
      location: "Bengaluru",
      country: "India",
      coordinates: [77.5946, 12.9716],
      price: 5200,
      category: "Apartment",
      maxGuests: 4,
      owner: hosts[0],
      amenities: ["WiFi", "Kitchen", "Workspace", "TV"],
    }),
  );

  listings.push(
    createListing({
      title: "Backwater House",
      description:
        "Relax beside Kerala's peaceful backwaters with traditional hospitality.",
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      ],
      location: "Alleppey",
      country: "India",
      coordinates: [76.3388, 9.4981],
      price: 7600,
      category: "House",
      maxGuests: 5,
      owner: hosts[1],
      amenities: ["Boat Ride", "WiFi", "Breakfast"],
    }),
  );

  listings.push(
    createListing({
      title: "Lake View Resort",
      description:
        "Elegant lakeside resort with premium rooms and sunset views.",
      images: [
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
      ],
      location: "Udaipur",
      country: "India",
      coordinates: [73.6833, 24.5854],
      price: 10500,
      category: "Resort",
      maxGuests: 6,
      owner: hosts[2],
      amenities: ["Pool", "Restaurant", "Spa", "WiFi"],
    }),
  );

  listings.push(
    createListing({
      title: "Luxury Tree House",
      description: "Stay among the trees with breathtaking rainforest scenery.",
      images: [
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        "https://images.unsplash.com/photo-1448375240586-882707db888b",
      ],
      location: "Wayanad",
      country: "India",
      coordinates: [76.132, 11.6854],
      price: 8800,
      category: "Tree House",
      maxGuests: 4,
      owner: hosts[0],
      amenities: ["WiFi", "Breakfast", "Balcony"],
    }),
  );

  listings.push(
    createListing({
      title: "Desert Camp",
      description: "Luxury tents under the stars in Rajasthan's golden desert.",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
      ],
      location: "Jaisalmer",
      country: "India",
      coordinates: [70.9083, 26.9157],
      price: 4900,
      category: "Camping",
      maxGuests: 3,
      owner: hosts[1],
      amenities: ["Campfire", "Dinner", "Parking"],
    }),
  );

  listings.push(
    createListing({
      title: "Snow Peak Chalet",
      description: "Luxury chalet with spectacular Himalayan mountain views.",
      images: [
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
        "https://images.unsplash.com/photo-1448375240586-882707db888b",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
      ],
      location: "Shimla",
      country: "India",
      coordinates: [77.1734, 31.1048],
      price: 8500,
      category: "Chalet",
      maxGuests: 5,
      owner: hosts[2],
      amenities: ["Fireplace", "WiFi", "Parking"],
    }),
  );

  listings.push(
    createListing({
      title: "Beachfront Cottage",
      description: "Wake up to ocean waves in this beautiful beach cottage.",
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
      ],
      location: "Gokarna",
      country: "India",
      coordinates: [74.3188, 14.5479],
      price: 7200,
      category: "Cottage",
      maxGuests: 4,
      owner: hosts[0],
      amenities: ["Beach Access", "WiFi", "Kitchen"],
    }),
  );

  listings.push(
    createListing({
      title: "Ocean Paradise Villa",
      description:
        "Luxury villa overlooking the turquoise waters of the Maldives with a private infinity pool.",
      images: [
        "https://images.unsplash.com/photo-1573843981267-be1999ff37cd",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
      ],
      location: "Malé",
      country: "Maldives",
      coordinates: [73.5093, 4.1755],
      price: 28000,
      category: "Villa",
      maxGuests: 6,
      owner: hosts[0],
      amenities: ["Private Pool", "WiFi", "Breakfast", "Ocean View", "Spa"],
    }),
  );

  listings.push(
    createListing({
      title: "Santorini Cliff Suite",
      description:
        "Whitewashed suite with breathtaking views of the Aegean Sea.",
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
      ],
      location: "Santorini",
      country: "Greece",
      coordinates: [25.4615, 36.3932],
      price: 19500,
      category: "Suite",
      maxGuests: 4,
      owner: hosts[1],
      amenities: ["Infinity Pool", "Breakfast", "WiFi", "Sea View"],
    }),
  );

  listings.push(
    createListing({
      title: "Swiss Alpine Chalet",
      description: "Cozy wooden chalet with panoramic views of the Swiss Alps.",
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
        "https://images.unsplash.com/photo-1448375240586-882707db888b",
        "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
      ],
      location: "Zermatt",
      country: "Switzerland",
      coordinates: [7.7491, 46.0207],
      price: 22000,
      category: "Chalet",
      maxGuests: 6,
      owner: hosts[2],
      amenities: ["Fireplace", "Mountain View", "WiFi", "Parking"],
    }),
  );

  listings.push(
    createListing({
      title: "Bali Jungle Retreat",
      description:
        "Hidden villa surrounded by tropical forests and rice terraces.",
      images: [
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
      ],
      location: "Ubud",
      country: "Indonesia",
      coordinates: [115.2625, -8.5069],
      price: 11800,
      category: "Villa",
      maxGuests: 5,
      owner: hosts[0],
      amenities: ["Private Pool", "Spa", "Breakfast", "WiFi"],
    }),
  );

  listings.push(
    createListing({
      title: "Tokyo Skyline Apartment",
      description:
        "Modern apartment with stunning skyline views in central Tokyo.",
      images: [
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
        "https://images.unsplash.com/photo-1460317442991-0ec209397118",
      ],
      location: "Tokyo",
      country: "Japan",
      coordinates: [139.6917, 35.6895],
      price: 13200,
      category: "Apartment",
      maxGuests: 3,
      owner: hosts[1],
      amenities: ["WiFi", "Workspace", "Metro Access", "Kitchen"],
    }),
  );

  listings.push(
    createListing({
      title: "Paris Boutique Stay",
      description: "Elegant boutique apartment near the Eiffel Tower.",
      images: [
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
        "https://images.unsplash.com/photo-1460317442991-0ec209397118",
      ],
      location: "Paris",
      country: "France",
      coordinates: [2.3522, 48.8566],
      price: 17600,
      category: "Apartment",
      maxGuests: 4,
      owner: hosts[2],
      amenities: ["WiFi", "Balcony", "Kitchen", "City View"],
    }),
  );

  listings.push(
    createListing({
      title: "Dubai Marina Penthouse",
      description:
        "Luxury penthouse overlooking Dubai Marina with premium amenities.",
      images: [
        "https://images.unsplash.com/photo-1560185007-c5ca9d2c014d",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
      ],
      location: "Dubai",
      country: "UAE",
      coordinates: [55.1403, 25.08],
      price: 24500,
      category: "Penthouse",
      maxGuests: 8,
      owner: hosts[0],
      amenities: ["Pool", "Gym", "WiFi", "Parking", "City View"],
    }),
  );

  listings.push(
    createListing({
      title: "New York Loft",
      description: "Industrial-style loft in Manhattan close to Times Square.",
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
        "https://images.unsplash.com/photo-1460317442991-0ec209397118",
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
      ],
      location: "New York",
      country: "USA",
      coordinates: [-74.006, 40.7128],
      price: 21000,
      category: "Loft",
      maxGuests: 5,
      owner: hosts[1],
      amenities: ["WiFi", "Workspace", "Kitchen", "Elevator"],
    }),
  );

  listings.push(
    createListing({
      title: "Sydney Harbour Apartment",
      description:
        "Luxury apartment with spectacular harbour and Opera House views.",
      images: [
        "https://images.unsplash.com/photo-1494526585095-c41746248156",
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1502672023488-70e25813eb80",
        "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        "https://images.unsplash.com/photo-1460317442991-0ec209397118",
      ],
      location: "Sydney",
      country: "Australia",
      coordinates: [151.2093, -33.8688],
      price: 18400,
      category: "Apartment",
      maxGuests: 4,
      owner: hosts[2],
      amenities: ["Harbour View", "WiFi", "Parking", "Kitchen"],
    }),
  );

  listings.push(
    createListing({
      title: "Iceland Glass Cabin",
      description: "Watch the Northern Lights from your private glass cabin.",
      images: [
        "https://images.unsplash.com/photo-1449824913935-59a10b8d2000",
        "https://images.unsplash.com/photo-1448375240586-882707db888b",
        "https://images.unsplash.com/photo-1470770903676-69b98201ea1c",
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
        "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      ],
      location: "Reykjavik",
      country: "Iceland",
      coordinates: [-21.9426, 64.1466],
      price: 19800,
      category: "Cabin",
      maxGuests: 4,
      owner: hosts[0],
      amenities: ["Hot Tub", "WiFi", "Fireplace", "Mountain View"],
    }),
  );
  // Insert all listings into MongoDB
  const insertedListings = await Listing.insertMany(listings);

  console.log("✅ Listings seeded successfully!");
  console.log(`🏡 Total Listings: ${insertedListings.length}`);

  return insertedListings;
}

module.exports = seedListings;
