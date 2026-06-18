import { FEDELIBAPAMState } from "./types";

export const INITIAL_STATE: FEDELIBAPAMState = {
  shieldUrl: "https://images.unsplash.com/photo-1518152006812-edab29b069ac?q=80&w=200&auto=format&fit=crop&q=60", // Gold-green sport badge abstract, or placeholder
  coverUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200&auto=format&fit=crop", // Stadium stadium lights with crowd, great sports feel
  introductionText: "Bienvenidos al portal oficial de FEDELIBAPAM. Somos el órgano rector que unifica, fomenta y organiza la actividad deportiva recreativa barrial y parroquial en la provincia de Manabí. Promovemos el juego limpio, la salud colectiva y la transparencia en cada rincón de nuestra provincia.",
  contactEmail: "contacto@fedelibapam.org.ec",
  contactPhone: "+593 98 765 4321",
  facebookUrl: "https://facebook.com/fedelibapam",
  publications: [
    {
      id: "pub-1",
      title: "Histórica final del Torneo Femenino Barrial de Fútbol en Portoviejo",
      date: "2026-06-12",
      sport: "Fútbol",
      category: "Femenino Sénior",
      content: "Con una asistencia récord de más de 3,000 espectadores en el Estadio de la Liga Colón, el club 'Estrellas de Colón' se proclamó campeón provincial tras vencer 3-2 en una emocionante tanda de penales al aguerrido equipo 'Independiente de Chone'. FEDELIBAPAM hizo entrega de las medallas y kits deportivos, reafirmando nuestro compromiso con el desarrollo de la categoría femenina en toda la provincia.",
      imageUrl: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800&auto=format&fit=crop",
      viewsCount: 1420,
      isPinned: true
    },
    {
      id: "pub-2",
      title: "Manta acoge el Provincial Abierto de Ecuavoley Tríos Libres",
      date: "2026-06-10",
      sport: "Ecuavoley",
      category: "Clásica Abierta",
      content: "La adrenalina se tomó el complejo deportivo de Tarqui en Manta, donde se llevó a cabo el campeonato clasificatorio de Ecuavoley. Los representantes de Manta, Montecristi y Calceta demostraron un altísimo nivel deportivo técnico. El trío del club 'Los Caciques de Montecristi' se llevó la copa tras un vibrante cotejo de tres sets. Este torneo se distinguió por su juego limpio y el respaldo de la fanaticada manabita.",
      imageUrl: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?q=80&w=800&auto=format&fit=crop",
      viewsCount: 985
    },
    {
      id: "pub-3",
      title: "Inauguración de la Copa Infantil 'Semillas de Manabí 2026'",
      date: "2026-06-05",
      sport: "Fútbol",
      category: "Infantil Sub-12",
      content: "Con el desborde de alegría de más de 600 niños de 32 comunidades rurales y urbanas de Manabí, se inauguró en Chone la Copa 'Semillas de Manabí'. FEDELIBAPAM, en conjunto con los presidentes de las ligas parroquiales, gestionó de manera transparente el auspicio de uniformes completos para todos los participantes. El objetivo es alejar a los jóvenes de los vicios y cimentar la disciplina deportiva.",
      imageUrl: "https://images.unsplash.com/photo-1517649763962-0c623066013b?q=80&w=800&auto=format&fit=crop",
      viewsCount: 822
    },
    {
      id: "pub-4",
      title: "Se definen los semifinalistas de Básquet Recreativo en Jipijapa",
      date: "2025-06-01",
      sport: "Básquetbol",
      category: "Máster de Oro (40+)",
      content: "Este fin de semana se vivieron cotejos no aptos para cardíacos en el Coliseo Municipal de Jipijapa. Equipos de Jipijapa, Paján y Puerto López se midieron por el boleto a la gran semifinal de la Copa de la Amistad. Con una destacada actuación del escolta Luis Andrade, el quinteto 'Cafetaleros de Paján' logró su pase de oro. El presidente de FEDELIBAPAM constató la excelente organización de la mesa técnica local.",
      imageUrl: "https://images.unsplash.com/photo-1544698310-74ea9d1c8258?q=80&w=800&auto=format&fit=crop",
      viewsCount: 541
    }
  ],
  standings: [
    {
      id: "st-1",
      leagueName: "Liga Barrial Colón de Portoviejo",
      sportName: "Fútbol",
      categoryName: "Sénior Extra",
      teams: [
        { position: 1, name: "Estrellas de Colón", played: 12, won: 9, drawn: 2, lost: 1, goalsFor: 32, goalsAgainst: 14, points: 29 },
        { position: 2, name: "Atlético Jaramijó", played: 12, won: 8, drawn: 2, lost: 2, goalsFor: 28, goalsAgainst: 18, points: 26 },
        { position: 3, name: "Real Portoviejo FC", played: 12, won: 7, drawn: 3, lost: 2, goalsFor: 22, goalsAgainst: 15, points: 24 },
        { position: 4, name: "Caciques de Picoazá", played: 12, won: 5, drawn: 4, lost: 3, goalsFor: 19, goalsAgainst: 16, points: 19 },
        { position: 5, name: "Deportivo Cruzeiro Colón", played: 12, won: 4, drawn: 2, lost: 6, goalsFor: 15, goalsAgainst: 22, points: 14 }
      ]
    },
    {
      id: "st-2",
      leagueName: "Liga Parroquial San Lorenzo (Manta)",
      sportName: "Ecuavoley",
      categoryName: "Sénior Libre",
      teams: [
        { position: 1, name: "Trío Los Compadres", played: 8, won: 7, drawn: 0, lost: 1, goalsFor: 16, goalsAgainst: 4, points: 21 },
        { position: 2, name: "Hijos del Viento Tarqui", played: 8, won: 6, drawn: 0, lost: 2, goalsFor: 13, goalsAgainst: 6, points: 18 },
        { position: 3, name: "Sabor Manabita", played: 8, won: 4, drawn: 0, lost: 4, goalsFor: 9, goalsAgainst: 10, points: 12 },
        { position: 4, name: "Pescadores de San Mateo", played: 8, won: 3, drawn: 0, lost: 5, goalsFor: 8, goalsAgainst: 11, points: 9 }
      ]
    }
  ],
  leagues: [
    { id: "leg-1", name: "Liga Barrial San Pablo", location: "Portoviejo", activeTeams: 24, president: "Ing. Carlos Mendoza", foundedYear: "1994" },
    { id: "leg-2", name: "Liga Parroquial Tarqui", location: "Manta", activeTeams: 32, president: "Sr. Washington Vera", foundedYear: "2001" },
    { id: "leg-3", name: "Liga Barrial Chone", location: "Chone", activeTeams: 18, president: "Dr. Marcelo Moreira", foundedYear: "1998" },
    { id: "leg-4", name: "Liga San Lorenzo", location: "Manta", activeTeams: 14, president: "Sra. Carmen Alvia", foundedYear: "2010" },
    { id: "leg-5", name: "Liga Barrial Montecristi", location: "Montecristi", activeTeams: 16, president: "Ab. Javier Toro", foundedYear: "2005" }
  ],
  transparencyDocuments: [
    {
      id: "doc-1",
      documentName: "Informe Financiero y Rendición de Cuentas - Anual 2025",
      dateReleased: "2026-03-31",
      fileSize: "2.4 MB",
      category: "Presupuestos",
      url: "https://fedelibapam.org/transparencia/informe_2025.pdf"
    },
    {
      id: "doc-2",
      documentName: "Cronograma General de Competencias Provinciales 2026",
      dateReleased: "2026-01-15",
      fileSize: "850 KB",
      category: "Resoluciones",
      url: "https://fedelibapam.org/transparencia/calendario_2026.pdf"
    },
    {
      id: "doc-3",
      documentName: "Reglamento Específico de Ecuavoley y Deporte Comunitario Manabí",
      dateReleased: "2025-11-20",
      fileSize: "1.2 MB",
      category: "Estatutos",
      url: "https://fedelibapam.org/transparencia/reglamento_ecuavoley.pdf"
    },
    {
      id: "doc-4",
      documentName: "Acta de Conformación de Comisiones Técnicas Provinciales 2026",
      dateReleased: "2026-02-10",
      fileSize: "1.1 MB",
      category: "Actas",
      url: "https://fedelibapam.org/transparencia/acta_comisiones_2026.pdf"
    }
  ],
  footerBadge: "Buzón Ciudadano & Afiliaciones",
  footerTitle: "¿Quieres afiliar tu liga o club deportivo a FEDELIBAPAM?",
  footerContent: "FEDELIBAPAM busca expandir el deporte a lo largo del territorio nacional. Apoyamos con kits de implementos deportivos, pelotas oficiales, capacitación de árbitros y transparencia fiscal para todas nuestras ligas. Escríbenos para agendar una visita técnica a tu cantón o parroquia.",
  sports: [
    { id: "sp-1", name: "Fútbol", categories: ["Sénior Extra", "Femenino Libre", "Infantil Sub-12", "Juvenil Sub-17", "Máster de Oro (40+)", "Comunitaria Parroquial"] },
    { id: "sp-2", name: "Ecuavoley", categories: ["Sénior Libre", "Máster 50", "Doble Femenino"] },
    { id: "sp-3", name: "Básquetbol", categories: ["Sénior Libre", "Femenino Unificado", "Comunitario Masculino"] },
    { id: "sp-4", name: "Atletismo", categories: ["General Libre", "Juvenil Sub-15", "Infantil"] }
  ],
  bottomFooterDescription: "Federación de Ligas Barriales y Parroquiales de Manabí. Consagrados a promover el deporte comunitario libre de corrupción, impulsando el talento de nuestra patria desde las canchas de barrio.",
  bottomFooterLocation: "Complejo Deportivo La California, Portoviejo, Manabí",
  bottomFooterShareText: "Ayúdanos a difundir el deporte barrial manabita enviando este portal web directo a tus grupos de WhatsApp."
};
