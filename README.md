# Teckels de Suisse

A beautiful React application for browsing and filtering Teckels (dachshunds) registered in Switzerland.

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. (Optional) Configure Base44 API:
   - Create a `.env` file in the root directory
   - Add your Base44 API credentials:
   ```
   VITE_BASE44_API_URL=https://your-api-url.com
   VITE_BASE44_API_KEY=your-api-key
   ```
   - If you don't have API credentials, the app will use mock data for development

### Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## Features

- 🐕 Browse Teckels by canton, year, coat type, and gender
- 🔍 Search Teckels by name
- 📊 View statistics about registered Teckels
- 🎨 Beautiful, modern UI with animations
- 📱 Responsive design

## Project Structure

```
src/
  ├── api/              # API client (Base44)
  ├── components/       # React components
  │   ├── teckels/     # Teckel-specific components
  │   └── ui/          # Reusable UI components
  ├── lib/             # Utility functions
  ├── pages/           # Page components
  ├── App.jsx          # Main app component
  └── main.jsx         # Entry point
```

## Technologies Used

- React 18
- Vite
- Tailwind CSS
- Framer Motion
- React Query
- Lucide React Icons
- date-fns





