import React from "react";
import { Publication } from "../types";
import { motion } from "motion/react";
import { Share2, Calendar, Tag, Flame, Edit, Trash2, Eye, Play, ExternalLink } from "lucide-react";

interface PublicationCardProps {
  key?: string;
  publication: Publication;
  isAdmin: boolean;
  onEdit: (pub: Publication) => void;
  onDelete: (id: string) => void;
  onViewDetails: (pub: Publication) => void;
}

export default function PublicationCard({
  publication,
  isAdmin,
  onEdit,
  onDelete,
  onViewDetails
}: PublicationCardProps) {
  const { id, title, date, sport, category, content, imageUrl, videoUrl, viewsCount, isPinned } = publication;

  // Format a wonderful WhatsApp message as requested: "la landing debe poder compartirse con las demas personas enviando un link al whatsapp"
  const shareOnWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering details modal if clicked on share

    const pageUrl = window.location.href;
    const emojiSport = sport.toLowerCase().includes("fútbol") || sport.toLowerCase().includes("futbol")
      ? "⚽" 
      : sport.toLowerCase().includes("vole") || sport.toLowerCase().includes("ecuavoley")
      ? "🏐"
      : sport.toLowerCase().includes("básquet") || sport.toLowerCase().includes("basquet")
      ? "🏀"
      : "🏆";

    const text = `*FEDELIBAPAM - Deporte con Transparencia*\n\n${emojiSport} *${title}*\n\n📅 _Fecha: ${date}_\n📌 _Deporte/Categoría: ${sport} - ${category}_\n\n"${content.substring(0, 160)}..."\n\n🔗 Mira la publicación completa y más detalles deportivos aquí:\n${pageUrl}`;
    
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100 flex flex-col group h-full relative transition-all"
    >
      {/* Pinned Marker Badge */}
      {isPinned && (
        <span className="absolute top-3 left-3 bg-brand-red text-white text-[10px] uppercase font-mono font-bold tracking-widest px-2.5 py-1 rounded-full z-10 shadow-md flex items-center gap-1">
          <Flame className="w-3 h-3 animate-pulse text-white" />
          Destacado
        </span>
      )}

      {/* Media Cover Layer */}
      <div 
        className="w-full h-48 md:h-52 overflow-hidden relative bg-slate-100 cursor-pointer"
        onClick={() => onViewDetails(publication)}
      >
        <img
          src={imageUrl}
          alt={title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-slate-950/20 group-hover:bg-slate-950/10 transition-colors"></div>

        {/* Video Icon overlay if video URL exists */}
        {videoUrl && (
          <div className="absolute bottom-3 right-3 w-10 h-10 bg-brand-red/90 text-white rounded-full flex items-center justify-center backdrop-blur-sm shadow-md group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 fill-current ml-0.5" />
          </div>
        )}

        {/* Floating sports badge */}
        <span className="absolute bottom-3 left-3 bg-brand-green text-white text-xs font-semibold px-3 py-1 rounded-lg shadow-md uppercase tracking-wider">
          {sport}
        </span>
      </div>

      {/* Main Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Metadata indicators */}
          <div className="flex items-center gap-4 text-xs text-slate-500 font-mono mb-2">
            <span className="flex items-center gap-1 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-brand-green" />
              {date}
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Tag className="w-3.5 h-3.5 text-brand-red" />
              {category}
            </span>
          </div>

          {/* Publication Title */}
          <h3 
            className="text-lg font-display font-bold text-slate-950 hover:text-brand-green tracking-tight leading-snug cursor-pointer transition-colors mb-3 line-clamp-2"
            onClick={() => onViewDetails(publication)}
          >
            {title}
          </h3>

          {/* Content Description snippet */}
          <p className="text-sm text-slate-600 line-clamp-3 mb-5 font-sans leading-relaxed">
            {content}
          </p>
        </div>

        {/* Footer Actions / Icons Bar */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* View details */}
            <button
              onClick={() => onViewDetails(publication)}
              className="text-xs text-slate-600 hover:text-brand-green font-semibold transition-colors flex items-center gap-1.5 py-1 px-2.5 bg-slate-50 hover:bg-emerald-50 rounded-lg border border-slate-200 hover:border-emerald-200"
            >
              <span>Ver Completo</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {/* General Visitors and readers can share directly onto WhatsApp */}
            <button
              onClick={shareOnWhatsApp}
              title="Compartir por WhatsApp"
              className="relative text-xs font-bold text-white bg-green-600 hover:bg-green-700 active:bg-green-800 py-1 px-3 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir</span>
            </button>
          </div>

          {/* Leftside statistics */}
          <span className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
            <Eye className="w-3.5 h-3.5" />
            {viewsCount} vistas
          </span>
        </div>
      </div>

      {/* Admin Operations Overlord */}
      {isAdmin && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-xl z-20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(publication);
            }}
            title="Editar Publicación"
            className="p-1.5 hover:bg-brand-green/30 text-emerald-400 rounded-lg transition-colors border border-transparent hover:border-emerald-500/50"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(id);
            }}
            title="Eliminar Publicación"
            className="p-1.5 hover:bg-rose-500/30 text-rose-400 rounded-lg transition-colors border border-transparent hover:border-rose-500/50"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.article>
  );
}
