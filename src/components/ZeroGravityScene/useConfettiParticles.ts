import { useEffect, useRef } from 'react';
import Matter from 'matter-js';
import type { PhysicsEngineRefs } from './usePhysicsEngine';

const PARTICLE_COUNT = 450;
const COLORS = ['#ad2bee', '#d946ef', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#6366f1'];

interface ConfettiParticlesHook {
  particlesRef: React.MutableRefObject<Matter.Body[]>;
  wallsRef: React.MutableRefObject<Matter.Body[]>;
}

export const useConfettiParticles = (
  { engineRef, renderRef }: PhysicsEngineRefs
): ConfettiParticlesHook => {
  const particlesRef = useRef<Matter.Body[]>([]);
  const wallsRef = useRef<Matter.Body[]>([]);
  const mouseRef = useRef<Matter.Mouse | null>(null);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);

  useEffect(() => {
    if (!engineRef.current || !renderRef.current) return;

    const { Bodies, Composite, Common, Body, Mouse, MouseConstraint, Events } = Matter;
    const engine = engineRef.current;
    const render = renderRef.current;
    const world = engine.world;
    const renderWidth = render.options.width ?? window.innerWidth;
    const renderHeight = render.options.height ?? window.innerHeight;

    // Create confetti particle
    const createConfetti = (x: number, y: number): Matter.Body => {
      const color = Common.choose(COLORS);
      const size = Common.random(4, 12);
      const type = Common.choose(['circle', 'rectangle', 'polygon']);

      const options = {
        render: {
          fillStyle: color,
          strokeStyle: 'rgba(255,255,255,0.05)',
          lineWidth: 0,
        },
        restitution: 0.9,
        friction: 0.001,
        frictionAir: 0.02,
        density: 0.01,
      };

      let body: Matter.Body;

      if (type === 'circle') {
        body = Bodies.circle(x, y, size / 2, options);
      } else if (type === 'rectangle') {
        body = Bodies.rectangle(x, y, size, size * Common.random(0.5, 2), options);
      } else {
        body = Bodies.polygon(x, y, Common.random(3, 5), size / 1.5, options);
      }

      Body.rotate(body, Common.random(0, 360));
      Body.setVelocity(body, {
        x: Common.random(-1, 1),
        y: Common.random(-1, 1),
      });
      Body.setAngularVelocity(body, Common.random(-0.05, 0.05));

      return body;
    };

    // Generate particles
    const particles: Matter.Body[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(
        createConfetti(
          Common.random(0, renderWidth),
          Common.random(0, renderHeight)
        )
      );
    }
    particlesRef.current = particles;

    // Create invisible boundary walls
    const wallThickness = 200;
    const buildWalls = (w: number, h: number): Matter.Body[] => [
      Bodies.rectangle(
        w / 2, -wallThickness / 2,
        w * 2, wallThickness,
        { isStatic: true, render: { visible: false } }
      ),
      Bodies.rectangle(
        w / 2, h + wallThickness / 2,
        w * 2, wallThickness,
        { isStatic: true, render: { visible: false } }
      ),
      Bodies.rectangle(
        -wallThickness / 2, h / 2,
        wallThickness, h * 2,
        { isStatic: true, render: { visible: false } }
      ),
      Bodies.rectangle(
        w + wallThickness / 2, h / 2,
        wallThickness, h * 2,
        { isStatic: true, render: { visible: false } }
      ),
    ];
    const walls = buildWalls(renderWidth, renderHeight);
    wallsRef.current = walls;

    Composite.add(world, [...particles, ...walls]);

    // Add mouse control
    const buildMouseConstraint = (canvas: HTMLCanvasElement): Matter.MouseConstraint => {
      const m = Mouse.create(canvas);
      mouseRef.current = m;
      const mc = MouseConstraint.create(engine, {
        mouse: m,
        constraint: { stiffness: 0.1, render: { visible: false } },
      });
      mouseConstraintRef.current = mc;
      render.mouse = m;
      return mc;
    };

    Composite.add(world, buildMouseConstraint(render.canvas));

    // Mouse repulsion force field
    const beforeUpdateHandler = () => {
      const mousePosition = mouseRef.current?.position;
      const repulsionRange = 200;
      const forceMagnitude = 0.00015;
      const currentW = renderRef.current?.options.width ?? window.innerWidth;
      const currentH = renderRef.current?.options.height ?? window.innerHeight;

      if (
        mousePosition &&
        mousePosition.x > 0 &&
        mousePosition.x < currentW &&
        mousePosition.y > 0 &&
        mousePosition.y < currentH
      ) {
        particles.forEach((body) => {
          const dx = body.position.x - mousePosition.x;
          const dy = body.position.y - mousePosition.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < repulsionRange && dist > 0) {
            const normalX = dx / dist;
            const normalY = dy / dist;

            const force = {
              x: normalX * forceMagnitude * (repulsionRange - dist),
              y: normalY * forceMagnitude * (repulsionRange - dist),
            };

            Body.applyForce(body, body.position, force);

          // Ambient drift (5% chance)
          if (Math.random() < 0.05) {
            Body.applyForce(body, body.position, {
              x: Common.random(-0.00001, 0.00001),
              y: Common.random(-0.00001, 0.00001),
            });
          }
          }
        });
      }
    };

    Events.on(engine, 'beforeUpdate', beforeUpdateHandler);

    // Handle resize
    const handleResize = () => {
      if (!renderRef.current) return;

      const container = renderRef.current.element?.parentElement;
      if (!container) return;

      const w = container.clientWidth;
      const h = container.clientHeight;

      renderRef.current.canvas.width = w;
      renderRef.current.canvas.height = h;
      renderRef.current.options.width = w;
      renderRef.current.options.height = h;

      // Recreate walls with correct dimensions for the new size
      Composite.remove(world, wallsRef.current);
      const newWalls = buildWalls(w, h);
      wallsRef.current = newWalls;
      Composite.add(world, newWalls);

      // Rebuild Mouse + MouseConstraint so coordinates map to the new canvas size
      if (mouseConstraintRef.current) {
        Composite.remove(world, mouseConstraintRef.current);
      }
      Composite.add(world, buildMouseConstraint(renderRef.current.canvas));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      Events.off(engine, 'beforeUpdate', beforeUpdateHandler);
      window.removeEventListener('resize', handleResize);
    };
  }, [engineRef, renderRef]);

  return { particlesRef, wallsRef };
};
