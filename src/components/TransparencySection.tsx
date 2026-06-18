import React, { useState } from "react";
import { TransparencyDocument } from "../types";
import { Search, FileText, Download, Trash2, Plus, Calendar, Disc, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import ConfirmModal from "./ConfirmModal";

interface TransparencySectionProps {
  documents: TransparencyDocument[];
  isAdmin: boolean;
  onUpdateDocuments: (docs: TransparencyDocument[]) => void;
}

const CATEGORIES = ["Todos", "Presupuestos", "Estatutos", "Resoluciones", "Actas"];

export default function TransparencySection({
  documents,
  isAdmin,
  onUpdateDocuments
}: TransparencySectionProps) {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingDoc, setIsAddingDoc] = useState(false);

  // Form Fields
  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("Presupuestos");
  const [docSize, setDocSize] = useState("1.5 MB");
  const [docUrl, setDocUrl] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [fileError, setFileError] = useState("");

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

  const filteredDocs = documents.filter((doc) => {
    const matchesCategory =
      selectedCategory === "Todos" || doc.category === selectedCategory;
    const matchesSearch =
      doc.documentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;
    if (!docUrl) {
      setFileError("Por favor, suba un archivo (PDF, Word o Excel) para guardar.");
      return;
    }

    const newDoc: TransparencyDocument = {
      id: `doc-${Date.now()}`,
      documentName: docName.trim(),
      dateReleased: new Date().toISOString().split("T")[0],
      fileSize: docSize || "800 KB",
      category: docCategory,
      url: docUrl,
      originalFileName: uploadedFileName || undefined
    };

    onUpdateDocuments([...documents, newDoc]);
    setIsAddingDoc(false);
    setDocName("");
    setDocUrl("");
    setDocSize("1.5 MB");
    setUploadedFileName("");
    setFileError("");
  };

  const handleDelete = (id: string) => {
    const targetDoc = documents.find(d => d.id === id);
    const docNameText = targetDoc ? targetDoc.documentName : "";
    setConfirmState({
      isOpen: true,
      title: "Eliminar Documento Oficial",
      message: `¿Está seguro de que desea eliminar permanentemente el documento de transparencia "${docNameText}"?`,
      confirmLabel: "Eliminar Documento",
      onConfirm: () => {
        onUpdateDocuments(documents.filter((doc) => doc.id !== id));
        setConfirmState(prev => ({ ...prev, isOpen: false }));
      }
    });
  };

  return (
    <div id="transparencia-seccion" className="bg-slate-50 rounded-3xl p-6 md:p-8 border border-slate-200">
      
      {/* Editorial Title Block */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="inline-flex items-center gap-1 bg-brand-red/10 border border-brand-red/20 px-2.5 py-1 rounded-full text-brand-red text-xs font-mono font-bold uppercase tracking-wider mb-2">
            <Disc className="w-3.5 h-3.5 animate-spin" />
            Acceso Público & Rendición de Cuentas
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-extrabold text-slate-900 tracking-tight">
            Transparencia Institucional
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            En FEDELIBAPAM creemos en la claridad. Publique y verifique resoluciones, informes de presupuestos y estatutos federativos.
          </p>
        </div>

        {/* Add doc button */}
        {isAdmin && (
          <button
            onClick={() => setIsAddingDoc(!isAddingDoc)}
            className="self-start md:self-auto py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
          >
            {isAddingDoc ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4 text-brand-green" />}
            {isAddingDoc ? "Cancelar Registro" : "Subir Documento Oficial"}
          </button>
        )}
      </div>

      {/* Admin sub-form */}
      <AnimatePresence>
        {isAddingDoc && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-8 p-5 md:p-6 bg-white rounded-2xl border border-slate-200 shadow-sm"
          >
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-800 font-mono mb-4 flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-brand-green" />
              Subir Archivo o Resolución Legal
            </h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              {fileError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-xs font-semibold">
                  ⚠️ {fileError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">Nombre Exacto del Documento *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Balance Anual de Tesorería del Ejercicio 2025"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-green text-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-mono font-bold text-slate-500 mb-1">Categoría</label>
                  <select
                    value={docCategory}
                    onChange={(e) => setDocCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-green text-slate-900"
                  >
                    <option value="Presupuestos">Presupuestos / Balances</option>
                    <option value="Estatutos">Estatutos / Reglamentos</option>
                    <option value="Resoluciones">Resoluciones / Cronogramas</option>
                    <option value="Actas">Actas de Sesión</option>
                  </select>
                </div>
              </div>

              {/* Dynamic Document File upload picker */}
              <div className="bg-slate-50 border border-dashed border-slate-300 rounded-2xl p-5 text-center">
                <FileText className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-xs text-slate-700 font-bold mb-1">Cargar Documento Oficial</p>
                <p className="text-[10px] text-slate-400 font-mono mb-3">Formatos admitidos: Word (.doc, .docx), Excel (.xls, .xlsx) o PDF - Máx. 10MB</p>
                
                <label className="inline-block py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer transition-all shadow-md">
                  📁 Elegir Archivo
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 10 * 1024 * 1024) {
                          setFileError("El archivo supera el límite de 10MB de tamaño.");
                          return;
                        }
                        setFileError("");
                        setUploadedFileName(file.name);
                        
                        // auto-populate description
                        if (!docName.trim()) {
                          const lastDot = file.name.lastIndexOf(".");
                          const finalName = lastDot !== -1 ? file.name.substring(0, lastDot) : file.name;
                          setDocName(finalName);
                        }

                        const sizeStr = (file.size / (1024 * 1024)).toFixed(2) + " MB";
                        setDocSize(sizeStr);

                        const reader = new FileReader();
                        reader.onload = (event) => {
                          if (event.target?.result) {
                            setDocUrl(event.target.result as string);
                          }
                         };
                         reader.readAsDataURL(file);
                       }
                     }}
                     className="hidden"
                   />
                </label>

                {uploadedFileName && (
                  <div className="mt-3 text-xs text-brand-green font-mono font-bold bg-emerald-50 rounded-lg p-2 inline-flex items-center gap-1.5 border border-emerald-200">
                    <Check className="w-4.5 h-4.5 text-brand-green" />
                    {uploadedFileName} ({docSize})
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="submit"
                  className="py-2.5 px-5 bg-brand-green hover:bg-brand-green/90 text-white font-mono uppercase tracking-wider text-[11px] font-bold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Publicar Documento Oficial
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter and Search Bar Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Category filters */}
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                selectedCategory === cat
                  ? "bg-brand-red text-white"
                  : "bg-white hover:bg-slate-200 text-slate-700 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input bar */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            placeholder="Buscar documentos oficiales..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 focus:border-brand-green rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-brand-green placeholder-slate-400 text-slate-900"
          />
        </div>
      </div>

      {/* DYNAMIC DOCUMENT GRID */}
      {filteredDocs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredDocs.map((doc) => (
              <motion.div
                key={doc.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-emerald-200 transition-all shadow-sm flex items-start gap-4 justify-between group"
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* File icon with category colored markers */}
                  <div className={`p-3 rounded-xl flex-shrink-0 ${
                    doc.category === "Presupuestos" ? "bg-amber-50 text-amber-600" :
                    doc.category === "Estatutos" ? "bg-purple-50 text-purple-600" :
                    doc.category === "Resoluciones" ? "bg-emerald-50 text-emerald-600" :
                    "bg-blue-50 text-blue-600"
                  }`}>
                    <FileText className="w-6 h-6" />
                  </div>

                  <div className="min-w-0">
                    <span className="inline-block text-[9px] uppercase font-mono tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded font-bold mb-1">
                      {doc.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1 leading-tight mb-1 group-hover:text-brand-green transition-colors">
                      {doc.documentName}
                    </h4>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-brand-green" />
                        {doc.dateReleased}
                      </span>
                      <span>•</span>
                      <span>{doc.fileSize}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {/* Download button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      
                      // Determine the exact extension and mimeType to download the file in its original format
                      let ext = ".pdf";
                      let mimeType = "application/pdf";

                      if (doc.originalFileName) {
                        const lastDotIdx = doc.originalFileName.lastIndexOf(".");
                        if (lastDotIdx !== -1) {
                          const parsedExt = doc.originalFileName.substring(lastDotIdx).toLowerCase();
                          if (parsedExt === ".docx" || parsedExt === ".doc") {
                            ext = ".docx";
                            mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                          } else if (parsedExt === ".xlsx" || parsedExt === ".xls") {
                            ext = ".xlsx";
                            mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                          } else if (parsedExt === ".txt") {
                            ext = ".txt";
                            mimeType = "text/plain;charset=utf-8";
                          } else {
                            ext = parsedExt;
                            mimeType = "application/octet-stream";
                          }
                        }
                      } else {
                        // Check URL mime-type or parsed extension
                        const match = doc.url.match(/^data:([^;]+);/);
                        if (match) {
                          const mime = match[1].toLowerCase();
                          mimeType = mime;
                          if (mime.includes("pdf")) ext = ".pdf";
                          else if (mime.includes("word") || mime.includes("msword") || mime.includes("officedocument.wordprocessingml")) ext = ".docx";
                          else if (mime.includes("excel") || mime.includes("spreadsheet") || mime.includes("officedocument.spreadsheetml")) ext = ".xlsx";
                          else if (mime.includes("plain") || mime.includes("text")) ext = ".txt";
                        } else {
                          // Remote URL, check extension
                          const lowerUrl = doc.url.toLowerCase();
                          if (lowerUrl.endsWith(".pdf")) {
                            ext = ".pdf";
                            mimeType = "application/pdf";
                          } else if (lowerUrl.endsWith(".docx") || lowerUrl.endsWith(".doc")) {
                            ext = ".docx";
                            mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                          } else if (lowerUrl.endsWith(".xlsx") || lowerUrl.endsWith(".xls")) {
                            ext = ".xlsx";
                            mimeType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                          } else if (lowerUrl.endsWith(".txt")) {
                            ext = ".txt";
                            mimeType = "text/plain;charset=utf-8";
                          }
                        }
                      }

                      let finalDownloadName = doc.documentName;
                      if (!finalDownloadName.toLowerCase().endsWith(ext.toLowerCase())) {
                        finalDownloadName += ext;
                      }

                      if (doc.url.startsWith("data:")) {
                        // For base64 loaded files
                        const element = document.createElement("a");
                        element.href = doc.url;
                        element.download = finalDownloadName;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      } else {
                        // Download preloaded or mock resources in identical format
                        let content = "";
                        if (ext === ".pdf") {
                          content = `%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >>\nendobj\n4 0 obj\n<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>\nendobj\n5 0 obj\n<< /Length 120 >>\nstream\nBT\n/F1 14 Tf\n50 750 Td\n(FEDELIBAPAM - TRANSPARENCIA INSTITUCIONAL) Tj\n0 -20 Td\n(Documento: ${doc.documentName}) Tj\n0 -20 Td\n(Categoria: ${doc.category}) Tj\n0 -20 Td\n(Fecha de Emision: ${doc.dateReleased}) Tj\n0 -20 Td\n(Tamanio del Archivo: ${doc.fileSize}) Tj\n0 -40 Td\n(Este documento cumple con los estatutos de la Federacion de Manabi.) Tj\nET\nendstream\nendobj\nxref\n0 6\n0000000000 65535 f\n0000000009 00000 n\n0000000056 00000 n\n0000000111 00000 n\n0000000238 00000 n\n0000000307 00000 n\ntrailer\n<< /Size 6 /Root 1 0 R >>\nstartxref\n478\n%%EOF`;
                        } else {
                          content = `FEDELIBAPAM - TRANSPARENCIA INSTITUCIONAL\n\nEste es un documento oficial para fines de transparencia institucional:\nDocumento: ${doc.documentName}\nCategoría: ${doc.category}\nFecha de Emisión: ${doc.dateReleased}\nTamaño del Archivo: ${doc.fileSize}\n\nLa información e informes descritos en este portal cumplen estrictamente con los estatutos de la Federación de Ligas Barriales y Parroquiales de Manabí (FEDELIBAPAM 2026).`;
                        }

                        const element = document.createElement("a");
                        const fileBlob = new Blob([content], { type: mimeType });
                        element.href = URL.createObjectURL(fileBlob);
                        element.download = finalDownloadName;
                        document.body.appendChild(element);
                        element.click();
                        document.body.removeChild(element);
                      }
                    }}
                    title="Descargar documento de transparencia"
                    className="p-2 bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-brand-green rounded-xl border border-slate-200 hover:border-emerald-200 transition-all flex items-center justify-center cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {/* Admin Delete doc */}
                  {isAdmin && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDelete(doc.id);
                      }}
                      title="Eliminar de transparencia"
                      className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 rounded-xl border border-transparent hover:border-rose-200 transition-all cursor-pointer flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-slate-200">
          <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-xs text-slate-500 font-mono">No se encontraron archivos oficiales para esta búsqueda.</p>
        </div>
      )}

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
