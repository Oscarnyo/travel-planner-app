# Travel Planner Mobile Application

A comprehensive travel planning mobile application built with React Native and Expo. This application helps users plan their trips, manage expenses, convert currencies, translate languages, and explore destinations with integrated maps and place details.

## Features

- 🗺️ Interactive Maps with Place Search
- 💰 Expense Tracking with Categories
- 🔄 Currency Converter
- 🌐 Language Translator
- 📝 Trip Notes Management
- 🏨 Hotel Recommendations
- 🤖 AI Travel Assistant
- ⭐ Favorite Places
- 📍 Place Details with Reviews
- 📱 Cross-platform 

## Prerequisites

Before running this project, make sure you have the following installed:

- Node.js (v14 or higher)
- npm or yarn
- Android Emulator / Physical Phone
- Expo
- Firebase Account
- Google Cloud Platform Account with following APIs enabled:
  - Maps JavaScript API
  - Places API
  - Cloud Translation API
  - Gemini API


## Environment Setup

1. Create a `.env` file in the root directory with the following variables:
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key
GOOGLE_GERMINI_API_KEY=your_gemini_api_key
FIREBASE_API_KEY=your_firebase_api_key


## Installation

1. Clone the repository:
git clone [repository-url]

2. Install dependencies:
npm install

3. Configure Firebase:
Update the Firebase configuration in `firebaseConfig.js` with your credentials:

4. Start the development server:
npx expo start -c

5. Run on Android Emulator:
Keyboard press "A" in terminal

6. Run on Physical Phone:
Scan the QR code on the terminal


## Project Structure

- `/app` - Main application screens and navigation
- `/components` - Reusable UI components
- `/constants` - Application constants and assets
- `/services` - API services and utilities
- `/context` - React Context providers


## Acknowledgments

- Google Cloud Platform for APIs
- Firebase for Backend Services
- Expo for Development Framework
- React Native Community

