const User = require("../models/user");
const { ROLES } = require("../utils/roles");

async function seedUsers() {
  console.log("🧹 Removing old users...");
  await User.deleteMany({});

  const users = [];

  // ==========================
  // ADMIN
  // ==========================

  const admin = new User({
    username: "admin",
    email: "admin@wanderlust.com",
    fullName: "System Administrator",
    role: ROLES.ADMIN,
    bio: "Platform Administrator",
    phone: "+919999999999",
    location: "Pune, Maharashtra",
    avatar: {
      url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43b?w=500",
      filename: "admin-avatar",
    },
  });

  await User.register(admin, "Admin@123");
  users.push(admin);

  // ==========================
  // HOSTS
  // ==========================

  const hostsData = [
    {
      username: "host1",
      email: "rahul@example.com",
      fullName: "Rahul Sharma",
      location: "Goa",
      phone: "+919800000001",
      avatar:
        "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500",
    },
    {
      username: "host2",
      email: "priya@example.com",
      fullName: "Priya Patel",
      location: "Jaipur",
      phone: "+919800000002",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500",
    },
    {
      username: "host3",
      email: "vikram@example.com",
      fullName: "Vikram Singh",
      location: "Manali",
      phone: "+919800000003",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43b?w=500",
    },
  ];

  const hosts = [];

  for (const data of hostsData) {
    const host = new User({
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: ROLES.HOST,
      bio: "Experienced property host.",
      location: data.location,
      phone: data.phone,
      avatar: {
        url: data.avatar,
        filename: data.username,
      },
    });

    await User.register(host, "Host@123");

    hosts.push(host);
    users.push(host);
  }

  // ==========================
  // NORMAL USERS
  // ==========================

  const guestData = [
    {
      username: "amit",
      email: "amit@gmail.com",
      fullName: "Amit Verma",
      location: "Mumbai",
    },
    {
      username: "neha",
      email: "neha@gmail.com",
      fullName: "Neha Joshi",
      location: "Delhi",
    },
    {
      username: "rohit",
      email: "rohit@gmail.com",
      fullName: "Rohit Patil",
      location: "Pune",
    },
    {
      username: "pooja",
      email: "pooja@gmail.com",
      fullName: "Pooja Mehta",
      location: "Ahmedabad",
    },
    {
      username: "arjun",
      email: "arjun@gmail.com",
      fullName: "Arjun Nair",
      location: "Bangalore",
    },
    {
      username: "kiran",
      email: "kiran@gmail.com",
      fullName: "Kiran Rao",
      location: "Hyderabad",
    },
    {
      username: "meera",
      email: "meera@gmail.com",
      fullName: "Meera Kulkarni",
      location: "Nagpur",
    },
    {
      username: "sneha",
      email: "sneha@gmail.com",
      fullName: "Sneha Deshmukh",
      location: "Pune",
    },
  ];

  const guests = [];

  let index = 1;

  for (const data of guestData) {
    const guest = new User({
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      role: ROLES.USER,
      bio: "Traveller and explorer.",
      location: data.location,
      phone: `+91970000000${index}`,
      avatar: {
        url: `https://i.pravatar.cc/300?img=${index + 10}`,
        filename: data.username,
      },
    });

    await User.register(guest, "User@123");

    guests.push(guest);
    users.push(guest);

    index++;
  }

  console.log("=================================");
  console.log("✅ Users Seeded Successfully");
  console.log("=================================");
  console.log(`Admin  : 1`);
  console.log(`Hosts  : ${hosts.length}`);
  console.log(`Guests : ${guests.length}`);
  console.log(`Total  : ${users.length}`);
  console.log("=================================");

  return {
    admin,
    hosts,
    guests,
    users,
  };
}

module.exports = seedUsers;