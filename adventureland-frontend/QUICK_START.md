# Quick Start Guide

## Step 1: Install Dependencies

```bash
cd adventureland-frontend
npm install
```

## Step 2: Start Backend

Make sure your Spring Boot backend is running on `http://localhost:8080`

```bash
cd Adventureland-Village
.\mvnw spring-boot:run
```

## Step 3: Start Frontend

In a new terminal:

```bash
cd adventureland-frontend
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Step 4: Test the Application

1. Open `http://localhost:3000` in your browser
2. Click "Register" to create a new account
3. Choose Customer or Admin role
4. Fill in the registration form
5. Login with your credentials
6. Explore the features!

## Default Routes

- `/` - Home page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - User dashboard (Customer or Admin)
- `/activities` - View/Manage activities
- `/tickets` - View/Book tickets (Customer only)

## Troubleshooting

### Port Already in Use
If port 3000 is in use, Vite will automatically use the next available port.

### CORS Errors
Make sure your backend CORS configuration allows requests from `http://localhost:3000`

### API Connection Issues
Verify:
- Backend is running on port 8080
- Database is connected
- Check browser console for errors

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

