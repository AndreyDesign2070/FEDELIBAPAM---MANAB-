import React, { useState, useEffect } from "react";
import ConfirmModal from "./components/ConfirmModal";
import { INITIAL_STATE } from "./data";
import { FEDELIBAPAMState, Publication, TournamentStanding, AffiliatedLeague, TransparencyDocument } from "./types";
import Loader from "./components/Loader";
import LoginPortal from "./components/LoginPortal";
import PublicationCard from "./components/PublicationCard";
import PublicationModal from "./components/PublicationModal";
import StandingsManager from "./components/StandingsManager";
import LeaguesManager from "./components/LeaguesManager";
import TransparencySection from "./components/TransparencySection";
import { 
  Trophy, 
  ShieldCheck, 
  LogOut, 
  MapPin, 
  Mail, 
  Phone, 
  Camera, 
  Plus, 
  RefreshCw, 
  Flame, 
  ArrowUp, 
  ExternalLink, 
  Filter, 
  Search, 
  CheckCircle, 
  Heart,
  X,
  Instagram
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

const COVER_OPTIONS = [
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200", // Stadium action
  "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=1200", // Championship cup
  "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?q=80&w=1200", // Runners on track
  "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=1200"  // Basketball game
];

const SHIELD_OPTIONS = [
  "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=200", // Gold crown sport cup
  "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=200", // Soccer field ball badge
  "https://images.unsplash.com/photo-1594470117722-de4b9a02ebed?q=80&w=200", // Green star badge
  "https://images.unsplash.com/photo-1628891890467-b79f2c879d74?q=80&w=200"  // Multi-color shield icon
];

export default function App() {
  // Navigation & Screen status
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // State for custom Confirm Modal (to avoid window.confirm block in iframe)
  const [confirmState, setConfirmState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {}
  });

  // Dynamic application state
  const [appState, setAppState] = useState<FEDELIBAPAMState>(INITIAL_STATE);

  // Guarantee safeAppState with all standard keys fallback for absolute type safety
  const safeAppState: FEDELIBAPAMState = {
    ...INITIAL_STATE,
    ...(appState || {}),
    publications: Array.isArray(appState?.publications) ? appState.publications : INITIAL_STATE.publications,
    sports: Array.isArray(appState?.sports) ? appState.sports : INITIAL_STATE.sports,
    leagues: Array.isArray(appState?.leagues) ? appState.leagues : INITIAL_STATE.leagues,
    transparencyDocuments: Array.isArray(appState?.transparencyDocuments) ? appState.transparencyDocuments : INITIAL_STATE.transparencyDocuments,
  };

  // Filter systems
  const [sportFilter, setSportFilter] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  // Modals management
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [modalEditMode, setModalEditMode] = useState(false);

  // Admin settings toggle panels
  const [headerEditOpen, setHeaderEditOpen] = useState(false);
  const [tempCover, setTempCover] = useState("");
  const [tempShield, setTempShield] = useState("");
  const [tempIntro, setTempIntro] = useState("");
  const [tempEmail, setTempEmail] = useState("");
  const [tempPhone, setTempPhone] = useState("");

  // Footer / Affiliation section editing states
  const [isEditingFooterBox, setIsEditingFooterBox] = useState(false);
  const [footerBoxBadge, setFooterBoxBadge] = useState("");
  const [footerBoxTitle, setFooterBoxTitle] = useState("");
  const [footerBoxContent, setFooterBoxContent] = useState("");

  const startEditingFooterBox = () => {
    setFooterBoxBadge(safeAppState.footerBadge || "Buzón Ciudadano & Afiliaciones");
    setFooterBoxTitle(safeAppState.footerTitle || "¿Quieres afiliar tu liga o club deportivo a FEDELIBAPAM?");
    setFooterBoxContent(safeAppState.footerContent || "FEDELIBAPAM busca expandir el deporte a lo largo del territorio nacional. Apoyamos con kits de implementos deportivos, pelotas oficiales, capacitación de árbitros y transparencia fiscal para todas nuestras ligas. Escríbenos para agendar una visita técnica a tu cantón o parroquia.");
    setIsEditingFooterBox(true);
  };

  const handleSaveFooterBoxDesc = () => {
    saveState({
      ...safeAppState,
      footerBadge: footerBoxBadge.trim() || "Buzón Ciudadano & Afiliaciones",
      footerTitle: footerBoxTitle.trim() || "¿Quieres afiliar tu liga o club deportivo a FEDELIBAPAM?",
      footerContent: footerBoxContent.trim() || "FEDELIBAPAM busca expandir el deporte a lo largo del territorio nacional. Apoyamos con kits de implementos deportivos, pelotas oficiales, capacitación de árbitros y transparencia fiscal para todas nuestras ligas. Escríbenos para agendar una visita técnica a tu cantón o parroquia."
    });
    setIsEditingFooterBox(false);
  };

  // Dark Bottom Footer section editing states
  const [isEditingBottomFooter, setIsEditingBottomFooter] = useState(false);
  const [bottomFootDesc, setBottomFootDesc] = useState("");
  const [bottomFootLoc, setBottomFootLoc] = useState("");
  const [bottomFootShare, setBottomFootShare] = useState("");

  const startEditingBottomFooter = () => {
    setBottomFootDesc(safeAppState.bottomFooterDescription || "Federación de Ligas Barriales y Parroquiales de Manabí. Consagrados a promover el deporte comunitario libre de corrupción, impulsando el talento de nuestra patria desde las canchas de barrio.");
    setBottomFootLoc(safeAppState.bottomFooterLocation || "Complejo Deportivo La California, Portoviejo, Manabí");
    setBottomFootShare(safeAppState.bottomFooterShareText || "Ayúdanos a difundir el deporte barrial manabita enviando este portal web directo a tus grupos de WhatsApp.");
    setIsEditingBottomFooter(true);
  };

  const handleSaveBottomFooterText = () => {
    saveState({
      ...safeAppState,
      bottomFooterDescription: bottomFootDesc.trim() || undefined,
      bottomFooterLocation: bottomFootLoc.trim() || undefined,
      bottomFooterShareText: bottomFootShare.trim() || undefined
    });
    setIsEditingBottomFooter(false);
  };

  // Scroll to top marker
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("FEDELIBAPAM_STATE_V1");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          const merged: FEDELIBAPAMState = {
            ...INITIAL_STATE,
            ...parsed,
            publications: Array.isArray(parsed.publications) ? parsed.publications : INITIAL_STATE.publications,
            standings: Array.isArray(parsed.standings) ? parsed.standings : INITIAL_STATE.standings,
            leagues: Array.isArray(parsed.leagues) ? parsed.leagues : INITIAL_STATE.leagues,
            transparencyDocuments: Array.isArray(parsed.transparencyDocuments) ? parsed.transparencyDocuments : INITIAL_STATE.transparencyDocuments,
            sports: Array.isArray(parsed.sports) ? parsed.sports : INITIAL_STATE.sports
          };
          setAppState(merged);
        }
      }
    } catch (e) {
      console.error("Error loading local storage state: ", e);
    }

    // Scroll listener
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Save to local storage helper
  const saveState = (newState: FEDELIBAPAMState) => {
    setAppState(newState);
    try {
      localStorage.setItem("FEDELIBAPAM_STATE_V1", JSON.stringify(newState));
    } catch (e) {
      console.error("Error saving state to local storage: ", e);
    }
  };

  // Auth transition
  const handlePortalLogin = (adminLevel: boolean) => {
    setIsAdmin(adminLevel);
    setIsAuthenticated(true);
  };

  // Synchronize dynamic temp header form fields safely only when edit drawer is active
  useEffect(() => {
    if (headerEditOpen) {
      setTempCover(safeAppState.coverUrl || INITIAL_STATE.coverUrl);
      setTempShield(safeAppState.shieldUrl || INITIAL_STATE.shieldUrl);
      setTempIntro(safeAppState.introductionText || INITIAL_STATE.introductionText);
      setTempEmail(safeAppState.contactEmail || INITIAL_STATE.contactEmail);
      setTempPhone(safeAppState.contactPhone || INITIAL_STATE.contactPhone);
    }
  }, [headerEditOpen, safeAppState.coverUrl, safeAppState.shieldUrl, safeAppState.introductionText, safeAppState.contactEmail, safeAppState.contactPhone]);

  const handleLogout = () => {
    setIsAdmin(false);
    setIsAuthenticated(false);
  };

  // Reset to default preloaded configurations (excellent for the tester)
  const handleResetToDefault = () => {
    setConfirmState({
      isOpen: true,
      title: "Restaurar",
      message: "¿Estás seguro de restaurar?",
      confirmLabel: "Sí, restaurar",
      onConfirm: () => {
        saveState(INITIAL_STATE);
        setTempCover(INITIAL_STATE.coverUrl);
        setTempShield(INITIAL_STATE.shieldUrl);
        setTempIntro(INITIAL_STATE.introductionText);
        setTempEmail(INITIAL_STATE.contactEmail);
        setTempPhone(INITIAL_STATE.contactPhone);
        setHeaderEditOpen(false);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Publications Handlers
  const handleSavePublication = (pub: Publication) => {
    const exists = (safeAppState.publications || []).some(p => p.id === pub.id);
    let updatedPublications;

    if (exists) {
      updatedPublications = (safeAppState.publications || []).map(p => p.id === pub.id ? pub : p);
    } else {
      updatedPublications = [pub, ...(safeAppState.publications || [])];
    }

    saveState({
      ...safeAppState,
      publications: updatedPublications
    });
  };

  const handleDeletePublication = (id: string) => {
    const targetPub = (safeAppState.publications || []).find(p => p.id === id);
    const pubTitle = targetPub ? targetPub.title : "";
    setConfirmState({
      isOpen: true,
      title: "Eliminar Publicación",
      message: `¿Está seguro de que desea eliminar permanentemente la publicación "${pubTitle}"? Esta acción no se puede deshacer.`,
      confirmLabel: "Eliminar de todas formas",
      onConfirm: () => {
        saveState({
          ...safeAppState,
          publications: (safeAppState.publications || []).filter(p => p.id !== id)
        });
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  const handleOpenCreatePublication = () => {
    setSelectedPublication(null);
    setModalEditMode(true);
    setModalOpen(true);
  };

  const handleOpenEditPublication = (pub: Publication) => {
    setSelectedPublication(pub);
    setModalEditMode(true);
    setModalOpen(true);
  };

  const handleViewPublicationDetails = (pub: Publication) => {
    setSelectedPublication(pub);
    setModalEditMode(false);
    setModalOpen(true);

    // Increment view count dynamically on local state
    const updatedPubs = (safeAppState.publications || []).map(p => {
      if (p.id === pub.id) {
        return { ...p, viewsCount: (p.viewsCount || 0) + 1 };
      }
      return p;
    });
    saveState({
      ...safeAppState,
      publications: updatedPubs
    });
  };

  // Standings update handler
  const handleUpdateStandings = (newStandings: TournamentStanding[]) => {
    saveState({
      ...safeAppState,
      standings: newStandings
    });
  };

  // Leagues update handler
  const handleUpdateLeagues = (newLeagues: AffiliatedLeague[]) => {
    saveState({
      ...safeAppState,
      leagues: newLeagues
    });
  };

  // Transparency update handler
  const handleUpdateDocs = (newDocs: TransparencyDocument[]) => {
    saveState({
      ...safeAppState,
      transparencyDocuments: newDocs
    });
  };

  // Admin Header Info Submit
  const handleSaveHeaderEdits = (e: React.FormEvent) => {
    e.preventDefault();
    saveState({
      ...safeAppState,
      coverUrl: tempCover.trim() || safeAppState.coverUrl,
      shieldUrl: tempShield.trim() || safeAppState.shieldUrl,
      introductionText: tempIntro.trim() || safeAppState.introductionText,
      contactEmail: tempEmail.trim() || safeAppState.contactEmail,
      contactPhone: tempPhone.trim() || safeAppState.contactPhone
    });
    setHeaderEditOpen(false);
  };

  // Dynamic values extract sport types for filter based on admin's additions/removals
  const availableSports = ["Todos", ...(safeAppState.sports || []).map(s => s.name)];

  // Filters publications by search query and selected sport filter keyword
  const filteredPublications = (safeAppState.publications || []).filter((pub) => {
    const matchesSport = sportFilter === "Todos" || pub.sport === sportFilter;
    const matchesSearch = 
      pub.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      pub.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pub.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSport && matchesSearch;
  });

  // Share overall Landing Page via WhatsApp
  const shareOverallPage = () => {
    const messageText = `*FEDELIBAPAM* - Federación de Ligas Barriales y Parroquiales de Manabí. Sigue de cerca las actividades deportivas barriales, las tablas de posiciones y los informes oficiales con total transparencia aquí: \n${window.location.href}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(messageText)}`, "_blank");
  };

  // Loading phase
  if (isLoading) {
    return <Loader onComplete={() => setIsLoading(false)} />;
  }

  // Login authentication phase
  if (!isAuthenticated) {
    return <LoginPortal onLogin={handlePortalLogin} />;
  }

  return (
    <div id="main-landing-view" className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans antialiased">
      
      {/* 1. STATE INDICATOR STRIP (ADMIN OR VISITOR WRAPPER) */}
      <div className={`py-2 px-4 shadow-sm z-30 relative transition-colors ${isAdmin ? "bg-slate-900 border-b border-brand-green/30" : "bg-gradient-to-r from-brand-green via-white to-brand-red text-slate-900"}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2 text-xs font-mono font-medium">
          {isAdmin ? (
            <div className="flex items-center gap-2.5 text-emerald-400">
              <span className="w-2.5 h-2.5 bg-brand-green rounded-full animate-pulse"></span>
              <span>MODO ADMINISTRADOR – EDITOR</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-slate-950 font-bold px-2.5 py-0.5 rounded-full bg-white/70 backdrop-blur-sm self-start">
              <span>Modo Visitante — Solo Lectura (Notificaciones Abiertas)</span>
            </div>
          )}

          <div className="flex items-center gap-4">
            {isAdmin && (
              <button
                onClick={handleResetToDefault}
                className="w-8 h-8 bg-slate-800 hover:bg-slate-700 text-brand-red rounded-lg transition-all border border-slate-700 flex items-center justify-center cursor-pointer shadow-md"
                title="Restaurar"
              >
                <RefreshCw className="w-4.5 h-4.5 text-brand-red" />
              </button>
            )}

            <button
              onClick={handleLogout}
              className={`py-1 px-3.5 rounded-lg flex items-center gap-1.5 transition-colors text-[10px] font-bold uppercase tracking-wider ${isAdmin ? "bg-brand-red text-white hover:bg-brand-red/90" : "bg-slate-950 hover:bg-slate-900 text-white shadow-md"}`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isAdmin ? "Salir de Admin" : "Volver a Inicio de Acceso"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. INSTITUTIONAL HERO HEADER */}
      <header className="relative bg-slate-950 text-white min-h-[360px] md:min-h-[460px] flex items-end pb-8 overflow-hidden">
        {/* Cover Photo Backdrop (Editable by Admin) */}
        <div className="absolute inset-0">
          <img
            src={safeAppState.coverUrl}
            alt="FEDELIBAPAM Portada"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/30 to-slate-950/60"></div>
        </div>

        {/* Change Cover Camera button if Admin matches */}
        {isAdmin && (
          <button
            onClick={() => setHeaderEditOpen(!headerEditOpen)}
            className="absolute top-4 right-4 z-20 py-2.5 px-4 bg-slate-900/90 hover:bg-white hover:text-slate-900 text-white border border-slate-700 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 backdrop-blur-sm shadow-xl"
          >
            <Camera className="w-4 h-4 text-brand-green" />
            <span>Editar Portada, Escudo e Info</span>
          </button>
        )}

        {/* Main Header Inner Content */}
        {/* Institution Shield Logo (Editable by Admin) */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full relative z-10 flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8">
          
          <div className="relative group/shield flex-shrink-0">
            <div className="w-28 h-28 md:w-36 md:h-36 bg-white rounded-full border-4 border-white shadow-2xl overflow-hidden flex items-center justify-center p-2.5">
              <img
                src={safeAppState.shieldUrl}
                alt="FEDELIBAPAM Escudo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>
            
            {/* National Strip behind Logo */}
            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 px-2 bg-slate-900 rounded-lg border border-slate-700 py-0.5 text-[9px] font-mono text-emerald-300 font-bold">
              <span>FEDE</span>
            </div>
          </div>

          {/* Institutional Title text descriptions */}
          <div className="text-center md:text-left space-y-3 flex-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-green/20 border border-brand-green/30 text-emerald-300 text-[10px] md:text-xs font-mono font-bold tracking-[0.2em] rounded-full uppercase">
              <Trophy className="w-3.5 h-3.5 text-brand-red" />
              FEDERACIÓN DE LIGAS BARRIALES – MANABÍ
            </span>

            <h1 className="text-3xl md:text-5xl font-display font-black tracking-tight leading-tight uppercase">
              FEDELI<span className="text-brand-green text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">BA</span><span className="text-brand-red text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-600">PAM</span>
            </h1>

            <div className="block">
              <p className="text-xs md:text-sm text-slate-100 font-medium font-sans max-w-2xl leading-relaxed bg-black/40 backdrop-blur-[3px] px-4 py-3 rounded-xl border border-white/10 shadow-xl inline-block text-left">
                {safeAppState.introductionText}
              </p>
            </div>

            {/* Contacts fast anchors row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono text-slate-400 pt-3 border-t border-slate-800/80 items-center">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-brand-green" />
                {safeAppState.contactEmail}
              </span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-brand-red" />
                {safeAppState.contactPhone}
              </span>
              <span className="flex items-center gap-1.5 bg-slate-900 py-1 px-3 rounded-md text-emerald-300 font-semibold border border-slate-800">
                <MapPin className="w-3.5 h-3.5 text-brand-red" />
                Manabí, Ecuador
              </span>
              <a
                href="https://www.instagram.com/ligacantonalportoviejo/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-brand-green text-white hover:bg-brand-green/90 font-bold py-1 px-3 rounded-md transition-all hover:scale-105 cursor-pointer shadow-md text-xs font-sans"
              >
                <Instagram className="w-3.5 h-3.5 text-white" />
                <span>@ligacantonalportoviejo</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* 3. FLOATING EDITOR PANEL FOR PORTADA & ESCUDO (ADMIN ONLY) */}
      <AnimatePresence>
        {headerEditOpen && isAdmin && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -20 }}
            className="bg-white border-b border-brand-green/30 p-6 shadow-xl relative z-20"
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-100">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-brand-green" />
                  Personalizar Encabezados del Organismo
                </h3>
                <button
                  onClick={() => setHeaderEditOpen(false)}
                  className="p-1 hover:bg-slate-100 rounded text-slate-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveHeaderEdits} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Cover image input helper */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-slate-550 mb-1">Imagen de Portada</label>
                    <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Pegar URL de imagen..."
                        value={tempCover}
                        onChange={(e) => setTempCover(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-brand-green font-mono"
                      />
                      <label className="block text-center py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold rounded-lg cursor-pointer transition-colors border border-slate-300">
                        📁 Subir Foto de Portada (JPG/PNG)
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setTempCover(event.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {/* Presets template portada */}
                    <div className="flex gap-1.5 mt-2">
                      {COVER_OPTIONS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setTempCover(url)}
                          className={`text-[9px] py-1 px-2 border rounded ${tempCover === url ? 'bg-brand-green text-white border-brand-green' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                        >
                          Fondo {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Shield image logo input helper */}
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-slate-555 mb-1">Escudo del Organismo / Foto de Perfil</label>
                    <div className="flex flex-col gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        placeholder="Pegar URL de escudo..."
                        value={tempShield}
                        onChange={(e) => setTempShield(e.target.value)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-brand-green font-mono"
                      />
                      <label className="block text-center py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 text-[10px] font-bold rounded-lg cursor-pointer transition-colors border border-slate-300">
                        📁 Subir Escudo/Perfil (JPG/PNG)
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setTempShield(event.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                    </div>
                    
                    {/* Presets template shield */}
                    <div className="flex gap-1.5 mt-2">
                      {SHIELD_OPTIONS.map((url, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setTempShield(url)}
                          className={`text-[9px] py-1 px-2 border rounded ${tempShield === url ? 'bg-brand-green text-white border-brand-green' : 'bg-slate-50 text-slate-600 border-slate-200'}`}
                        >
                          Escudo {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Slogan Intro Text input */}
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">Descripción de Introducción Institucional</label>
                  <textarea
                    rows={2}
                    value={tempIntro}
                    onChange={(e) => setTempIntro(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-green"
                  ></textarea>
                </div>

                {/* Contacts input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">Correo de Contacto</label>
                    <input
                      type="email"
                      required
                      value={tempEmail}
                      onChange={(e) => setTempEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">Teléfono Fijo / Celular</label>
                    <input
                      type="text"
                      required
                      value={tempPhone}
                      onChange={(e) => setTempPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>

                {/* Buttons block */}
                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white font-mono uppercase tracking-wider text-[11px] font-bold rounded-xl transition-all"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. MAIN LAYOUT AND NAVIGATION ANCHORS WITH NATIONAL COLORS */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          
          {/* Menu Anchors */}
          <div className="flex overflow-x-auto py-1 gap-2.5 scrollbar-none items-center">
            <a href="#noticias" className="py-3 px-3.5 text-xs text-slate-700 hover:text-brand-green font-bold uppercase tracking-wider transition-all border-b-2 border-transparent hover:border-brand-green">
              Noticias
            </a>
            <a href="#clasificaciones" className="py-3 px-3.5 text-xs text-slate-700 hover:text-brand-green font-bold uppercase tracking-wider transition-all border-b-2 border-transparent hover:border-brand-green">
              Deportes
            </a>
            <a href="#ligas" className="py-3 px-3.5 text-xs text-slate-700 hover:text-brand-green font-bold uppercase tracking-wider transition-all border-b-2 border-transparent hover:border-brand-green">
              Ligas Afiliadas
            </a>
            <a href="#transparencia" className="py-3 px-3.5 text-xs text-slate-700 hover:text-brand-green font-bold uppercase tracking-wider transition-all border-b-2 border-transparent hover:border-brand-green">
              Documentacion
            </a>
            
            {/* Quick Share via WhatsApp Anchor */}
            <button
              onClick={shareOverallPage}
              className="py-1 px-3.5 hover:bg-green-50 text-green-600 rounded-full border border-green-200 font-bold font-mono text-[10px] uppercase tracking-wider flex items-center gap-1 cursor-pointer"
            >
              <span>compartir pagina</span>
            </button>
          </div>

          <div className="flex gap-1 pr-2">
            <span className="w-1.5 h-6 bg-brand-green rounded-full"></span>
            <span className="w-1.5 h-6 bg-slate-200 rounded-full"></span>
            <span className="w-1.5 h-6 bg-brand-red rounded-full"></span>
          </div>

        </div>
      </nav>

      {/* 5. PRIMARY CONTENT STAGE */}
      <main className="flex-1 max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-12">
        
        {/* ==================== A. PINNED NEWS HIGHLIGHT SPOTLIGHT CARDS ==================== */}
        {(safeAppState.publications || []).some(p => p.isPinned) && (
          <section className="space-y-4">
            <h2 className="text-xs font-mono font-bold text-brand-red uppercase tracking-widest flex items-center gap-1">
              <Flame className="w-4 h-4 animate-pulse" />
              Spotlight / Publicación Destacada Oficial
            </h2>

            {(safeAppState.publications || [])
              .filter(p => p.isPinned)
              .slice(0, 1)
              .map((pub) => (
                <div
                  key={pub.id}
                  onClick={() => handleViewPublicationDetails(pub)}
                  className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-xl transition-all flex flex-col md:flex-row cursor-pointer group hover:border-brand-green/30 relative"
                >
                  {/* Left Column Sport Art */}
                  <div className="w-full md:w-5/12 h-64 md:h-80 relative overflow-hidden bg-slate-100 flex-shrink-0">
                    <img
                      src={pub.imageUrl}
                      alt={pub.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    />
                    <div className="absolute inset-x-0 bottom-0 py-6 px-5 bg-gradient-to-t from-slate-950 via-slate-950/25 to-transparent flex items-end justify-between">
                      <span className="bg-brand-green text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-md">
                        {pub.sport}
                      </span>
                      <span className="text-[10px] text-emerald-300 font-mono tracking-widest uppercase">Destacado</span>
                    </div>
                  </div>

                  {/* Right Column details */}
                  <div className="p-6 md:p-8 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-4 text-xs font-mono text-slate-400 mb-3">
                        <span>📅 {pub.date}</span>
                        <span>•</span>
                        <span>🏆 {pub.category}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-display font-extrabold text-slate-950 leading-tight tracking-tight mb-3 group-hover:text-brand-green transition-colors">
                        {pub.title}
                      </h3>
                      <p className="text-sm md:text-base text-slate-600 line-clamp-3 leading-relaxed font-sans mb-6">
                        {pub.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-brand-green font-bold bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-100 group-hover:bg-brand-green group-hover:text-white transition-colors">
                          Leer noticia completa
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Avoid opening modal twice
                            const pageUrl = window.location.href;
                            const text = `*FEDELIBAPAM - Deporte Barrial de Manabí*\n\n⚽ *${pub.title}*\n\n🔗 Conoce más detalles en la web:\n${pageUrl}`;
                            window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
                          }}
                          className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 shadow-sm transition-colors"
                        >
                          Compartir WhatsApp
                        </button>
                      </div>

                      <span className="text-xs font-mono text-slate-400 font-medium">
                        {pub.viewsCount} lecturas registradas
                      </span>
                    </div>
                  </div>

                  {/* Action controls if Admin */}
                  {isAdmin && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-slate-900/90 backdrop-blur-sm p-1.5 rounded-xl border border-slate-700 shadow-xl z-20">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEditPublication(pub);
                        }}
                        className="p-1 px-2 hover:bg-brand-green/30 text-emerald-400 rounded-lg transition-colors border border-transparent hover:border-emerald-500/50 text-xs font-bold"
                      >
                        Editar
                      </button>
                    </div>
                  )}
                </div>
              ))}
          </section>
        )}

        {/* ==================== B. NEWS FEED GRID AREA ==================== */}
        <section id="noticias" className="space-y-6 pt-4">
          
          {/* Section title & Filters bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-green"></span>
                <span className="text-xs font-mono text-brand-green uppercase tracking-wider font-bold">Actividades y Reportajes</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-black text-slate-950 tracking-tight">
                Noticias de Actividades Deportivas
              </h2>
            </div>

            {/* Admin Add publication button */}
            {isAdmin && (
              <button
                onClick={handleOpenCreatePublication}
                className="py-2.5 px-4 bg-brand-green hover:bg-brand-green/95 text-white rounded-xl text-xs font-extrabold uppercase tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-97"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Nueva Noticia</span>
              </button>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            
            {/* Quick Filter tabs layout */}
            <div className="flex flex-wrap gap-1.5 items-center flex-1">
              <span className="text-xs font-bold font-mono text-slate-400 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Deporte:
              </span>
              {availableSports.map((sport) => (
                <button
                  key={sport}
                  onClick={() => setSportFilter(sport)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    sportFilter === sport
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                      : "bg-white hover:bg-slate-200 text-slate-700 border-slate-200"
                  }`}
                >
                  {sport}
                </button>
              ))}
            </div>

            {/* Simple text search */}
            <div className="relative w-full md:w-64 flex-shrink-0">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Buscar reportajes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 focus:border-brand-green rounded-xl text-xs focus:outline-none placeholder-slate-400 text-slate-900"
              />
            </div>

          </div>

          {/* Core Grid cards rendering */}
          {filteredPublications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPublications.map((pub) => (
                <PublicationCard
                  key={pub.id}
                  publication={pub}
                  isAdmin={isAdmin}
                  onEdit={handleOpenEditPublication}
                  onDelete={handleDeletePublication}
                  onViewDetails={handleViewPublicationDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-200">
              <Trophy className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-mono">No se encontraron reportajes deportivos coincidiendo con sus criterios.</p>
              {isAdmin && (
                <button
                  onClick={handleOpenCreatePublication}
                  className="mt-3 text-xs text-brand-green font-bold underline"
                >
                  Subir la primera noticia deportiva del día
                </button>
              )}
            </div>
          )}

        </section>

        {/* ==================== C. RESULTS & ACTIVE TOURNAMENT STANDINGS ==================== */}
        <section id="clasificaciones" className="scroll-mt-20 pt-4">
          <StandingsManager
            sports={safeAppState.sports || []}
            isAdmin={isAdmin}
            onUpdateSports={(updatedSports) => {
              saveState({
                ...safeAppState,
                sports: updatedSports
              });
              // Reset active filter if the selected sport was deleted
              const names = updatedSports.map((s) => s.name);
              if (sportFilter !== "Todos" && !names.includes(sportFilter)) {
                setSportFilter("Todos");
              }
            }}
          />
        </section>

        {/* ==================== D. FEDERATED NEIGHBORHOOD LEAGUES ROSTER ==================== */}
        <section id="ligas" className="scroll-mt-20 pt-4">
          <LeaguesManager
            leagues={safeAppState.leagues || []}
            isAdmin={isAdmin}
            onUpdateLeagues={handleUpdateLeagues}
          />
        </section>

        {/* ==================== E. TRANSPARENCY SECTION DOCUMENT FILE LOGGER ==================== */}
        <section id="transparencia" className="scroll-mt-20 pt-4">
          <TransparencySection
            documents={safeAppState.transparencyDocuments || []}
            isAdmin={isAdmin}
            onUpdateDocuments={handleUpdateDocs}
          />
        </section>

        {/* ==================== F. INTEGRATIONAL COMMUNITY MAILINGBOX ==================== */}
        <section className="bg-gradient-to-br from-brand-green to-slate-900 rounded-3xl p-6 md:p-10 text-white relative overflow-hidden shadow-xl border border-emerald-800">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800')] bg-cover bg-center mix-blend-overlay"></div>
          
          {/* Admin Edit Trigger top-right alignment */}
          {isAdmin && !isEditingFooterBox && (
            <button
              onClick={startEditingFooterBox}
              className="absolute top-4 right-4 md:top-6 md:right-6 py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 cursor-pointer z-20 shadow-md active:scale-95 animate-pulse"
            >
              <span>✏️ Editar Texto</span>
            </button>
          )}

          <div className="relative z-10 max-w-2xl space-y-4">
            {isEditingFooterBox ? (
              <div className="space-y-3 bg-slate-950/80 p-5 rounded-2xl border border-slate-700/80 animate-fade-in">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-extrabold block">⚙️ EDITOR DE CONTENIDO (ADMIN)</span>
                
                <div>
                  <label className="block text-[9px] uppercase font-mono font-bold text-slate-300 mb-0.5">Texto de Distintivo (Badge)</label>
                  <input
                    type="text"
                    value={footerBoxBadge}
                    onChange={(e) => setFooterBoxBadge(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-mono font-bold text-slate-300 mb-0.5">Título del Recuadro</label>
                  <input
                    type="text"
                    value={footerBoxTitle}
                    onChange={(e) => setFooterBoxTitle(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div>
                  <label className="block text-[9px] uppercase font-mono font-bold text-slate-300 mb-0.5">Contenido del Recuadro (Descripción)</label>
                  <textarea
                    rows={4}
                    value={footerBoxContent}
                    onChange={(e) => setFooterBoxContent(e.target.value)}
                    className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveFooterBoxDesc}
                    className="py-1.5 px-4 bg-brand-green hover:bg-brand-green/90 text-white rounded-lg text-xs font-bold uppercase transition-all"
                  >
                    Guardar Cambios
                  </button>
                  <button
                    onClick={() => setIsEditingFooterBox(false)}
                    className="py-1.5 px-4 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg text-xs font-bold uppercase transition-all"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <span className="inline-block py-1 px-3.5 bg-brand-red text-white text-[10px] font-mono font-bold uppercase tracking-widest rounded-full animate-pulse-subtle">
                  {safeAppState.footerBadge || "Buzón Ciudadano & Afiliaciones"}
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight">
                  {safeAppState.footerTitle || "¿Quieres afiliar tu liga o club deportivo a FEDELIBAPAM?"}
                </h2>
                <p className="text-sm text-emerald-100 leading-relaxed font-sans">
                  {safeAppState.footerContent || "FEDELIBAPAM busca expandir el deporte a lo largo del territorio nacional. Apoyamos con kits de implementos deportivos, pelotas oficiales, capacitación de árbitros y transparencia fiscal para todas nuestras ligas. Escríbenos para agendar una visita técnica a tu cantón o parroquia."}
                </p>
              </>
            )}
            
            {!isEditingFooterBox && (
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href="https://google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-5 bg-white hover:bg-slate-100 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Enviar Email Institucional</span>
                  <ExternalLink className="w-3.5 h-3.5 text-brand-green" />
                </a>

                <a
                  href="https://api.whatsapp.com/send?phone=593978737216&text=Hola%20FEDELIBAPAM,%20estoy%20interesado%20en%20obtener%20información%20para%20afiliar%20mi%20liga/club."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-5 bg-green-600 hover:bg-green-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Escríbenos por WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </section>

      </main>

      {/* 6. COMPREHENSIVE INSTITUTIONAL FOOTER */}
      <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-800 z-10 relative">
        {/* Admin Edit Trigger top-right alignment */}
        {isAdmin && !isEditingBottomFooter && (
          <button
            onClick={startEditingBottomFooter}
            className="absolute top-4 right-4 md:top-6 md:right-8 py-1.5 px-3 bg-amber-500 hover:bg-amber-600 text-slate-950 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1 cursor-pointer z-20 shadow-md active:scale-95 animate-pulse"
          >
            <span>✏️ Editar Texto</span>
          </button>
        )}

        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {isEditingBottomFooter ? (
            <div className="space-y-4 bg-slate-900/80 p-6 rounded-2xl border border-slate-800/80 mb-8 max-w-4xl mx-auto text-left">
              <span className="text-[10px] font-mono uppercase text-amber-400 font-extrabold block">⚙️ EDITOR DE PIE DE PÁGINA (ADMIN)</span>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold">Descripción Izquierda</label>
                  <textarea
                    rows={4}
                    value={bottomFootDesc}
                    onChange={(e) => setBottomFootDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold">Dirección de Oficina</label>
                  <textarea
                    rows={4}
                    value={bottomFootLoc}
                    onChange={(e) => setBottomFootLoc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] text-slate-400 uppercase font-mono font-bold">Texto de Compartir</label>
                  <textarea
                    rows={4}
                    value={bottomFootShare}
                    onChange={(e) => setBottomFootShare(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2 justify-end">
                <button
                  type="button"
                  onClick={handleSaveBottomFooterText}
                  className="py-1.5 px-4 bg-brand-green hover:bg-brand-green/90 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingBottomFooter(false)}
                  className="py-1.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800/80 text-center md:text-left">
              
              {/* Logo Slogan column */}
              <div className="space-y-4">
                <h3 className="font-display font-extrabold text-white text-xl uppercase">
                  FEDELI<span className="text-brand-green">BA</span><span className="text-brand-red">PAM</span>
                </h3>
                <p className="text-xs text-slate-500 font-sans leading-relaxed max-w-sm mx-auto md:mx-0">
                  {safeAppState.bottomFooterDescription || "Federación de Ligas Barriales y Parroquiales de Manabí. Consagrados a promover el deporte comunitario libre de corrupción, impulsando el talento de nuestra patria desde las canchas de barrio."}
                </p>
                <div className="flex justify-center md:justify-start gap-1">
                  <span className="w-5 h-1 bg-brand-green rounded-full"></span>
                  <span className="w-5 h-1 bg-white rounded-full"></span>
                  <span className="w-5 h-1 bg-brand-red rounded-full"></span>
                </div>
              </div>

              {/* Quick Info column */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-widest text-slate-200 font-bold">Oficinas y Sedes</h4>
                <ul className="text-xs space-y-2.5 font-sans">
                  <li className="flex items-start justify-center md:justify-start gap-2">
                    <MapPin className="w-4 h-4 text-brand-green flex-shrink-0 mt-0.5" />
                    <span>{safeAppState.bottomFooterLocation || "Complejo Deportivo La California, Portoviejo, Manabí"}</span>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <Mail className="w-4 h-4 text-brand-red flex-shrink-0" />
                    <span>{safeAppState.contactEmail}</span>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{safeAppState.contactPhone}</span>
                  </li>
                </ul>
              </div>

              {/* Social Links share code */}
              <div className="space-y-4">
                <h4 className="text-xs uppercase font-mono tracking-widest text-slate-200 font-bold">Compartir Plataforma</h4>
                <p className="text-xs text-slate-500 font-sans max-w-xs mx-auto md:mx-0">
                  {safeAppState.bottomFooterShareText || "Ayúdanos a difundir el deporte barrial manabita enviando este portal web directo a tus grupos de WhatsApp."}
                </p>
                <button
                  type="button"
                  onClick={shareOverallPage}
                  className="py-2.5 px-4 w-full md:w-auto bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer mx-auto md:mx-0"
                >
                  🚀 Compartir Link en WhatsApp
                </button>
              </div>

            </div>
          )}
        </div>

        {/* Copyleft credits */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-600">
          <p>© {new Date().getFullYear()} FEDELIBAPAM. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1 justify-center">
            Diseñada por Andrey Design – Colab: FEDELIBAPAM / 2026
          </p>
        </div>
      </footer>

      {/* 7. SCROLL TO TOP FLOATING BUTTON */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.a
            href="#main-landing-view"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 p-3 bg-brand-green hover:bg-brand-red text-white rounded-2xl shadow-2xl transition-colors z-30 flex items-center justify-center cursor-pointer border border-white/20"
            title="Subir de vuelta"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.a>
        )}
      </AnimatePresence>

      {/* 8. SINGLE EXPANDED NEWS MODAL HANDLER */}
      <PublicationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        publication={selectedPublication}
        isAdmin={isAdmin}
        onSave={handleSavePublication}
        editModeInitial={modalEditMode}
        sports={safeAppState.sports || []}
      />

      <ConfirmModal
        isOpen={confirmState.isOpen}
        title={confirmState.title}
        message={confirmState.message}
        confirmLabel={confirmState.confirmLabel}
        onConfirm={confirmState.onConfirm}
        onCancel={() => setConfirmState(prev => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
