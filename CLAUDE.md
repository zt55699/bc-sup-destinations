# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm install          # Install dependencies
npm run dev          # Start development server (http://localhost:5173)
npm run build        # Build for production (outputs to ./dist)
npm run preview      # Preview production build locally
```

## Architecture

This is a single-page React application showcasing paddleboarding destinations in British Columbia, Canada.

### Core Structure

**Application Entry**: The app uses Vite with React 19. Entry point is `src/main.jsx` which mounts `src/App.jsx` to the DOM.

**Component Architecture**: Modularized React components with hooks:
- 33 paddleboarding destinations with coordinates, descriptions, difficulty levels, and image URLs
- Interactive Leaflet map with custom glass-morphism markers and animated route visualization
- Auto-scrolling destination list with visibility toggles and route filtering
- Detail card popup system with route animation and distance calculations

### Key Data Model

Each destination object contains:
```javascript
{
  id: number,
  name: string,
  coords: [lat, lon],
  tags: string[],           // e.g., ['海水', '热门', '大温']
  difficulty: string,       // 'beginner'|'intermediate'|'advanced'|'expert'
  difficultyColor: string,  // Hex color for difficulty
  description: string,      // Chinese description
  difficultyInfo: string,   // Difficulty details with symbol (●/■/◆/◆◆)
  imageUrls: string[],      // Array of 3 image URLs (some still use imageUrl)
  route?: {                 // Optional route information
    destination: string,    // Route endpoint name
    coords: [lat, lon],     // Route endpoint coordinates
    description: string,    // Route description
    stops?: Array<{         // Optional intermediate stops
      name: string,
      coords: [lat, lon]
    }>
  }
}
```

### Visual Difficulty System

- **Beginner (初级)**: Green circle
- **Intermediate (中级)**: Blue square  
- **Advanced (高级)**: Black diamond on white background
- **Expert (专家级)**: Double black diamonds on white backgrounds

Map markers have subtle color coding based on difficulty using low-saturation backgrounds.

### Route System

**Route Visualization**: Interactive animated routes between destinations with:
- Multi-segment routing with waypoints and intermediate stops
- Pause functionality at stops with thumbnail popups
- Separate distance calculations for paddling and hiking segments
- Route filtering to show only destinations with available routes

**Route Features**:
- Indian Arm → Silver Falls → Granite Falls (multi-stop route)
- Harrison Lake → Harrison Lagoon (direct route)
- Widgeon Falls combined paddling/hiking route
- Distance calculations using Haversine formula

### Deployment

GitHub Pages deployment via GitHub Actions:
- Repository: `zt55699/bc-sup-destinations`
- Base path: `/bc-sup-destinations/` (configured in `vite.config.js`)
- Workflow automatically builds and deploys on push to main branch

### Chinese Interface

The entire UI is in Chinese (zh-CN) including:
- Destination names and descriptions
- Difficulty explanations
- UI labels and buttons

### External Dependencies

- **Leaflet**: Loaded via CDN in `index.html` for mapping
- **Tailwind CSS**: Loaded via CDN for styling
- **CartoDB Dark Tiles**: Used as map base layer
- **Google Fonts Inter**: Typography