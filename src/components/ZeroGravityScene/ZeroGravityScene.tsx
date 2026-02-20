import { useRef } from 'react';
import { usePhysicsEngine } from './usePhysicsEngine';
import { useConfettiParticles } from './useConfettiParticles';

interface ZeroGravitySceneProps {
  onParticlesReady?: (particles: Matter.Body[]) => void;
  onEngineReady?: (engine: Matter.Engine) => void;
}

const ZeroGravityScene: React.FC<ZeroGravitySceneProps> = ({ onParticlesReady, onEngineReady }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const physicsRefs = usePhysicsEngine(containerRef);
  const { particlesRef } = useConfettiParticles(physicsRefs);

  // Notify parent when ready
  if (onParticlesReady && particlesRef.current.length > 0) {
    onParticlesReady(particlesRef.current);
  }
  if (onEngineReady && physicsRefs.engineRef.current) {
    onEngineReady(physicsRefs.engineRef.current);
  }

  return (
    <div
      ref={containerRef}
      className="absolute top-0 left-0 w-full h-full z-0"
      style={{ pointerEvents: 'all' }}
    />
  );
};

export default ZeroGravityScene;
