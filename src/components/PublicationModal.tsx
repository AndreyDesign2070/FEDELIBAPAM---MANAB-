import React, { useState, useEffect } from "react";
import { Publication, SportDefinition } from "../types";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, Eye, EyeOff, Film, Image as ImageIcon, Calendar, Tag, Flame, Plus, Share2, Play } from "lucide-react";

interface PublicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  publication?: Publication | null; // If null/undefined, we are CREATING a new article
  isAdmin: boolean;
  onSave: (pub: Publication) => void;
  editModeInitial?: boolean;
  sports?: SportDefinition[];
}

const DEFAULT_IMAGES = [
  { label: "Fútbol / Cancha", url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800" },
  { label: "Ecuavoley / Redes", url: "https://images.unsplash.com/photo-1628891890467-b79f2c879d74?q=80&w=800" },
  { label: "Básquet / Balón", url: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800" },
  { label: "Atletismo / Trofeos", url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800" },
  { label: "Comunidad / Femenino", url: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800" }
];

const DEFAULT_SPORTS_FALLBACK: SportDefinition[] = [
  { id: "sp-1", name: "Fútbol", categories: ["Sénior Extra", "Femenino Libre", "Infantil Sub-12", "Juvenil Sub-17", "Máster de Oro (40+)", "Comunitaria Parroquial"] },
  { id: "sp-2", name: "Ecuavoley", categories: ["Sénior Libre", "Máster 50", "Doble Femenino"] },
  { id: "sp-3", name: "Básquetbol", categories: ["Sénior Libre", "Femenino Unificado", "Comunitario Masculino"] },
  { id: "sp-4", name: "Atletismo", categories: ["General Libre", "Juvenil Sub-15", "Infantil"] }
];

export default function PublicationModal({
  isOpen,
  onClose,
  publication,
  isAdmin,
  onSave,
  editModeInitial = false,
  sports
}: PublicationModalProps) {
  const [isEditing, setIsEditing] = useState(editModeInitial);

  const activeSportsList = sports && sports.length > 0 ? sports : DEFAULT_SPORTS_FALLBACK;
  const sportsNamesList = activeSportsList.map(s => s.name);
  
  // Form fields
  const [title, setTitle] = useState("");
  const [sport, setSport] = useState("Fútbol");
  const [customSport, setCustomSport] = useState("");
  const [category, setCategory] = useState("Sénior Extra");
  const [customCategory, setCustomCategory] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [validationError, setValidationError] = useState("");

  useEffect(() => {
    if (isOpen) {
      if (publication) {
        setTitle(publication.title);
        if (sportsNamesList.includes(publication.sport)) {
          setSport(publication.sport);
          setCustomSport("");
        } else {
          setSport("Otro");
          setCustomSport(publication.sport);
        }

        const selectedSportDef = activeSportsList.find(s => s.name === publication.sport);
        const validCategories = selectedSportDef ? selectedSportDef.categories : [];

        if (validCategories.includes(publication.category)) {
          setCategory(publication.category);
          setCustomCategory("");
        } else {
          setCategory("Otro");
          setCustomCategory(publication.category);
        }

        setContent(publication.content);
        setImageUrl(publication.imageUrl);
        setVideoUrl(publication.videoUrl || "");
        setIsPinned(!!publication.isPinned);
        setIsEditing(editModeInitial);
      } else {
        // Create Mode clean values
        setTitle("");
        const defaultSport = sportsNamesList[0] || "Fútbol";
        setSport(defaultSport);
        setCustomSport("");
        
        const defaultSportDef = activeSportsList.find(s => s.name === defaultSport);
        const defaultCategory = defaultSportDef?.categories[0] || "General Libre";
        setCategory(defaultCategory);
        setCustomCategory("");
        setContent("");
        setImageUrl(DEFAULT_IMAGES[0].url);
        setVideoUrl("");
        setIsPinned(false);
        setIsEditing(true); // Must edit if is creating!
      }
      setValidationError("");
    }
  }, [isOpen, publication, editModeInitial]);

  // Adjust categories automatically when selected sport changes
  useEffect(() => {
    if (isOpen) {
      const selectedSportDef = activeSportsList.find(s => s.name === sport);
      if (selectedSportDef && sport !== "Otro") {
        if (!selectedSportDef.categories.includes(category)) {
          setCategory(selectedSportDef.categories[0] || "General Libre");
        }
      }
    }
  }, [sport, isOpen, activeSportsList]);

  if (!isOpen) return null;

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) {
      setValidationError("El título y la imagen de cabecera son obligatorios.");
      return;
    }
    if (!content.trim()) {
      setValidationError("agrege una breve descripción");
      return;
    }

    const resolvedSport = sport === "Otro" ? (customSport.trim() || "MultiDeporte") : sport;
    const resolvedCategory = category === "Otro" ? (customCategory.trim() || "General") : category;

    const savedPub: Publication = {
      id: publication?.id || `pub-${Date.now()}`,
      title: title.trim(),
      date: publication?.date || new Date().toISOString().split("T")[0],
      sport: resolvedSport,
      category: resolvedCategory,
      content: content.trim(),
      imageUrl: imageUrl.trim(),
      videoUrl: videoUrl.trim() || undefined,
      viewsCount: publication?.viewsCount || Math.floor(Math.random() * 50) + 12,
      isPinned: isPinned
    };

    onSave(savedPub);
    onClose();
  };

  const shareOnWhatsApp = () => {
    if (!publication) return;
    const pageUrl = window.location.href;
    const text = `*FEDELIBAPAM - Transparencia Deportiva*\n\n⚽ *${publication.title}*\n\n📅 Fecha: ${publication.date}\n🏆 Deporte: ${publication.sport} (${publication.category})\n\n"${publication.content.substring(0, 160)}..."\n\n🔗 Ver más en la web oficial:\n${pageUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]"
      >
        {/* Modal Toolbar Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand-green"></span>
            <span className="w-3 h-3 rounded-full bg-white"></span>
            <span className="w-3 h-3 rounded-full bg-brand-red"></span>
            <h2 className="text-sm font-mono tracking-widest uppercase text-emerald-400 font-bold ml-2">
              {publication ? (isEditing ? "Editar Publicación" : "Noticia / Actividad") : "Nueva Publicación"}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all focus:outline-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="overflow-y-auto p-6 md:p-8 flex-1">
          
          {/* VIEW MODE */}
          {!isEditing && publication && (
            <div className="space-y-6">
              {/* Media Banner */}
              <div className="relative rounded-2xl overflow-hidden h-64 md:h-80 bg-slate-100">
                <img 
                  src={imageUrl} 
                  alt={title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-slate-950/10 to-transparent"></div>
                
                {publication.isPinned && (
                  <span className="absolute top-4 left-4 bg-brand-red text-white text-xs font-mono font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 animate-pulse" />
                    Destacado Oficial
                  </span>
                )}

                <span className="absolute bottom-4 left-4 bg-brand-green text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider shadow-md">
                  {publication.sport}
                </span>
              </div>

              {/* Title & Metadata indicators */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-brand-green" />
                    Publicado: {publication.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-brand-red" />
                    Categoría: {publication.category}
                  </span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 font-bold ml-auto">
                    ID: {publication.id}
                  </span>
                </div>
                
                <h1 className="text-2xl md:text-3xl font-display font-extrabold text-slate-950 tracking-tight leading-tight">
                  {title}
                </h1>
              </div>

              {/* Video Player Box if available */}
              {videoUrl && (
                <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/80">
                  <h4 className="text-xs font-bold font-mono text-brand-green uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <Film className="w-4 h-4 text-brand-red" />
                    Video O Enlace De Actividad Asociada:
                  </h4>
                  <div className="flex items-center justify-between p-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                    <span className="text-xs text-slate-500 font-mono truncate max-w-sm">{videoUrl}</span>
                    <a 
                      href={videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="px-3 py-1 bg-brand-green hover:bg-brand-green/90 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Ver Reproducción</span>
                    </a>
                  </div>
                </div>
              )}

              {/* Article Content Text body */}
              <div className="p-1 text-slate-700 space-y-4 max-w-none text-sm md:text-base leading-relaxed whitespace-pre-wrap font-sans selection:bg-brand-green/10">
                {content}
              </div>

              {/* Bottom Drawer Actions */}
              <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4">
                <button
                  onClick={shareOnWhatsApp}
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg transition-colors flex items-center gap-2"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Compartir con WhatsApp</span>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                  >
                    Editar Contenido
                  </button>
                )}
              </div>
            </div>
          )}

          {/* EDIT MODE (Also default for creating new publications) */}
          {(!publication || isEditing) && (
            <form onSubmit={handleSaveSubmit} className="space-y-5 text-slate-900">
              
              {validationError && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
                  {validationError}
                </div>
              )}

              {/* Title input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest font-mono mb-1">
                  Título de la Noticia / Actividad *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ej: Gran final de la liga parroquial Colón..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-green rounded-xl text-sm focus:outline-none transition-all placeholder-slate-400 font-sans"
                />
              </div>

              {/* Sport & Category selections */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Sport */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest font-mono mb-1">
                    Deporte / Competencia
                  </label>
                  <select
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-green text-slate-900 font-medium"
                  >
                    {[...sportsNamesList, "Otro"].map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {sport === "Otro" && (
                    <input
                      type="text"
                      required
                      placeholder="Escriba el deporte"
                      value={customSport}
                      onChange={(e) => setCustomSport(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs mt-2 focus:outline-none focus:border-brand-green"
                    />
                  )}
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest font-mono mb-1">
                    Categoría / Grupo
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-green text-slate-900 font-medium"
                  >
                    {[...(activeSportsList.find(s => s.name === sport)?.categories || []), "Otro"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  {category === "Otro" && (
                    <input
                      type="text"
                      required
                      placeholder="Escriba la categoría"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs mt-2 focus:outline-none focus:border-brand-green"
                    />
                  )}
                </div>
              </div>

              {/* Image Selector from Local Gallery */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest font-mono mb-1.5 flex items-center gap-1">
                  <ImageIcon className="w-4 h-4 text-brand-green" />
                  Seleccionar Fotografía de la Galería *
                </label>
                
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all">
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    {/* Current or base64 preview */}
                    <div className="w-24 h-24 bg-slate-200 rounded-xl overflow-hidden flex-shrink-0 border border-slate-300">
                      {imageUrl ? (
                        <img src={imageUrl} alt="Vista previa" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-slate-400 font-mono">Sin foto</div>
                      )}
                    </div>
                    
                    <div className="flex-1 w-full text-center sm:text-left">
                      <label className="inline-block py-2 px-4 bg-slate-950 hover:bg-slate-850 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-md">
                        📁 Seleccionar Imagen
                        <input
                          type="file"
                          accept="image/png, image/jpeg, image/jpg"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  setImageUrl(event.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                      </label>
                      <p className="text-[10px] text-slate-500 mt-2 font-mono">
                        Se admite formatos PNG, JPG o JPEG. La imagen se guardará localmente.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest font-mono mb-1">
                  Enlace de Video o Enlace Adicional (Opcional)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
                    <Film className="w-4 h-4" />
                  </div>
                  <input
                    type="url"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="Ej: https://youtube.com/watch?v=... o video link"
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 focus:border-brand-green rounded-xl text-sm focus:outline-none transition-all placeholder-slate-400"
                  />
                </div>
              </div>

              {/* Pinned switch */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-widest font-mono flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-brand-red" />
                    Destacar Publicación
                  </span>
                  <p className="text-[11px] text-slate-500">Aparecerá en el banner superior y encabezará las noticias.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPinned(!isPinned)}
                  className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 ${isPinned ? "bg-brand-green" : "bg-slate-300"}`}
                >
                  <div className={`w-4.5 h-4.5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${isPinned ? "translate-x-5.5" : "translate-x-0"}`}></div>
                </button>
              </div>

              {/* Content text-editor */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-widest font-mono mb-1">
                  Descripción / Reportaje de la actividad *
                </label>
                <textarea
                  required
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Redacte la noticia, marcador, incidencias del juego, etc. Recuerde ser claro para mantener la transparencia institucional."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 focus:border-brand-green rounded-2xl text-sm focus:outline-none transition-all placeholder-slate-400"
                ></textarea>
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3.5">
                {publication && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-medium transition-all"
                  >
                    Cancelar Edición
                  </button>
                )}
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-md active:scale-97 transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4 text-brand-green" />
                  <span>Guardar Publicación</span>
                </button>
              </div>

            </form>
          )}

        </div>
      </motion.div>
    </div>
  );
}
