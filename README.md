# Airline Reservation & Ticket Booking System

A modern **Airline Reservation & Ticket Booking System** built with **Next.js**, designed to provide a seamless flight booking experience for users while offering powerful administrative features for administrators and super administrators.

##  Features

* Secure authentication and authorization
* Role-based access (User, Admin, Super Admin)
* Flight search and booking
* Booking history and reservation management
* User profile management
* Admin dashboard for flight and booking management
* Super Admin dashboard for complete system administration
* Responsive and modern UI
* RESTful API integration

##  Tech Stack

* **Frontend:** Next.js, React.js, TypeScript
* **Backend:** Node.js, Express.js
* **Database:** MongoDB
* **Authentication:** JWT
* **Styling:** Tailwind CSS / CSS Modules
* **Version Control:** Git & GitHub

---

##  Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js (v18 or later)
* npm / yarn / pnpm

### Installation

Clone the repository:

```bash
git clone https://github.com/Indrani1704/AirVoyage_FINAL_PROJECT_FRONTEND.git
git clone https://github.com/Indrani1704/AirVoyage_FINAL_PROJECT_BACKEND.git
```


Install dependencies:

```bash
npm install
```

Configure environment variables by creating a `.env.local` file.

Example:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_connection_string
```

Start the development server:

```bash
npm run dev
```

Open your browser and visit:

```
http://localhost:3000
```

---

##  Demo Credentials

### Super Admin

| Field    | Value                    |
| -------- | ------------------------ |
| Email    | `superadmin@gmail.com` |
| Password | `123456`         |

### Admin

| Field    | Value               |
| -------- | ------------------- |
| Email    | `admin@gmail.com` |
| Password | `123456`         |

### User

| Field    | Value              |
| -------- | ------------------ |
| Email    | `user@gmail.com` |
| Password | `123456`         |



---

##  Project Structure

```text
app/
components/
hooks/
lib/
public/
styles/
types/
utils/
```

---

##  Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

##  Deployment

This project can be deployed on platforms such as:

* Vercel
* Netlify
* AWS
* DigitalOcean

For Vercel deployment:

```bash
npm run build
```

or simply connect your GitHub repository to **Vercel** for automatic deployments.

---

##  License

This project is intended for educational and demonstration purposes. Modify and use it according to your project's licensing requirements.
