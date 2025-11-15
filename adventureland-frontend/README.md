# AdventureLand Village - Frontend

React frontend application for the AdventureLand Village Amusement Park management system.

## Features

- 🎢 **Customer Features**
  - User registration and login
  - Browse available activities
  - Book tickets for activities
  - View and manage tickets
  - Cancel tickets

- 👨‍💼 **Admin Features**
  - Admin registration and login
  - Manage activities (create, view)
  - View customer statistics
  - Dashboard with park overview

- 🔒 **Security**
  - JWT-based authentication
  - Protected routes
  - Role-based access control

## Tech Stack

- **React 18** - UI library
- **React Router** - Navigation
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **React Toastify** - Notifications

## Prerequisites

- Node.js 16+ and npm/yarn
- Backend API running on `http://localhost:8080`

## Installation

1. Navigate to the frontend directory:
```bash
cd adventureland-frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

### Development Mode

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
adventureland-frontend/
├── src/
│   ├── components/      # Reusable components
│   │   └── Navbar.jsx
│   ├── context/          # React Context
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── CustomerDashboard.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Activities.jsx
│   │   └── Tickets.jsx
│   ├── services/         # API services
│   │   └── api.js
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## API Configuration

The frontend is configured to connect to the backend API at `http://localhost:8080`. 

To change the API URL, update the `API_BASE_URL` in `src/services/api.js`.

## Usage

1. **Start the backend** (Spring Boot application on port 8080)
2. **Start the frontend** (`npm run dev`)
3. **Register** a new user (Customer or Admin)
4. **Login** with your credentials
5. **Explore** the features based on your role

## Features Overview

### Customer Flow
1. Register → Login → View Activities → Book Tickets → Manage Tickets

### Admin Flow
1. Register → Login → View Dashboard → Manage Activities → View Statistics

## Development Notes

- The app uses JWT tokens stored in localStorage
- Protected routes automatically redirect to login if not authenticated
- Role-based routing ensures users only see appropriate pages
- Toast notifications provide user feedback for all actions

## Troubleshooting

- **CORS Issues**: Ensure backend CORS is configured correctly
- **API Connection**: Verify backend is running on port 8080
- **Authentication**: Clear localStorage if experiencing auth issues

## License

Part of the AdventureLand Village project.

