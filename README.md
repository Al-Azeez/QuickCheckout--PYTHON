# QUICKCHECKOUT 2.0
## Next-Generation Smart Supermarket Self-Checkout Platform

> **TAGLINE:** SHOP. SCAN. PAY. GO.  
> **BRAND MESSAGE:** NO MORE WAITING IN LONG QUEUES.

QuickCheckout 2.0 is an enterprise-grade commercial retail-technology platform designed with the visual sophistication of Stripe, Linear, and modern fintech platforms. It delivers an autonomous in-store self-checkout experience for shoppers while equipping supermarket administrators with live barcode catalog management, atomic MongoDB inventory tracking, UPI soundbox verification, and GSTIN-compliant digital invoicing.

---

## 1. System Architecture

```
                                  +---------------------------------------+
                                  |         QUICKCHECKOUT 2.0 UI          |
                                  |    React 19 + Tailwind CSS + Vite     |
                                  |         Port: 3454 (Browser)          |
                                  +---------------------------------------+
                                                     |
                                            REST API (Axios + JWT)
                                                     v
                                  +---------------------------------------+
                                  |       DJANGO REST FRAMEWORK API       |
                                  |       Python 3.14 + JWT Auth          |
                                  |         Port: 5676 (Backend)          |
                                  +---------------------------------------+
                                                     |
                                          PyMongo Driver Client
                                                     v
                                  +---------------------------------------+
                                  |             DATABASE                  |
                                  |    MongoDB Atlas / Embedded PyMongo   |
                                  |  - Normalized Unique Barcode Index    |
                                  |  - Atomic Stock Deduction             |
                                  |  - Encrypted Transactions & Invoices  |
                                  +---------------------------------------+
```

---

## 2. Mandatory Technology Stack

### Frontend:
- **Framework:** React.js (v19) with Vite
- **Styling:** Tailwind CSS (v4) with custom fintech design tokens
- **Routing:** React Router (v7)
- **Icons:** Lucide React icons
- **State & Data Fetching:** TanStack Query + Context API + Axios
- **Animations:** Framer Motion
- **Barcode Engine:** HTML5-QRCode with interactive Laser Viewfinder
- **Receipt & Confetti:** Canvas-Confetti, CSS print stylesheets

### Backend:
- **Language:** Python
- **Web Framework:** Django
- **API Engine:** Django REST Framework (DRF)
- **Security & Auth:** HMAC SHA-256 password hashing + JWT token architecture
- **Database Driver:** PyMongo with resilient Atlas support and in-memory test fallback
- **Cross-Origin:** `django-cors-headers`

### Database:
- **Engine:** MongoDB Atlas (`quickcheckout_db`)
- **Indexes:**
  - `products`: Unique index on `barcode` and `sku`, index on `category` and `name`
  - `users`: Unique index on `email`
  - `orders`: Unique index on `order_id`

---

## 3. Development Port Configuration

| Service | Technology | Port | Local URL |
| :--- | :--- | :--- | :--- |
| **Frontend** | React + Vite | `3454` | [http://localhost:3454](http://localhost:3454) |
| **Backend** | Django + DRF | `5676` | [http://127.0.0.1:5676](http://127.0.0.1:5676) |

Frontend communicates with backend via `VITE_API_URL=http://127.0.0.1:5676/api`.

---

## 4. Key Features & Business Rules

### A. Admin-to-Customer Barcode Synchronization
1. **Admin Product Registration:** Admin enters product details, sets price in ₹, assigns shelf stock, and inputs/generates a unique 13-digit normalized barcode.
2. **MongoDB Database Persistence:** Stored with a strict unique index constraint on `barcode`.
3. **Customer In-Store Scanning:** Customer points their camera or inputs the barcode.
4. **Instant Match:** Exact lookup against MongoDB retrieves the actual product image, unit price, stock availability, and discount.
5. **Stock Badges:**
   - **Green:** In Stock (Units > 5)
   - **Yellow:** Low Stock (1 ≤ Units ≤ 5)
   - **Red:** Out of Stock (0 units – cannot be added to cart)

### B. Smart Cart & Atomic Inventory Control
- Items in cart are checked against active stock levels.
- Upon verified payment, stock is atomically decremented (`$inc: { stock: -qty }`) using MongoDB conditional updates to eliminate race conditions and overselling.

### C. Digital Invoicing & Store Exit Gate Pass
- Every checkout generates a GSTIN-compliant digital cash memo with itemized CGST/SGST tax breakdown.
- Generates an encrypted exit gate pass barcode for automated turnstile security release.

### D. Multilingual & Dual Theme Support
- **Languages:** English and Hindi (हिंदी)
- **Themes:** Light mode and Dark mode

---

## 5. API Reference Contract

### Authentication:
- `POST /api/auth/register/` - Register new customer or admin
- `POST /api/auth/login/` - JWT login
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/auth/profile/` - Get current user profile
- `POST /api/auth/forgot-password/` - Password recovery

### Products:
- `GET /api/products/` - Query products with category, availability, and sort filters
- `POST /api/products/` - Add product with unique barcode (Admin)
- `GET /api/products/<id>/` - Product details
- `PUT /api/products/<id>/` - Update product & inventory (Admin)
- `DELETE /api/products/<id>/` - Delete product (Admin)
- `GET /api/categories/` - Category listings with live counts

### Barcode System:
- `GET /api/products/barcode/<barcode>/` - Exact barcode lookup
- `POST /api/products/scan/` - Process camera scan payload

### Cart:
- `GET /api/cart/` - Active cart with real-time stock sync
- `POST /api/cart/add/` - Add item to cart
- `PATCH /api/cart/update/` - Update item quantity
- `DELETE /api/cart/remove/` - Remove item from cart
- `POST /api/cart/clear/` - Clear cart

### Orders & Payments:
- `POST /api/orders/create/` - Create checkout order
- `GET /api/orders/` - Retrieve order history
- `GET /api/orders/<id>/` - Get detailed tax invoice
- `POST /api/payments/create/` - Initialize UPI QR and Razorpay intent
- `POST /api/payments/verify/` - Cryptographically verify payment & atomically deduct stock

### Administration:
- `GET /api/analytics/` - Store KPIs, revenue velocity, best sellers
- `GET /api/inventory/` - Inventory monitoring & restock suggestions
- `GET /api/customers/` - Shopper directory & spend metrics
- `GET /api/transactions/` - Complete payment ledger
- `GET /api/health/` - Operational health check

---

## 6. Getting Started

### 1. Start Backend (Port 5676)
```powershell
.\venv\Scripts\python backend/manage.py runserver 127.0.0.1:5676
```

### 2. Start Frontend (Port 3454)
```powershell
cd frontend
npm run dev
```

Visit **[http://localhost:3454](http://localhost:3454)** in your web browser.

### 3. Demo Credentials
- **Customer Demo:** `customer@quickcheckout.in` / `password123` (or click "1-Click Customer Demo" on the login screen / navbar)
- **Admin Demo:** `admin@quickcheckout.in` / `adminpassword123` (or click "1-Click Admin Demo")
