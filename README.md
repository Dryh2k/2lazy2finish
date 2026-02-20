# Zero-Gravity Physics Demo

A beautiful React 18 + TypeScript + Vite application featuring 450 interactive particles with zero-gravity physics simulation powered by Matter.js.

## Features

- 🎨 450 colorful particles with realistic physics
- 🖱️ Mouse repulsion force field
- 🌍 Toggle gravity on/off
- 🔄 Reshuffle and reset controls
- 📊 Live FPS counter
- 🎭 Glass-morphism UI design
- 🌙 Dark mode support
- 📱 Fully responsive

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety (strict mode)
- **Vite** - Build tool
- **Tailwind CSS v3** - Styling with custom theme
- **Matter.js** - 2D physics engine
- **Google Fonts** - Spline Sans + Material Symbols

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   └── ZeroGravityScene/
│       ├── ZeroGravityScene.tsx      # Main canvas component
│       ├── usePhysicsEngine.ts       # Physics engine setup hook
│       └── useConfettiParticles.ts   # Particle management hook
├── pages/
│   └── HomePage.tsx                  # Main page with UI layer
├── App.tsx                           # Root component
├── main.tsx                          # Entry point
└── index.css                         # Global styles
```

## Physics Configuration

- **Gravity**: Zero gravity (x: 0, y: 0) by default
- **Particles**: 450 particles with random shapes (circle, rectangle, polygon)
- **Colors**: 8 vibrant colors matching the primary theme
- **Size**: 4-12px random sizes
- **Restitution**: 0.9 (bouncy)
- **Friction**: 0.001 (very low)
- **Air Friction**: 0.02
- **Mouse Repulsion**: 200px range, 0.00015 force magnitude
- **Ambient Drift**: 5% chance per frame

## Interactions

- **Mouse Movement**: Particles are repelled within 200px radius
- **Mouse Drag**: Click and drag particles
- **Reshuffle Button**: Randomize positions and velocities
- **Reset Button**: Randomize positions with zero velocity
- **Gravity Toggle**: Switch between zero-gravity and normal gravity

## Customization

### Colors

Edit `tailwind.config.js`:

```js
colors: {
  primary: "#ad2bee",
  "bg-light": "#f7f6f8",
  "bg-dark": "#0a050d",
}
```

### Particle Count

Edit `src/components/ZeroGravityScene/useConfettiParticles.ts`:

```ts
const PARTICLE_COUNT = 450; // Change this value
```

### Physics Parameters

Modify values in `useConfettiParticles.ts`:

```ts
restitution: 0.9,
friction: 0.001,
frictionAir: 0.02,
```

## License

MIT
