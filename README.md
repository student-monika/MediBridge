# 🏥 MediBridge

**MediBridge** is a donation-based web platform designed to connect donors (clinics, hospitals, pharmacies) with receivers (rural clinics, NGOs) for redistributing surplus medical supplies before they expire. The goal is to reduce medical waste and improve access to essential healthcare resources in under-resourced areas.

---

## 📌 Problem Statement

Every year, tons of usable medical supplies are discarded due to expiry or overstock, while many rural or underserved areas face critical shortages. There's no centralized system to match surplus with demand in real time.

---

## 💡 Solution

MediBridge offers a real-time, transparent, and easy-to-use platform where:
- **Donors** can list surplus supplies with expiry dates and quantities.
- **Receivers** can browse, request, and receive approved items.
- Both parties can track the donation journey with status updates and contact details.

---

## 🚀 Features

- 🔐 User Authentication (Donor & Receiver roles)
- 🧾 Browse Available Supplies (with filters)
- ➕ Add New Donation (item name, quantity, expiry, location)
- 📥 Request Items
- 📊 Dashboards: My Donations / My Requests
- 🔄 Real-time Updates using Firebase

---

## 🛠️ Tech Stack

### Frontend:
- React.js
- Tailwind CSS
- React Router

### Backend & Auth:
- Firebase Firestore (Database)
- Firebase Auth (Authentication)