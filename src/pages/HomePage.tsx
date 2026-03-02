import { useEffect, useRef, useState } from 'react';
import Matter from 'matter-js';
import ZeroGravityScene from '../components/ZeroGravityScene/ZeroGravityScene';

const HomePage: React.FC = () => {
  const [fps, setFps] = useState<number>(60);
  const [gravityOn, setGravityOn] = useState<boolean>(false);
  const particlesRef = useRef<Matter.Body[]>([]);
  const engineRef = useRef<Matter.Engine | null>(null);
  const fpsFramesRef = useRef<number>(0);
  const fpsLastTimeRef = useRef<number>(performance.now());

  // FPS Counter
  useEffect(() => {
    const updateFPS = () => {
      const time = performance.now();
      fpsFramesRef.current++;

      if (time - fpsLastTimeRef.current >= 1000) {
        setFps(fpsFramesRef.current);
        fpsFramesRef.current = 0;
        fpsLastTimeRef.current = time;
      }

      requestAnimationFrame(updateFPS);
    };

    const animationId = requestAnimationFrame(updateFPS);
    return () => cancelAnimationFrame(animationId);
  }, []);

  const handleParticlesReady = (particles: Matter.Body[]) => {
    particlesRef.current = particles;
  };

  const handleEngineReady = (engine: Matter.Engine) => {
    engineRef.current = engine;
  };

  const handleReshuffle = () => {
    const { Body, Common } = Matter;
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    particlesRef.current.forEach((body) => {
      Body.setPosition(body, {
        x: Common.random(0, canvas.clientWidth),
        y: Common.random(0, canvas.clientHeight),
      });
      Body.setVelocity(body, {
        x: Common.random(-2, 2),
        y: Common.random(-2, 2),
      });
    });
  };

  const handleReset = () => {
    const { Body, Common } = Matter;
    const canvas = document.querySelector('canvas');
    if (!canvas) return;

    particlesRef.current.forEach((body) => {
      Body.setPosition(body, {
        x: Common.random(0, canvas.clientWidth),
        y: Common.random(0, canvas.clientHeight),
      });
      Body.setVelocity(body, { x: 0, y: 0 });
    });
  };

  const handleGravityToggle = () => {
    if (!engineRef.current) return;

    const { Body, Common } = Matter;
    const newGravityState = !gravityOn;
    setGravityOn(newGravityState);

    engineRef.current.gravity.y = newGravityState ? 1 : 0;

    if (!newGravityState) {
      // Give particles a kick when turning off gravity
      particlesRef.current.forEach((body) => {
        Body.setVelocity(body, {
          x: Common.random(-2, 2),
          y: Common.random(-2, 2),
        });
      });
    }
  };

  const triggerFlow = async (tag: string) => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/trigger-flow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ TAG: tag }),
      });
    } catch (error) {
      console.error('triggerFlow error:', error);
    }
  };

  return (
    <div className="bg-bg-light dark:bg-bg-dark text-slate-800 dark:text-white h-screen w-screen flex flex-col transition-colors duration-300 overflow-hidden">
      {/* Physics Canvas */}
      <ZeroGravityScene onParticlesReady={handleParticlesReady} onEngineReady={handleEngineReady} />

      {/* UI Layer */}
      <div className="relative z-10 flex flex-col h-full w-full justify-between p-6 md:p-10" style={{ pointerEvents: 'none' }}>
        {/* Header */}
        <header className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2 group cursor-pointer" style={{ pointerEvents: 'auto' }} id="home-logo-2T2" onClick={() => triggerFlow('home-logo-2T2')}>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg shadow-[0_0_15px_rgba(173,43,238,0.5)] group-hover:scale-110 transition-transform">
              2T2
            </div>
            <span className="font-display font-bold text-lg tracking-tight hidden md:block">2lazy2finish</span>
          </div>

          <nav className="glass-panel rounded-full px-6 py-3 hidden md:flex gap-8 shadow-lg" style={{ pointerEvents: 'auto' }}>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#" id="nav-play" onClick={() => triggerFlow('nav-play')}>
            </a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#" id="nav-experiment" onClick={() => triggerFlow('nav-experiment')}>
            </a>
            <a className="text-sm font-medium hover:text-primary transition-colors" href="#" id="nav-about" onClick={() => triggerFlow('nav-about')}>
            </a>
          </nav>

          <button className="md:hidden p-2 rounded-full glass-panel text-white" style={{ pointerEvents: 'auto' }} id="nav-menu-mobile-hamburger" onClick={() => triggerFlow('nav-menu-mobile-hamburger')}>
            <span className="material-symbols-outlined">menu</span>
          </button>

          <div className="hidden md:block" style={{ pointerEvents: 'auto' }}>
            <button className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/30 px-5 py-2 rounded-full text-sm font-semibold transition-all" id="btn-login" onClick={() => triggerFlow('btn-login')}>
              Login
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col items-center justify-center text-center max-w-4xl mx-auto space-y-8 mt-[-5vh]">
          <div className="space-y-4">
            <div className="flex gap-3 justify-center" style={{ pointerEvents: 'auto' }}>
              <button
                onClick={() => { triggerFlow('btn-gravity-toggle'); handleGravityToggle(); }}
                className={`w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-primary/20 text-slate-400 hover:text-white transition-colors group relative ${
                  gravityOn ? 'text-primary bg-primary/20' : ''
                }`}
                title="Toggle Gravity"
                id="btn-gravity-toggle"
              >
                <span className="material-symbols-outlined group-hover:rotate-180 transition-transform duration-500">
                  public
                </span>
                <span className="absolute bottom-full mb-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {gravityOn ? 'Gravity ON' : 'Zero Gravity'}
                </span>
              </button>
              <button
                onClick={() => { triggerFlow('btn-reset'); handleReset(); }}
                className="w-12 h-12 rounded-full glass-panel flex items-center justify-center hover:bg-primary/20 text-slate-400 hover:text-white transition-colors group relative"
                title="Reset Scene"
                id="btn-reset"
              >
                <span className="material-symbols-outlined group-hover:rotate-90 transition-transform">refresh</span>
                <span className="absolute bottom-full mb-2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  Reset Scene
                </span>
              </button>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter leading-tight drop-shadow-2xl">
              There is a reason why <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">We are LAZY</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed glass-panel p-4 rounded-xl border-none">
            As proud members of 2lazy2finish, we always keep our word. The website is under construction, and we're taking all the time it needs to be finished properly. It's going to be awesome..
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4" style={{ pointerEvents: 'auto' }}>
            <button
              onClick={() => { triggerFlow('btn-reshuffle'); handleReshuffle(); }}
              className="bg-primary hover:bg-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-[0_0_30px_rgba(173,43,238,0.4)] hover:shadow-[0_0_50px_rgba(173,43,238,0.6)] hover:-translate-y-1 transition-all flex items-center gap-2 justify-center"
              id="btn-reshuffle"
            >
              <span className="material-symbols-outlined">restart_alt</span>
              Reshuffle
            </button>
            <button className="glass-panel hover:bg-white/10 text-slate-800 dark:text-white px-8 py-4 rounded-full font-semibold text-lg border border-white/10 transition-all" id="btn-learn-more" onClick={() => triggerFlow('btn-learn-more')}>
              Learn More
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="w-full flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div className="glass-panel p-2 rounded-full flex gap-2" style={{ pointerEvents: 'auto' }}>
            <div className="px-4 py-2 text-xs font-mono text-slate-400 border-r border-white/10">
              PARTICLES: <span className="text-primary font-bold">450</span>
            </div>
            <div className="px-4 py-2 text-xs font-mono text-slate-400">
              FPS: <span className="text-green-400 font-bold">{fps}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
