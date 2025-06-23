# Certification Request Management System

A React-based web application for managing employee certification requests. This application allows employees to submit certification requests and supervisors to review, approve, or reject them.

## 🚀 Technology Stack

### Frontend

-   **React 19.1.0** - Modern React with hooks and functional components
-   **TypeScript 4.9.5** - Type-safe JavaScript development
-   **Material-UI (MUI) 7.1.2** - React component library for consistent UI design
-   **React Router DOM 6.30.1** - Client-side routing
-   **React Hook Form 7.58.1** - Form state management and validation
-   **Day.js 1.11.13** - Lightweight date manipulation library

### Testing

-   **Jest** - JavaScript testing framework
-   **React Testing Library 16.3.0** - React component testing utilities
-   **@testing-library/user-event 14.6.1** - User interaction simulation

### Development Tools

-   **Create React App 5.0.1** - React application boilerplate
-   **ESLint** - Code linting and formatting
-   **npm-run-all 4.1.5** - Run multiple npm scripts concurrently

### Backend (Mock Server)

-   **Express.js** - Node.js web framework
-   **CORS** - Cross-origin resource sharing middleware

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

-   **Node.js** (version 16 or higher)
-   **npm** (comes with Node.js)

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mstacy/bc-exercise.git
cd bc-exercise
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Mock Backend Server

The application requires a mock Express server to run. Start it in a separate terminal:

```bash
# Navigate to the mock server directory
cd mock-express-server

# Install server dependencies
npm install

# Start the mock server
npm start
```

The mock server will run on `http://localhost:3001`

**Alternative**: You can use `npm run dev` from the project root to start both the React application and the mock server simultaneously (see step 5 for details).

### 4. Start the Frontend Application

In a new terminal window, start the React application:

```bash
# From the project root
npm start
```

The application will open in your browser at `http://localhost:3000`

### 5. Alternative: Run Both Servers Concurrently

You can run both the frontend and backend servers simultaneously using:

```bash
npm run dev
```

This will start both the React app and the mock server concurrently.

## 🧪 Testing Instructions

### Running Tests

#### Run All Tests

```bash
npm test
```

This starts the test runner in watch mode, which will rerun tests when files change.

#### Run All Tests Once

```bash
npm run test:all
```

This runs all tests once and exits.

#### Run Tests in Watch Mode

```bash
npm test -- --watch
```

This runs tests in watch mode, automatically rerunning when files change.

### Test Structure

The application includes comprehensive tests for:

-   **Component Rendering**: Tests for all React components
-   **User Interactions**: Form submissions, button clicks, navigation
-   **API Integration**: Mock fetch calls and error handling
-   **Filtering and Sorting**: Request filtering and table sorting functionality
-   **Authentication**: Login/logout flows and protected routes
-   **Accessibility**: Proper ARIA labels and keyboard navigation

### Test Files Location

-   `src/**/*.test.tsx` - Component and integration tests
-   `src/**/*.test.ts` - Utility and helper function tests

## 📁 Project Structure

```
fe-module-exercise/
├── public/                 # Static assets
├── src/
│   ├── auth/              # Authentication components and context
│   ├── components/        # Reusable UI components
│   ├── pages/            # Page components
│   │   ├── employee/     # Employee page
│   │   ├── home/         # Home page - redirects to login
│   │   ├── login/        # Login page
│   │   └── supervisor/   # Supervisor page
│   ├── App.tsx           # Main application component
│   └── index.tsx         # Application entry point
├── mock-express-server/  # Mock backend server
├── package.json          # Dependencies and scripts
└── README.md            # This file
```

## 🔧 Available Scripts

-   `npm start` - Start the React development server
-   `npm run dev` - Start both frontend and backend servers concurrently
-   `npm run mock-express-server` - Start only the mock backend server
-   `npm test` - Run tests in watch mode
-   `npm run test:all` - Run all tests once
-   `npm run build` - Build the application for production
-   `npm run eject` - Eject from Create React App (one-way operation)

## 🌟 Features

### Employee Features

-   Submit certification requests
-   View request status and history
-   Update request details

### Supervisor Features

-   View all certification requests
-   Filter requests by employee, status, and budget range
-   Sort requests by various criteria
-   Approve or reject requests
-   Group requests by status for better organization

### General Features

-   Responsive design for mobile and desktop
-   Real-time form validation
-   Error handling and user feedback
-   Accessibility compliance

## 🔐 Authentication

The application includes a mock authentication system with predefined users:

-   **Employee**: `alice` / `password123`, `bob` / `password123`
-   **Supervisor**: `carol` / `adminpass`

## 🚀 Deployment

To build the application for production:

```bash
npm run build
```

This creates a `build` folder with optimized production files ready for deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📝 License

This project is for educational purposes and demonstration of React development skills.
