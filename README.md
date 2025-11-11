# Property Estimator App

A React-based application for estimating property scores based on various metrics like schools, public transport, groceries, and house quality.

## Features

- Interactive tile-based selection for property metrics
- Real-time score calculation using a hybrid multiplicative uplift formula
- Gate fail detection for deal-breaking conditions
- Responsive design with score panel

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Clone the repository
2. Navigate to the project directory: `cd property-estimator-app`
3. Install dependencies: `npm install`

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Scoring Logic

The app uses a hybrid scoring model with:
- Base score: 50
- Weighted multipliers for each metric
- Gate fail conditions for critical issues

See the documentation in `../docs/` for detailed specifications.

## Technologies Used

- React 19
- TypeScript
- Vite
- ESLint
