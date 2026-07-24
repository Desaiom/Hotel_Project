# 🌍 Wanderlust – Hotel Booking & Property Listing Platform

A full-stack hotel booking and property listing web application . Wanderlust allows users to discover hotels, list their own properties, book stays, manage bookings, leave reviews, and maintain wishlists.

---



# ✨ Features

## 👤 Authentication & Authorization

- User Registration
- Secure Login & Logout
- Password Hashing using Passport.js
- Session Authentication
- Flash Messages
- Authorization Middleware
- Protected Routes

---

## 🏨 Property Listings

- Create Property Listing
- Edit Listing
- Delete Listing
- Upload Property Images
- Multiple Property Details
- Property Description
- Pricing
- Country & Location
- Category Support
- Host Information

---

## ❤️ Wishlist

- Add Listings to Wishlist
- Remove from Wishlist
- Personalized Wishlist Page

---

## ⭐ Reviews & Ratings

- Add Reviews
- Star Ratings
- Delete Reviews
- Review Authorization
- Average Rating Display

---

## 📅 Booking System

- Book Properties
- Select Check-in Date
- Select Check-out Date
- Guest Count
- Booking Summary
- Booking History
- Cancel Booking

---

## 💳 Payment Integration

- Secure Online Payments
- Booking Confirmation after Successful Payment

> *(Mention payment provider if integrated, e.g. Razorpay or Stripe.)*

---

## 🗺️ Maps & Location

- Interactive Maps
- Property Location Display
- Location Search

---

## ☁️ Image Upload

- Cloudinary Image Storage
- Multer Image Upload
- Optimized Image Delivery

---

## 📱 Responsive UI

- Fully Responsive
- Bootstrap 5
- Mobile Friendly
- Modern UI

---

# 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- Bootstrap 5
- JavaScript
- EJS
- EJS-Mate

### Backend

- Node.js
- Express.js

### Database

- MongoDB
- Mongoose

### Authentication

- Passport.js
- Passport Local
- Express Session

### Cloud Services

- Cloudinary

### Maps

- Mapbox API

### Validation

- Joi

### Other Packages

- Multer
- Connect Flash
- Method Override
- Cookie Parser
- Dotenv
- Express Error Handler

---

# 📂 Project Structure

```
wanderlust/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── views/
│   ├── listings/
│   ├── users/
│   ├── bookings/
│   ├── wishlist/
│   ├── includes/
│   └── layouts/
│
├── public/
│   ├── css/
│   ├── js/
│   └── images/
│
├── utils/
├── cloudConfig.js
├── app.js
├── package.json
└── README.md
```

---

# Database Models

- User
- Listing
- Review
- Booking
- Wishlist

---

# REST API Routes

## Authentication

```
POST   /signup
POST   /login
GET    /logout
```

---

## Listings

```
GET    /listings
GET    /listings/new
POST   /listings
GET    /listings/:id
PUT    /listings/:id
DELETE /listings/:id
```

---

## Reviews

```
POST   /listings/:id/reviews
DELETE /listings/:id/reviews/:reviewId
```

---

## Wishlist

```
POST   /wishlist/:id
DELETE /wishlist/:id
GET    /wishlist
```

---

## Bookings

```
POST   /bookings/:listingId
GET    /bookings
DELETE /bookings/:id
```

---

# Security Features

- Password Hashing
- Session Management
- Authentication Middleware
- Authorization Checks
- Server-side Validation
- Secure Environment Variables
- Input Validation using Joi

---

# Future Enhancements

- Email Verification
- Forgot Password
- Google OAuth Login
- Property Availability Calendar
- Nearby Attractions
- Host Dashboard
- Booking Invoice (PDF)
- Admin Dashboard
- Property Search Filters
- Payment History
- Chat Between Host & Guest
- Notifications
- Multi-language Support

---

# Learning Outcomes

Through this project I gained hands-on experience with:

- MVC Architecture
- RESTful APIs
- Authentication & Authorization
- Session Management
- MongoDB Relationships
- CRUD Operations
- Image Uploads
- Cloudinary Integration
- Mapbox Integration
- Payment Gateway Integration
- Full Stack Development
- Deployment Workflow
- Error Handling
- Secure Web Development

---
