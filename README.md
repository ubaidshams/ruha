# Ruha E-Commerce Platform 🌸

> "Your digital playground for kawaii gifts, anime merchandise, and trendy accessories!"

![Ruha Platform](https://img.shields.io/badge/Status-Ready%20to%20Deploy-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-16+-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Ready-brightgreen?style=for-the-badge&logo=mongodb)
![3D](https://img.shields.io/badge/3D-Spline-purple?style=for-the-badge)

## 🎯 Project Overview

Ruha is a MERN stack e-commerce platform featuring "Claymorphism" design, 3D interactions, and gamification elements. Built for Gen Z and anime enthusiasts, it transforms online shopping into an interactive "digital playground."

### ✨ Key Features

- **🎨 Kawaii Cloud Design**: Soft, tactile "Claymorphism" UI with bubblegum pink & lavender themes
- **🎮 Gamified Experience**: Blind box unboxing, bag builder, progress bars
- **📱 Responsive Design**: Mobile-first approach with smooth animations
- **🔐 Secure Auth**: JWT-based authentication with protected routes
- **🛒 Advanced Cart**: Real-time updates, gift mode, customization options
- **🎪 3D Integration**: Interactive Spline scenes and models
- **🚀 Performance Optimized**: Code splitting, lazy loading, image optimization

## 🏗️ Tech Stack

### Frontend

- **React 18** with functional components & hooks
- **Vite** for fast development & building
- **Redux Toolkit** for state management
- **Tailwind CSS** with custom Kawaii theme
- **Framer Motion** for smooth animations
- **Spline React** for 3D interactions

### Backend

- **Node.js + Express** for server logic
- **MongoDB + Mongoose** for data persistence
- **JWT** for secure authentication
- **Cloudinary** for image management
- **Joi** for input validation

### Development Tools

- **ESLint** for code quality
- **PostCSS** for CSS processing
- **React Router v6** for navigation

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd ruha-3d
   ```

2. **Install dependencies**

   ```bash
   npm run install-all
   ```

3. **Environment Setup**

   **Server (.env)**

   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

   **Client (.env)**

   ```bash
   cp client/.env.example client/.env
   # Edit client/.env with your configuration
   ```

4. **Database Setup**

   ```bash
   # Start MongoDB (if local)
   mongod

   # Seed the database
   cd server
   npm run seed
   ```

5. **Start Development**

   ```bash
   # From root directory - starts both client & server
   npm run dev

   # Or start separately:
   # Client: cd client && npm run dev
   # Server: cd server && npm run dev
   ```

6. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5001
   - API Health Check: http://localhost:5001/health

## 📁 Project Structure

```
ruha-3d/
├── 📁 client/                 # React Frontend
│   ├── 📁 public/            # Static assets
│   ├── 📁 src/
│   │   ├── 📁 components/    # Reusable components
│   │   │   ├── 📁 auth/      # Authentication components
│   │   │   ├── 📁 layout/    # Layout components
│   │   │   └── 📁 ui/        # UI components
│   │   ├── 📁 pages/         # Page components
│   │   ├── 📁 store/         # Redux store & slices
│   │   ├── 📁 utils/         # Utility functions
│   │   └── 📁 styles/        # Global styles
│   └── package.json
├── 📁 server/                # Express Backend
│   ├── 📁 models/           # Mongoose schemas
│   ├── 📁 routes/           # API routes
│   ├── 📁 middleware/       # Custom middleware
│   ├── 📁 scripts/          # Database scripts
│   └── package.json
└── package.json             # Root package.json
```

## 🎨 Design System

### Color Palette

- **Primary**: Soft Blush (#FFF0F5) → Lavender Mist (#E6E6FA)
- **Accents**: Bubblegum Pink (#FF69B4), Electric Teal (#00CED1), Sunshine Yellow (#FFD700)
- **Text**: Dark Slate (#2F4F4F)

### Typography

- **Headings**: Fredoka One (Rounded, chunky)
- **Body**: Quicksand (Legible, rounded)

### Claymorphism Rules

- Border Radius: Minimum 24px
- Dual-layer shadows for depth
- "Squish" effect on button clicks
- "Float" animation on card hovers

## 🛠️ API Documentation

### Authentication Endpoints

```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
```

### Product Endpoints

```
GET    /api/products              # Get all products
GET    /api/products/:id          # Get single product
POST   /api/products              # Create product (admin)
PUT    /api/products/:id          # Update product (admin)
DELETE /api/products/:id          # Delete product (admin)
GET    /api/products/search?q=... # Search products
```

### Cart Endpoints

```
GET    /api/cart                  # Get user cart
POST   /api/cart/add              # Add item to cart
PUT    /api/cart/update/:id       # Update cart item
DELETE /api/cart/remove/:id       # Remove from cart
DELETE /api/cart/clear            # Clear cart
GET    /api/cart/total            # Get cart total
```

## 🎮 Special Features

### 1. Blind Box Unboxing

- Mystery items with random character selection
- Animated unboxing sequence
- Surprise reveal with sound effects

### 2. Bag Builder

- Drag-and-drop interface
- Real-time preview
- Custom charm combinations
- Bundle pricing

### 3. Gamified Cart

- Progress bar for free shipping
- Achievement unlocks
- Gift mode with wrapping options

## 📱 Responsive Breakpoints

- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

## 🧪 Testing

```bash
# Run client tests
cd client && npm test

# Run server tests
cd server && npm test

# Run all tests
npm test
```

## 🚀 Deployment

### Production Build

```bash
# Build client
cd client && npm run build

# Start production server
cd server && npm start
```

### Environment Variables (Production)

- `NODE_ENV=production`
- `MONGODB_URI=<your-production-db-url>`
- `JWT_SECRET=<your-secure-jwt-secret>`
- `CLOUDINARY_URL=<your-cloudinary-url>`

## 🔧 Development Commands

```bash
# Install all dependencies
npm run install-all

# Start development (both client & server)
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Seed database
cd server && npm run seed

# Lint code
npm run lint
```

## 🎯 Performance Optimizations

- **Code Splitting**: React.lazy for route-based splitting
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching**: Service worker for offline functionality
- **3D Optimization**: Lazy loading for Spline scenes

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   ```bash
   # Check if MongoDB is running
   mongod --version

   # For local MongoDB
   brew services start mongodb/brew/mongodb-community
   ```

2. **Port Already in Use**

   ```bash
   # Kill process on port 5001
   lsof -ti:5001 | xargs kill -9
   ```

3. **Dependencies Issues**

   ```bash
   # Clear npm cache
   npm cache clean --force

   # Remove node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Spline** for amazing 3D web experiences
- **Tailwind CSS** for utility-first styling
- **Framer Motion** for delightful animations
- **React Team** for the amazing framework

---

<div align="center">

**Made with 💖 by the Ruha Team**

[Website](https://ruha.com) • [Documentation](https://docs.ruha.com) • [Support](mailto:support@ruha.com)

</div>
