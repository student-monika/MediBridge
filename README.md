# 🏥 MediBridge

**MediBridge** is a donation-based web platform designed to connect **Donors** (clinics, hospitals, pharmacies) with **Receivers** (rural clinics, NGOs) for redistributing surplus medical supplies before they expire. The goal is to reduce medical waste and improve access to essential healthcare resources in under-resourced areas.

---

## 📌 Problem Statement

Every year, tons of usable medical supplies are discarded due to expiry or overstock, while many rural or underserved areas face critical shortages. There is no centralized system to match surplus with demand in real time, and securely managing the request-to-delivery lifecycle is complex.

---

## 💡 Solution

MediBridge offers a real-time, transparent, and easy-to-use platform where:
- **Donors** can list surplus supplies with expiry dates and manage inventory status.
- **Receivers** can browse, request, and track items through a unified dashboard.
- The platform securely and dynamically closes the loop from request initiation to collection.

---

## 🚀 Key Features

- 🔐 **Role-Based Authentication:** Secure sign-in for distinct Donor and Receiver roles (via email/password or Google).
- 📊 **Dynamic Dashboards:** Real-time statistics are displayed based on the user's role (Available Supplies, Pending Requests, Completed Donations, etc.).
- 🧾 **Browse Supplies:** Receivers can view and filter all available supplies by category, location, and expiry date.
- ➕ **Donation Management (Donor):**
    - List new supplies (item name, quantity, expiry, location).
    - View all donated items and see **live pending requests** directly on the inventory cards.
    - **Accept / Reject** pending requests instantly.
- 📥 **Request Tracking (Receiver):**
    - Unified, **tabbed interface** (All, Pending, Approved, Rejected) to easily track all submitted requests.
- 🤝 **Secure Contact Sharing:** Upon approval, the Receiver is **automatically provided** with the Donor's secure contact details (Email, Phone, Pickup Location) within the request card, facilitating immediate collection.
- 🔄 **Real-time Updates:** All views (Dashboards, Donations, Requests) update instantly using Firebase Firestore listeners.

---

## 🛠️ Tech Stack

### Frontend:
- **React.js**
- **Tailwind CSS** (for utility-first styling and unified UI across pages)
- **React Router**

### Backend & Auth:
- **Firebase Firestore** (Real-time Database and efficient complex querying)
- **Firebase Auth** (Authentication service)

---