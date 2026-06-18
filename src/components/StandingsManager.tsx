import React, { useState } from "react";
import { SportDefinition } from "../types";
import { Plus, Trash2, Award, Tag, Check, X, Shield, PlusCircle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ConfirmModal from "./ConfirmModal";

interface StandingsManagerProps {
  sports: SportDefinition[];
  isAdmin: boolean;
  onUpdateSports: (updated: SportDefinition[]) => void;
}

export default function StandingsManager({
  sports,
  isAdmin,
  onUpdateSports
}: StandingsManagerProps) {
  // Local states for controlling the addition of sports and categories
  const [isAddingSport, setIsAddingSport] = useState(false);
  const [newSportName, setNewSportName] = useState("");

  const [addingCategorySportId, setAddingCategorySportId] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  // State for controlling custom Confirm Modal
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

  // Handler for adding a new Sport
  const handleAddSportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSportName.trim()) return;

    // Check for duplicate sport names
    if (sports.some(s => s.name.trim().toLowerCase() === newSportName.trim().toLowerCase())) {
      alert("Este deporte ya existe.");
      return;
    }

    const newSport: SportDefinition = {
      id: `sp-${Date.now()}`,
      name: newSportName.trim(),
      categories: ["General Libre"] // Default initial category
    };

    onUpdateSports([...sports, newSport]);
    setNewSportName("");
    setIsAddingSport(false);
  };

  // Handler for deleting a Sport
  const handleDeleteSport = (id: string, name: string) => {
    setConfirmState({
      isOpen: true,
      title: "Eliminar Deporte",
      message: `¿Está seguro de que desea eliminar el deporte "${name}"? Esta acción borrará permanentemente todas sus categorías correspondientes.`,
      confirmLabel: "Eliminar de todas formas",
      onConfirm: () => {
        onUpdateSports(sports.filter(s => s.id !== id));
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  // Handler for adding a category to a specific sport
  const handleAddCategorySubmit = (sportId: string) => {
    if (!newCategoryName.trim()) return;

    const updated = sports.map((s) => {
      if (s.id === sportId) {
        // Prevent duplicate category
        if (s.categories.some(cat => cat.trim().toLowerCase() === newCategoryName.trim().toLowerCase())) {
          alert("Esta categoría ya existe en este deporte.");
          return s;
        }
        return {
          ...s,
          categories: [...s.categories, newCategoryName.trim()]
        };
      }
      return s;
    });

    onUpdateSports(updated);
    setNewCategoryName("");
    setAddingCategorySportId(null);
  };

  // Handler for deleting a category from a sport
  const handleDeleteCategory = (sportId: string, categoryToDelete: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    setConfirmState({
      isOpen: true,
      title: "Eliminar Categoría",
      message: `¿Está seguro de que desea eliminar la categoría "${categoryToDelete}" de esta disciplina?`,
      confirmLabel: "Eliminar Categoría",
      onConfirm: () => {
        const updated = sports.map((s) => {
          if (s.id === sportId) {
            const filtered = s.categories.filter(cat => cat !== categoryToDelete);
            return {
              ...s,
              categories: filtered.length > 0 ? filtered : ["General Libre"]
            };
          }
          return s;
        });

        onUpdateSports(updated);
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div id="deportes-manager-card" className="bg-white rounded-3xl p-5 md:p-8 shadow-sm border border-slate-100">
      
      {/* Header and Title block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span className="text-xs font-mono text-emerald-600 uppercase tracking-wider font-bold">Catálogo Deportivo</span>
          </div>
          <h2 className="text-xl md:text-2xl font-display font-extrabold text-slate-900 tracking-tight">
            Deportes y Categorías Oficiales
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Gestión oficial de disciplinas reguladas por FEDELIBAPAM. Estas categorías alimentan automáticamente las opciones de publicación de noticias.
          </p>
        </div>

        {/* Admin actions (Create new Sport) */}
        {isAdmin && !isAddingSport && (
          <button
            onClick={() => setIsAddingSport(true)}
            className="py-2.5 px-4 bg-slate-950 hover:bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-wide transition-all shadow-md flex items-center justify-center gap-1.5 active:scale-97"
          >
            <Plus className="w-4 h-4 text-emerald-400" />
            <span>Agregar Deporte</span>
          </button>
        )}
      </div>

      {/* Form: Add New Sport */}
      {isAddingSport && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 mb-6"
        >
          <form onSubmit={handleAddSportSubmit} className="space-y-3">
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <div className="flex-1">
                <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">Nombre de la nueva disciplina deportiva</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Fútbol Sala, Tenis de Mesa, Ecuavoley..."
                  value={newSportName}
                  onChange={(e) => setNewSportName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-500 text-slate-900"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="submit"
                  className="flex-1 sm:flex-initial py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Confirmar
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddingSport(false)}
                  className="py-2 px-3 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      )}

      {/* Sports Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {sports.map((sp) => (
          <div
            key={sp.id}
            className="p-5 rounded-2xl border border-slate-100 hover:border-slate-200/80 bg-slate-50/40 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header inside specific Sport Item */}
              <div className="flex items-center justify-between mb-3.5 pb-2.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Award className="w-4 h-4" />
                  </div>
                  <h3 className="font-display font-extrabold text-sm text-slate-900 uppercase tracking-tight">
                    {sp.name}
                  </h3>
                </div>

                {/* Delete Sport action */}
                {isAdmin && (
                  <button
                    onClick={() => handleDeleteSport(sp.id, sp.name)}
                    title="Eliminar Deporte"
                    className="p-1 mb-0.5 text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Categorias Sub list as Badge elements */}
              <div className="space-y-2">
                <div className="text-[10px] uppercase font-mono tracking-wider font-bold text-slate-400 flex items-center gap-1">
                  <Tag className="w-3 h-3 text-emerald-500" /> Categorías / Grupos Oficiales:
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {sp.categories.map((cat) => (
                    <div
                      key={cat}
                      className="px-2.5 py-1 bg-white border border-slate-200/80 rounded-lg text-[11px] font-sans text-slate-700 flex items-center gap-1.5"
                    >
                      <span>{cat}</span>
                      {isAdmin && (
                        <button
                          type="button"
                          onClick={(e) => handleDeleteCategory(sp.id, cat, e)}
                          title="Eliminar Categoría"
                          className="w-4 h-4 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors flex items-center justify-center cursor-pointer ml-1"
                        >
                          <X className="w-2.5 h-2.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admin trigger to append custom category */}
            {isAdmin && (
              <div className="mt-4 pt-3 border-t border-slate-100/80">
                {addingCategorySportId === sp.id ? (
                  <div className="flex gap-1.5 items-center">
                    <input
                      type="text"
                      placeholder="Nueva Categoría..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="flex-1 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleAddCategorySubmit(sp.id)}
                      className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setAddingCategorySportId(null);
                        setNewCategoryName("");
                      }}
                      className="p-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddingCategorySportId(sp.id);
                      setNewCategoryName("");
                    }}
                    className="text-[10px] font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors font-mono uppercase"
                  >
                    <PlusCircle className="w-3.5 h-3.5" /> Agregar Categoría
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
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
