import React, { useState } from "react";
import { AffiliatedLeague } from "../types";
import { Plus, Trash2, Edit, Check, X, ShieldAlert, Award, Hash, MapPin, Calendar, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ConfirmModal from "./ConfirmModal";

interface LeaguesManagerProps {
  leagues: AffiliatedLeague[];
  isAdmin: boolean;
  onUpdateLeagues: (leagues: AffiliatedLeague[]) => void;
}

const CANTONS = [
  "Portoviejo", "Manta", "Chone", "Montecristi", "Jipijapa", "Calceta (Bolívar)",
  "Bahía de Caráquez (Sucre)", "Pedernales", "El Carmen", "Paján", "Jaramijó", "Rocafuerte"
];

export default function LeaguesManager({
  leagues,
  isAdmin,
  onUpdateLeagues
}: LeaguesManagerProps) {
  const [isAddingLeague, setIsAddingLeague] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [location, setLocation] = useState("Portoviejo");
  const [teamsCount, setTeamsCount] = useState(16);
  const [president, setPresident] = useState("");
  const [founded, setFounded] = useState("2000");

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

  // Inline Editing States
  const [editingLeagueId, setEditingLeagueId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editTeamsCount, setEditTeamsCount] = useState(16);
  const [editPresident, setEditPresident] = useState("");
  const [editFounded, setEditFounded] = useState("2000");

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !president.trim()) return;

    const newLeague: AffiliatedLeague = {
      id: `leg-${Date.now()}`,
      name: name.trim(),
      location: location,
      activeTeams: Number(teamsCount) || 12,
      president: president.trim(),
      foundedYear: founded || "2005"
    };

    onUpdateLeagues([...leagues, newLeague]);
    setIsAddingLeague(false);
    setName("");
    setPresident("");
  };

  const startEditing = (leg: AffiliatedLeague) => {
    setEditingLeagueId(leg.id);
    setEditName(leg.name);
    setEditLocation(leg.location);
    setEditTeamsCount(leg.activeTeams);
    setEditPresident(leg.president);
    setEditFounded(leg.foundedYear);
  };

  const handleUpdateSave = (id: string) => {
    if (!editName.trim() || !editPresident.trim()) return;
    const updated = leagues.map((leg) => {
      if (leg.id === id) {
        return {
          ...leg,
          name: editName.trim(),
          location: editLocation,
          activeTeams: Number(editTeamsCount) || 12,
          president: editPresident.trim(),
          foundedYear: editFounded.trim() || "2000"
        };
      }
      return leg;
    });
    onUpdateLeagues(updated);
    setEditingLeagueId(null);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setConfirmState({
      isOpen: true,
      title: "Confirmar Acción",
      message: "¿estas seguro de elimina esta liga?",
      confirmLabel: "Desafiliar Liga",
      onConfirm: () => {
        onUpdateLeagues(leagues.filter((leg) => leg.id !== id));
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div id="ligas-afiliadas" className="bg-white rounded-3xl p-6 md:p-8 border border-slate-100 shadow-sm">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs text-brand-red font-mono uppercase tracking-widest font-bold mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-green"></span>
            Organizaciones Afiliadas
          </div>
          <h2 className="text-2xl font-display font-extrabold text-slate-950 tracking-tight">
            Ligas Barriales & Parroquiales
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            FEDELIBAPAM agrupa a las ligas de mayor trayectoria comunitaria de Manabí. Conozca las delegaciones de cada cantón.
          </p>
        </div>

        {/* Add League Trigger */}
        {isAdmin && (
          <button
            onClick={() => setIsAddingLeague(!isAddingLeague)}
            className="self-start md:self-auto py-2.5 px-4 bg-brand-green hover:bg-brand-green/90 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
          >
            {isAddingLeague ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {isAddingLeague ? "Cerrar" : "Vincular Nueva Liga"}
          </button>
        )}
      </div>

      {/* Admin Panel to Add League */}
      <AnimatePresence>
        {isAddingLeague && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-200"
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 font-mono mb-4">Ingresar Ficha de Liga Barrial</h3>
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">Nombre Oficial de la Liga *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Liga Barrial Colón de Portoviejo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-green text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">Cantón / Ubicación</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-green text-slate-900"
                  >
                    {CANTONS.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">Número de Clubes Afiliados</label>
                  <input
                    type="number"
                    value={teamsCount}
                    onChange={(e) => setTeamsCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-green text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">Presidente Actual *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Ing. Carlos Mendoza"
                    value={president}
                    onChange={(e) => setPresident(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-green text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">Año de Fundación</label>
                  <input
                    type="text"
                    placeholder="Ej: 1998"
                    value={founded}
                    onChange={(e) => setFounded(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-green text-slate-900"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-slate-900 hover:bg-slate-800 text-white font-mono uppercase tracking-wider text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4 text-brand-green" />
                  Vincular Liga Barrial
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Grid of Leagues cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {leagues.map((leg) => {
          const isEditingThis = editingLeagueId === leg.id;

          return (
            <div
              key={leg.id}
              className={`p-5 rounded-3xl border transition-all shadow-sm flex flex-col justify-between relative group ${
                isEditingThis ? "border-brand-green bg-slate-50/55 shadow-md" : "border-slate-200/80 hover:border-brand-green/30 bg-white hover:shadow-md"
              }`}
            >
              {isEditingThis ? (
                // EDITING MODE CARD FORM
                <div className="space-y-3.5 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[9px] uppercase font-mono tracking-widest text-brand-green font-extrabold block">✏️ Editar Ficha de Liga</span>
                    
                    <div>
                      <label className="block text-[9px] uppercase font-mono font-bold text-slate-500 mb-0.5">Nombre Oficial</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-green"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-mono font-bold text-slate-500 mb-0.5">Cantón / Sede</label>
                      <select
                        value={editLocation}
                        onChange={(e) => setEditLocation(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-brand-green"
                      >
                        {CANTONS.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-slate-500 mb-0.5">Clubes</label>
                        <input
                          type="number"
                          value={editTeamsCount}
                          onChange={(e) => setEditTeamsCount(Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase font-mono font-bold text-slate-500 mb-0.5">Fundada</label>
                        <input
                          type="text"
                          value={editFounded}
                          onChange={(e) => setEditFounded(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase font-mono font-bold text-slate-500 mb-0.5">Presidente</label>
                      <input
                        type="text"
                        value={editPresident}
                        onChange={(e) => setEditPresident(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-slate-200/60 mt-3">
                    <button
                      onClick={() => handleUpdateSave(leg.id)}
                      className="flex-1 py-1 px-2.5 bg-brand-green hover:bg-brand-green/90 text-white text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Guardar</span>
                    </button>
                    <button
                      onClick={() => setEditingLeagueId(null)}
                      className="flex-1 py-1 px-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancelar</span>
                    </button>
                  </div>
                </div>
              ) : (
                // STANDARD DISPLAY CARD
                <div className="flex flex-col justify-between h-full">
                  <div>
                    {/* Card visual elements with Manabi flag color strip (Green/White/Red) */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2.5 bg-emerald-50 rounded-xl text-brand-green">
                        <Award className="w-5 h-5" />
                      </div>
                      <div className="flex gap-0.5">
                        <span className="w-2 h-1 bg-brand-green"></span>
                        <span className="w-2 h-1 bg-white"></span>
                        <span className="w-2 h-1 bg-brand-red"></span>
                      </div>
                    </div>

                    <h3 className="font-display font-extrabold text-slate-900 tracking-tight leading-tight group-hover:text-brand-green transition-colors mb-4">
                      {leg.name}
                    </h3>

                    {/* Stats entries */}
                    <div className="space-y-2.5 text-xs text-slate-600 font-sans border-t border-slate-100 pt-3.5 mb-5">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-brand-green" /> Cantón:
                        </span>
                        <span className="font-semibold text-slate-900">{leg.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <Hash className="w-3.5 h-3.5 text-brand-red" /> Clubes Activos:
                        </span>
                        <span className="font-bold text-brand-green font-mono">{leg.activeTeams} clubes</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <User className="w-3.5 h-3.5 text-slate-400" /> Presidente:
                        </span>
                        <span className="font-medium text-slate-800 line-clamp-1">{leg.president}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-mono uppercase tracking-wider text-[10px] flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" /> Fundada:
                        </span>
                        <span className="font-mono text-slate-500">{leg.foundedYear}</span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Actions (Edit + Delete) */}
                  {isAdmin && (
                    <div className="flex gap-2 mt-2 w-full pt-2 border-t border-slate-100">
                      <button
                        onClick={() => startEditing(leg)}
                        className="flex-1 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                      >
                        <Edit className="w-3.5 h-3.5 text-brand-green" />
                        <span>Editar</span>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(leg.id, e)}
                        className="flex-1 py-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-100 hover:border-rose-200 text-rose-600 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Desafiliar Liga</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

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
