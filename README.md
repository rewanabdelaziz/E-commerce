# 🛒 EliteCommerce - Modern Angular E-Commerce Platform

**EliteCommerce** is a high-performance, full-featured e-commerce application built with **Angular 21**. The project has been refactored for maximum efficiency, transitioning from a simulation environment to a real-world API integration with a sleek, responsive UI.

---

## 🌟 Key Features

### 👤 User Experience
- **Dynamic Product Browsing:** Seamlessly view and explore a wide range of products.
- **Advanced Filtering:** Filter products by category for a tailored shopping experience.
- **Cart Management:** Full control over your cart (add, remove, and adjust quantities).
- **Order Tracking:** Integrated system to place and track your personal orders.

### 🛠️ Admin Power-Tools
- **Comprehensive CRUD:** Full management for products and categories (Add, Update, Delete).
- **Order Management:** Monitor and update customer order statuses in real-time.
- **Optimized UI:** A specialized dashboard featuring "Glassmorphism" design and responsive tables.
- **State Sync:** Automatic UI updates following any administrative action using Angular Signals.

### 🔐 Security & Core Logic
- **Robust Auth System:** Secure Sign-up and Login functionality.
- **Route Guards:** Role-based access control to ensure only admins can access the dashboard.
- **Data Protection:** Encryption of sensitive session data using Crypto-JS.

---

## 🧪 Tech Stack & Optimizations

- **Framework:** Angular 21 (Signals, Standalone Components, Zoneless support).
- **API Integration:** Refactored to use **Platzi Fake Store API** for dynamic data.
- **Styling:** Bootstrap 5 with custom CSS3 Glassmorphism and animations.
- **Build Performance:** Optimized initial bundle size to ~1.12 MB.
- **Libraries:** SweetAlert2 for interactive feedback and Crypto-JS for security.

---

## 🚀 Getting Started

### Development server
1. Clone the repo: `git clone https://github.com/rewanabdelaziz/E-commerce.git`
2. Install dependencies: `npm install`
3. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`.

### Build
Run `ng build --base-href "https://rewanabdelaziz.github.io/E-commerce/"` to build the project for production. The artifacts will be stored in the `dist/` directory.

---

## 📂 Scaffolding & Testing
- **Generate:** `ng generate component component-name`
- **Unit Tests:** `ng test` (via Karma)

---

## 👤 Author
**Rewan Abdelaziz** *Frontend Angular Developer* [LinkedIn](https://www.linkedin.com/in/rewan-abdelaziz) | [GitHub](https://github.com/rewanabdelaziz)