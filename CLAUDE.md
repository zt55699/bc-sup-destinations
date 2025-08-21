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

**Single Component Design**: All functionality resides in `src/App.jsx` (560+ lines) containing:
- 33 paddleboarding destinations with coordinates, descriptions, difficulty levels, and image URLs
- Interactive Leaflet map with custom glass-morphism markers
- Auto-scrolling destination list with visibility toggles
- Detail card popup system

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
  imageUrls: string[]       // Array of 3 image URLs (some still use imageUrl)
}
```

### Visual Difficulty System

- **Beginner (初级)**: Green circle
- **Intermediate (中级)**: Blue square  
- **Advanced (高级)**: Black diamond on white background
- **Expert (专家级)**: Double black diamonds on white backgrounds

Map markers have subtle color coding based on difficulty using low-saturation backgrounds.

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