# 🍽️ Zenvy – Batch-Based Food Ordering System

## 🚀 Overview
Zenvy is a backend-driven food ordering platform that enables users to place **group-based orders within batches**.  
Instead of placing individual orders, users join a batch (e.g., hostel, office group) and order collectively within a defined time window.

This approach improves coordination, reduces delivery overhead, and mimics real-world group ordering scenarios.

---

## ✨ Features

- 👥 **Batch System**
  - Users can create and join batches
  - Supports multiple users per batch

- 🕒 **Time-Window Based Ordering**
  - Orders are only accepted within an active batch duration
  - Prevents late or inconsistent orders

- 🧾 **Order Aggregation**
  - Combines multiple user orders into a single batch order
  - Efficient processing and tracking

- 🔐 **Authentication**
  - JWT-based user authentication
  - Stateless and scalable session handling

- 🔗 **Relational Data Modeling**
  - Many-to-many relationship between users and batches
  - Clean and normalized schema design

- ⚡ **Concurrent Order Handling**
  - Ensures data consistency during multiple simultaneous orders

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js  
- **Database:** PostgreSQL  
- **Authentication:** JWT  
- **API Style:** REST  

---

## 🧠 System Design Highlights

- Designed a **batch-based architecture** to optimize group ordering
- Implemented **time-bound logic** to simulate real-world ordering constraints
- Structured database to handle:
  - Users ↔ Batches (many-to-many)
  - Batches ↔ Orders (one-to-many)
- Focused on **scalability and consistency** for concurrent users

---

## 📦 API Modules

- **Auth**
  - Register / Login
- **Users**
  - Profile management
- **Batches**
  - Create batch
  - Join batch
  - View joined batches
- **Orders**
  - Place order within batch
  - Fetch batch orders

---

## ⚠️ Current Limitations

- Basic authentication (can be improved with OAuth / refresh tokens)
- No payment integration yet
- Limited frontend (primarily backend-focused project)
- Some edge cases in batch-user mapping are under improvement

---

## 🔮 Future Improvements

- 💳 Payment integration (Stripe/Razorpay)
- 📡 Real-time updates using WebSockets
- 📦 Order status tracking
- 🧠 Smart batch recommendations
- 🔐 Advanced authentication & role-based access

---

## 🧑‍💻 Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd zenvy
