# EatBotFront Development Guide

This is a Vite React TypeScript project for controlling a bot through a modern web interface.

## Project Structure

- **src/components/BotController** - Main bot control component with WebSocket and API integration
- **src/types/api.ts** - TypeScript type definitions
- **CSS Modules** - All components use CSS modules (*.module.css files)

## Key Technologies

- Vite for fast build and dev server
- React 18+ with TypeScript
- CSS Modules for scoped styling
- WebSocket for real-time state updates
- Fetch API for REST calls

## Running the Project

Development:
```bash
npm run dev
```

Build:
```bash
npm run build
```

## Important Notes

1. The app connects to `ws://localhost:3000` for WebSocket updates
2. REST API endpoints at `http://localhost:3000/api/bot/*`
3. All styles use CSS Modules - import like: `import s from "./Component.module.css"`
4. Dark theme with modern minimalist design
5. Responsive design for mobile devices

## Component Guidelines

When adding new components:
1. Create component file in `src/components/`
2. Create corresponding `.module.css` file
3. Use TypeScript interfaces for props
4. Follow the existing BotController pattern
