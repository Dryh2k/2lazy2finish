import { useEffect, useRef } from 'react';
import Matter from 'matter-js';

export interface PhysicsEngineRefs {
  engineRef: React.MutableRefObject<Matter.Engine | null>;
  renderRef: React.MutableRefObject<Matter.Render | null>;
  runnerRef: React.MutableRefObject<Matter.Runner | null>;
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

export const usePhysicsEngine = (containerRef: React.RefObject<HTMLDivElement>): PhysicsEngineRefs => {
  const engineRef = useRef<Matter.Engine | null>(null);
  const renderRef = useRef<Matter.Render | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const { Engine, Render, Runner } = Matter;

    // Create engine
    const engine = Engine.create();
    engine.gravity.x = 0;
    engine.gravity.y = 0;
    engineRef.current = engine;

    // Create renderer
    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      options: {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
        background: 'transparent',
        wireframes: false,
        showAngleIndicator: false,
        pixelRatio: window.devicePixelRatio,
      },
    });
    renderRef.current = render;
    canvasRef.current = render.canvas;

    // Start rendering
    Render.run(render);

    // Create and start runner
    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);

    // Cleanup
    return () => {
      if (renderRef.current) {
        Render.stop(renderRef.current);
        if (renderRef.current.canvas) {
          renderRef.current.canvas.remove();
        }
      }
      if (runnerRef.current && engineRef.current) {
        Runner.stop(runnerRef.current);
      }
      if (engineRef.current) {
        Engine.clear(engineRef.current);
        Matter.Composite.clear(engineRef.current.world, false);
      }
    };
  }, [containerRef]);

  return { engineRef, renderRef, runnerRef, canvasRef };
};
