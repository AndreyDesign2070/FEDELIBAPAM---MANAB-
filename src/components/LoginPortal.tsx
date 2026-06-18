import React, { useState } from "react";
import { motion } from "motion/react";
import { KeyRound, ShieldAlert, User, ShieldCheck, Eye, EyeOff, Trophy, MapPin, CheckCircle, ArrowRight } from "lucide-react";

interface LoginPortalProps {
  onLogin: (isAdmin: boolean) => void;
}

export default function LoginPortal({ onLogin }: LoginPortalProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPassword = password.trim().toLowerCase();
    if (!cleanPassword) {
      setError("Por favor, ingrese la contraseña de administrador.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    if (cleanPassword === "fedemanabi2026") {
      onLogin(true); // Is Admin
    } else if (cleanPassword === "visita2026") {
      onLogin(false); // Simulated visitor (read-only mode)
    } else {
      setIsSubmitting(false);
      setError("Contraseña incorrecta. Inténtelo de nuevo.");
    }
  };

  const handleEnterAsVisitor = () => {
    onLogin(false); // Is Visitor
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden sports-grid-bg">
      {/* Absolute design banners */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-brand-green/5 skew-x-12 transform origin-top-right pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-2/3 bg-brand-red/5 -skew-x-12 transform origin-bottom-left pointer-events-none"></div>

      {/* Decorative Sport glow spheres */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-red-600/10 rounded-full blur-[100px] pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: "spring" }}
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left Side: Editorial Banner of FEDELIBAPAM */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-brand-green to-slate-950 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800 text-white relative">
          <div className="absolute inset-0 opacity-25 bg-[url('https://images.unsplash.com/photo-1560272564-c83b66b1ad12?q=80&w=600')] bg-cover bg-center mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-white/5 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/15 mb-4 overflow-hidden hover:scale-105 transition-all duration-300 shadow-xl group" title="FEDELIBAPAM">
              <svg viewBox="0 0 300 300" className="w-18 h-18 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <clipPath id="ball-sketch-clip">
                    <circle cx="210" cy="110" r="62" />
                  </clipPath>
                </defs>

                {/* Combined Rotated Group for perfect motion-angle alignment (-34 degrees) */}
                <g transform="rotate(-34, 210, 110)">
                  {/* Background speed lines (behind the ball) */}
                  <g fill="#0f172a" stroke="none">
                    {/* Center thick trails */}
                    <path d="M 12,110 L 148,113 L 148,107 Z" />
                    <path d="M 28,92 L 144,94 L 144,90 Z" opacity="0.95" />
                    <path d="M 15,128 L 146,131 L 146,125 Z" opacity="0.95" />
                    
                    {/* Upper trails */}
                    <path d="M 45,70 L 140,71.5 L 140,68.5 Z" opacity="0.85" />
                    <path d="M 70,50 L 132,51 L 132,49 Z" opacity="0.75" />
                    <path d="M 85,35 L 125,35.8 L 125,34.2 Z" opacity="0.6" />
                    
                    {/* Lower trails */}
                    <path d="M 40,145 L 141,147 L 141,143 Z" opacity="0.85" />
                    <path d="M 55,162 L 138,163.5 L 138,160.5 Z" opacity="0.75" />
                    <path d="M 75,180 L 128,181 L 128,179 Z" opacity="0.6" />
                    <path d="M 95,195 L 118,195.5 L 118,194.5 Z" opacity="0.4" />
                  </g>

                  {/* Ultra-fine single sketch speed lines */}
                  <g stroke="#0f172a" strokeDasharray="6,3" strokeWidth="1.2" fill="none" opacity="0.7">
                    <line x1="8" y1="100" x2="146" y2="100" />
                    <line x1="22" y1="120" x2="148" y2="120" />
                    <line x1="50" y1="80" x2="135" y2="80" />
                    <line x1="60" y1="152" x2="140" y2="152" />
                    <line x1="5" y1="115" x2="148" y2="115" strokeDasharray="none" strokeWidth="0.8" />
                  </g>

                  {/* Ink splash ovals aligned with motion angle */}
                  <g fill="#0f172a" stroke="none">
                    {/* Top side splatters */}
                    <ellipse cx="80" cy="42" rx="6" ry="2" />
                    <ellipse cx="110" cy="26" rx="8" ry="2.5" opacity="0.9" />
                    <ellipse cx="135" cy="20" rx="4" ry="1.2" opacity="0.7" />
                    <ellipse cx="160" cy="30" rx="5" ry="1.8" opacity="0.85" />

                    {/* Bottom side splatters */}
                    <ellipse cx="70" cy="172" rx="7" ry="2.5" />
                    <ellipse cx="90" cy="190" rx="5" ry="1.8" opacity="0.9" />
                    <ellipse cx="115" cy="202" rx="9" ry="3" opacity="0.8" />
                    <ellipse cx="145" cy="188" rx="4" ry="1.5" opacity="0.7" />
                  </g>

                  {/* White Soccer Ball Base Sphere */}
                  <circle cx="210" cy="110" r="62" fill="#ffffff" />

                  {/* Ball Panels & Drawings masked inside the sphere */}
                  <g clipPath="url(#ball-sketch-clip)">
                    {/* Black Pentagons */}
                    {/* Left-center pentagon */}
                    <polygon points="152,92 180,100 185,126 160,134 142,112" fill="#0f172a" stroke="#0f172a" strokeWidth="1.5" />
                    
                    {/* Top-right pentagon */}
                    <polygon points="226,60 252,68 260,92 238,100 218,80" fill="#0f172a" stroke="#0f172a" strokeWidth="1.5" />
                    
                    {/* Bottom-right pentagon */}
                    <polygon points="224,134 250,138 262,162 242,172 220,156" fill="#0f172a" stroke="#0f172a" strokeWidth="1.5" />

                    {/* Outer Partially-Visible Pentagons or Dark Corners */}
                    {/* Top-right edge pentagon */}
                    <polygon points="252,68 274,52 284,65 272,82 260,92" fill="#0f172a" stroke="#0f172a" strokeWidth="1" />
                    {/* Bottom-right edge pentagon */}
                    <polygon points="250,138 272,130 282,145 270,158 262,162" fill="#0f172a" stroke="#0f172a" strokeWidth="1" />

                    {/* Connecting Seam Lines */}
                    <g stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none">
                      {/* Main central hexagon seams */}
                      <line x1="180" y1="100" x2="218" y2="80" />
                      <line x1="185" y1="126" x2="220" y2="156" />
                      <line x1="238" y1="100" x2="224" y2="134" />

                      {/* Outer boundary connections */}
                      <line x1="226" y1="60" x2="222" y2="48" />
                      <line x1="218" y1="80" x2="190" y2="72" />
                      <line x1="190" y1="72" x2="152" y2="92" />
                      <line x1="190" y1="72" x2="180" y2="52" />
                      <line x1="152" y1="92" x2="135" y2="82" />

                      <line x1="160" y1="134" x2="145" y2="155" />
                      <line x1="185" y1="126" x2="180" y2="155" />
                      <line x1="160" y1="134" x2="170" y2="165" />
                      <line x1="170" y1="165" x2="198" y2="172" />
                      <line x1="198" y1="172" x2="220" y2="156" />
                      <line x1="170" y1="165" x2="162" y2="178" />

                      <line x1="252" y1="68" x2="274" y2="52" />
                      <line x1="260" y1="92" x2="272" y2="82" />
                      <line x1="250" y1="138" x2="272" y2="130" />
                      <line x1="262" y1="162" x2="270" y2="158" />
                    </g>

                    {/* Artistic Line Hatching / Shading for organic hand-drawn illustration texture */}
                    <g stroke="#0f172a" strokeWidth="0.8" opacity="0.85">
                      {/* Hexagon center and top-left hatchings */}
                      <path d="M 183,103 L 191,101 M 184,108 L 192,106 M 185,113 L 193,111 M 186,118 L 194,116 M 187,123 L 195,121" />
                      <path d="M 221,83 L 213,87 M 224,87 L 216,91 M 227,91 L 219,95 M 230,95 L 222,99 M 233,99 L 225,103" />
                      <path d="M 223,153 L 215,149 M 224,147 L 216,143 M 224,141 L 216,137 M 224,135 L 216,131" />
                      <path d="M 228,62 L 232,54 M 233,63 L 237,55 M 238,64 L 242,56 M 243,65 L 247,57 M 248,66 L 252,58" />
                      <path d="M 148,100 L 153,98 M 147,105 L 152,103 M 146,110 L 151,108 M 146,115 L 151,113 M 147,120 L 152,118 M 148,125 L 153,123 M 150,130 L 155,128" />
                    </g>
                  </g>

                  {/* Thick sketchy contour line for the ball */}
                  <circle cx="210" cy="110" r="62" fill="none" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />

                  {/* Integrated overlapping foreground stroke lines and front drop-shadow highlights */}
                  <g fill="#0f172a" stroke="none">
                    <path d="M 120,110 L 172,111 L 172,109 Z" />
                    <path d="M 115,124 L 163,125 L 163,123 Z" />
                    <path d="M 130,95 L 158,96 L 158,94 Z" />
                    <ellipse cx="272" cy="95" rx="3" ry="1.2" opacity="0.8" />
                    <ellipse cx="280" cy="118" rx="4" ry="1.5" opacity="0.9" />
                  </g>
                </g>
              </svg>
            </div>
            <h2 className="text-xl font-display font-black tracking-tight leading-none">
              <span className="text-white">FEDELI</span>
              <span className="text-emerald-400">BAPAM</span>
            </h2>
            <p className="text-[10px] text-emerald-100/90 font-sans leading-relaxed tracking-normal font-medium mt-2">
              Federación de Ligas Barriales y Parroquiales de Manabí
            </p>
          </div>

          <div className="mt-8 md:mt-16 relative z-10">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-emerald-100">
                <CheckCircle className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
                <span>22 Cantones Integrados</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-100">
                <CheckCircle className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
                <span>Transparencia Total</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-emerald-100">
                <CheckCircle className="w-3.5 h-3.5 text-brand-red flex-shrink-0" />
                <span>Deporte Recreativo</span>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-12 text-[9px] text-emerald-300 font-mono tracking-widest uppercase relative z-10 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-brand-red" />
            Manabí, Ecuador
          </div>
        </div>

        {/* Right Side: Access Forms */}
        <div className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-center bg-slate-900">
          <div className="mb-6">
            <h1 className="text-2xl font-display font-bold text-white tracking-tight">
              Acceso Institucional
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Ingrese la contraseña asignada si es un directivo de la federación, o acceda como visitante general.
            </p>
          </div>

          {/* Admin Login Form */}
          <form onSubmit={handleSubmitAdmin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider font-mono">
                Contraseña Administrativa
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <KeyRound className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError("");
                  }}
                  autoCapitalize="none"
                  autoCorrect="off"
                  autoComplete="current-password"
                  spellCheck="false"
                  placeholder="••••••••••••"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 focus:border-brand-green/70 rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[10.5px] text-slate-400 mt-1.5 font-sans leading-relaxed">
                💡 <span className="font-semibold text-emerald-400">Facilidad móvil:</span> Ya no tienes que preocuparte por mayúsculas automáticas del teclado ni espacios extras al final.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-950/40 border border-red-900/50 rounded-xl flex items-start gap-2.5 text-red-400 text-xs"
              >
                <ShieldAlert className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-slate-100 hover:bg-white text-slate-950 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-1.5 font-mono">
                  <span className="w-2.5 h-2.5 bg-brand-green rounded-full animate-ping"></span>
                  Validando...
                </span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-brand-green" />
                  Entrar como Administrador
                </>
              )}
            </button>
          </form>

          {/* Divider with beautiful 'O' label */}
          <div className="relative my-6 text-center">
            <hr className="border-slate-800" />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-slate-900 px-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
              O bien
            </span>
          </div>

          {/* Enter as Visitor Green Button (Requested exactly by user) */}
          <button
            onClick={handleEnterAsVisitor}
            className="w-full py-3 px-4 bg-brand-green hover:bg-brand-green/90 text-white rounded-xl text-sm font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group shadow-xl active:scale-98"
          >
            <User className="w-4 h-4 group-hover:scale-110 transition-transform text-teal-200" />
            <span>Entrar como Visitante</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform ml-1 text-teal-200" />
          </button>

          <p className="text-[10px] text-center text-slate-500 mt-5 font-mono uppercase tracking-wider font-semibold">
            Pagina Web – Art By: Andrey Design – 2026
          </p>
        </div>
      </motion.div>
    </div>
  );
}
