import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Activity, Flame, Medal, Award, Dribbble } from "lucide-react";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const duration = 1200; // Ultra-smooth 1.2 seconds total loading duration

    const updateLoader = () => {
      const now = performance.now();
      const elapsed = now - startTime;
      const ratio = Math.min(1, elapsed / duration);
      
      // Beautiful ease-out cubic curve so the bar rushes initially and slows down elegantly towards 100%
      const easeOutCubic = 1 - Math.pow(1 - ratio, 3);
      const computed = easeOutCubic * 100;
      
      setProgress(computed);

      if (ratio < 1) {
        requestAnimationFrame(updateLoader);
      } else {
        setProgress(100);
        const finalTimeout = setTimeout(() => {
          onComplete();
        }, 120);
        return () => clearTimeout(finalTimeout);
      }
    };

    const animFrame = requestAnimationFrame(updateLoader);

    // Bulletproof master timeout to guarantee complete execution under extreme background tab throttling
    const fallback = setTimeout(() => {
      setProgress(100);
      onComplete();
    }, duration + 150);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(fallback);
    };
  }, [onComplete]);

  const activeSports = [
    { icon: Trophy, label: "Fútbol", color: "text-emerald-500", top: "12%", left: "15%", delay: 0 },
    { icon: Dribbble, label: "Básquet", color: "text-amber-500", top: "25%", left: "80%", delay: 0.2 },
    { icon: Flame, label: "Ecuavoley", color: "text-red-500", top: "70%", left: "18%", delay: 0.4 },
    { icon: Medal, label: "Atletismo", color: "text-blue-500", top: "80%", left: "75%", delay: 0.1 },
    { icon: Activity, label: "Tenis de Mesa", color: "text-yellow-400", top: "45%", left: "8%", delay: 0.3 },
    { icon: Award, label: "Ajedrez", color: "text-purple-400", top: "50%", left: "88%", delay: 0.5 },
  ];

  return (
    <div id="loading-screen" className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center overflow-hidden z-50 select-none">
      {/* Background sports image overlay with dark red & green radial gradients */}
      <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
      
      {/* Animated Red & Green Glow Spheres */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-brand-green/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-red/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Floating Animated Sports Icons - Purely visual layers hidden on mobile using Tailwind CSS */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <AnimatePresence>
          {activeSports.map((sport, index) => {
            const Icon = sport.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.6, y: 15 }}
                animate={{ 
                  opacity: [0.3, 0.7, 0.3], 
                  scale: [1, 1.12, 1],
                  y: [0, -10, 0] 
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  delay: sport.delay,
                  ease: "easeInOut" 
                }}
                className="absolute flex flex-col items-center gap-1 text-slate-400"
                style={{ top: sport.top, left: sport.left }}
              >
                <div className={`p-3 bg-slate-900/60 backdrop-blur-md rounded-xl border border-slate-800 shadow-lg ${sport.color}`}>
                  <Icon className="w-8 h-8" />
                </div>
                <span className="text-[10px] uppercase tracking-widest font-mono text-slate-500 font-semibold">{sport.label}</span>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Main Counter Panel */}
      <div className="w-full max-w-md px-6 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-green/10 border border-brand-green/30 text-brand-green text-xs rounded-full font-mono font-medium mb-4 uppercase tracking-[0.2em]">
            <Activity className="w-3.5 h-3.5 animate-spin" />
            Cargando Plataforma Deportiva
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white tracking-tight">
            FEDELI<span className="text-brand-green">BA</span><span className="text-brand-red">PAM</span>
          </h1>
          <p className="text-[11px] uppercase tracking-widest text-slate-400 font-mono mt-2 font-medium">
            Federación de Ligas Barriales y Parroquiales de Manabí
          </p>
        </motion.div>

        {/* Dynamic Percentage Counter */}
        <div className="mb-6 relative">
          <motion.div 
            className="text-7xl font-display font-black text-white selection:bg-brand-green/30"
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {Math.round(progress)}<span className="text-brand-green text-5xl">%</span>
          </motion.div>
          <p className="text-xs text-slate-400 mt-1 font-sans">Sintonizando el fútbol, básquetbol, ecuavoley y más...</p>
        </div>

        {/* Progress bar container */}
        <div className="w-full h-3 bg-slate-900 rounded-full border border-slate-800 p-0.5 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-brand-green via-white to-brand-red rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Slogans on rotation */}
        <div className="mt-8 h-10 overflow-hidden flex items-center justify-center">
          <AnimatePresence mode="wait">
            {progress < 35 && (
              <motion.p
                key="t1"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-slate-400 italic px-4 leading-relaxed"
              >
                "Impulsando el deporte con transparencia y pasión provincial..."
              </motion.p>
            )}
            {progress >= 35 && progress < 70 && (
              <motion.p
                key="t2"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-slate-400 italic px-4 leading-relaxed"
              >
                "Conectando a las ligas barriales de los 22 cantones manabitas..."
              </motion.p>
            )}
            {progress >= 70 && (
              <motion.p
                key="t3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-xs text-slate-400 italic px-4 leading-relaxed"
              >
                "Listo para saltar a la cancha comunitaria..."
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Ecuadorian/Manabiti Strip Details on the bottom */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1 px-4 text-[10px] font-mono text-slate-600 font-semibold uppercase tracking-widest">
        <span>Manabí Federal</span>
        <span>•</span>
        <span>Unidad Recreativa Provincial</span>
      </div>
    </div>
  );
}
