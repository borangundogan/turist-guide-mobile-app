# Travel Route Planner

A cross-platform mobile application that helps tourists plan and navigate their travel routes using public transportation in unfamiliar cities.

## 📱 Screenshots

<div align="center">
  <img src="screenshots/Screenshot 2025-01-18 at 18.51.45.png" alt="App Screenshot 1" width="250" />
  <img src="screenshots/Screenshot 2025-01-18 at 18.51.56.png" alt="App Screenshot 2" width="250" />
  <img src="screenshots/Screenshot 2025-01-18 at 18.52.05.png" alt="App Screenshot 3" width="250" />
  <img src="screenshots/Screenshot 2025-01-18 at 18.52.41.png" alt="App Screenshot 4" width="250" />
</div>

## 🌟 Features

### Core Features
- **Authentication**
  - Email/Password and Social login
  - Profile management
  - Secure authentication flow

- **Location Management**
  - Save and organize locations
  - Interactive map integration
  - Custom categories and tags
  - Location sharing

- **Route Planning**
  - Public transportation routing
  - Real-time transit updates
  - Turn-by-turn navigation
  - Alternative route suggestions

- **Trip Organization**
  - Create and manage multiple trips
  - Collaborative trip planning
  - Schedule optimization
  - Trip sharing and templates

### Premium Features
- Offline access
- Advanced route optimization
- Trip statistics and insights
- Ad-free experience
- Priority customer support

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- React Native development environment
- MongoDB
- Firebase account
- Google Maps API key
- Stripe account (for premium features)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/travel-route-planner.git
cd travel-route-planner
```

2. Install dependencies
```bash
# Frontend
cd travel-planner-mobile
npm install

# Backend
cd ../travel-planner-backend
npm install
```

3. Environment Setup
Create `.env` files in both frontend and backend directories:

```bash
# Frontend (.env)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
FIREBASE_CONFIG=your_firebase_config
API_URL=your_backend_url

# Backend (.env)
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FIREBASE_ADMIN_CONFIG=your_firebase_admin_config
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Run the application
```bash
# Frontend
npm run android  # For Android
npm run ios      # For iOS

# Backend
npm run dev
```

## 📱 Application Structure

### Frontend (React Native)
```plaintext
travel-planner-mobile/
├── src/
│   ├── components/    # Reusable UI components
│   ├── screens/       # Application screens
│   ├── navigation/    # Navigation configuration
│   ├── store/         # Redux store and slices
│   ├── services/      # API and external services
│   ├── hooks/         # Custom React hooks
│   ├── utils/         # Helper functions
│   ├── theme/         # Styling and themes
│   └── constants/     # App constants
```

### Backend (Node.js + Express)
```plaintext
travel-planner-backend/
├── src/
│   ├── controllers/   # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── services/      # Business logic
│   ├── middleware/    # Custom middleware
│   └── utils/         # Helper functions
```

## 🛠 Development

### Technology Stack
- **Frontend**
  - React Native
  - TypeScript
  - Redux Toolkit
  - React Navigation
  - Google Maps SDK

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - Firebase Admin
  - Stripe

### Code Style
- Follow the established ESLint and Prettier configurations
- Use TypeScript for type safety
- Follow component-based architecture
- Implement proper error handling
- Write comprehensive tests

### Testing
```bash
# Run frontend tests
cd travel-planner-mobile
npm test

# Run backend tests
cd travel-planner-backend
npm test
```

## 🔒 Security

- Implement proper authentication and authorization
- Secure API endpoints
- Handle sensitive data securely
- Regular security audits
- Input validation and sanitization

## 📦 Deployment

### Mobile App
1. Configure app signing
2. Update version numbers
3. Build release versions
4. Submit to app stores

### Backend
1. Set up production environment
2. Configure SSL/TLS
3. Set up monitoring
4. Deploy to cloud provider

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support, email support@travelrouteplanner.com or join our Slack channel.

## 🔄 Version History

- v1.0.0 (Planned)
  - Initial release with core features
  - Basic authentication and location management
  - Route planning and trip organization

- Future Releases
  - Offline support
  - Advanced analytics
  - Social features
  - Multi-language support

## 🙏 Acknowledgments

- Google Maps Platform
- Firebase
- OpenStreetMap
- Public Transportation APIs
- Open source community 