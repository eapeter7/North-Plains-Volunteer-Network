
import React, { createContext, useContext, useState, useEffect } from 'react';

// --- Translation Dictionary ---
export const DICTIONARY = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.dashboard': 'Dashboard',
    'nav.profile': 'My Profile',
    'nav.requests': 'All Requests',
    'nav.opportunities': 'Opportunities',
    'nav.history': 'My History',
    'nav.resources': 'Resources',
    'nav.donate': 'Donate',
    'nav.login': 'Login',
    'nav.logout': 'Sign Out',
    'nav.about': 'About NPVN',
    'nav.new_request': 'New Request',
    'nav.my_opps': 'My Volunteer Opps',
    'nav.contact': 'Contact Us',
    
    // Roles
    'role.client': 'Client',
    'role.volunteer': 'Volunteer',
    'role.admin': 'Admin',
    
    // Common
    'welcome': 'Welcome',
    'need_help': 'Need Help?',
    'contact_support': 'Contact support',
    'loading': 'Loading...',
    
    // Client Dash
    'client.active_upcoming': 'Active & Upcoming',
    'client.history': 'History',
    'client.new_request': '+ New Request',
    'client.no_active': 'You have no active requests.',
    'client.training': 'Training Center',
    'client.directory': 'Local Resource Directory',
    'client.notifications': 'Notifications',
    'client.announcements': 'Announcements',
    'client.report_safety': 'Report Safety Concern',
    
    // Volunteer Dash
    'vol.my_assignments': 'My Assignments',
    'vol.find_opps': 'Find Opportunities',
    'vol.total_hours': 'Total Hours',
    'vol.lives_impacted': 'Lives Impacted',
    'vol.badges': 'My Badges',
    'vol.training': 'Training Center',
    'vol.pending_app': 'Application Pending',
    'vol.pending_msg': 'Your background check is currently being processed.',
    
    // Status
    'status.PENDING': 'Pending',
    'status.MATCHED': 'Matched',
    'status.IN_PROGRESS': 'In Progress',
    'status.COMPLETED': 'Completed',
    'status.CANCELLED': 'Cancelled',
    'status.EXPIRED': 'Expired',
    
    // Public
    'hero.title_prefix': 'North Plains',
    'hero.title_suffix': 'Volunteer Network',
    'hero.subtitle': 'Neighbors Helping Neighbors',
    'hero.desc': 'Connecting North Plains residents who need a hand with local volunteers ready to help. Safe, simple, and community-driven.',
    'btn.get_assistance': 'Get Assistance',
    'btn.join_volunteer': 'Join as Volunteer',
    'feature.assist': 'Get Assistance',
    'feature.assist_text': 'Easily submit requests for rides, errands, or friendly visits.',
    'feature.safe': 'Safe Matching',
    'feature.safe_text': 'We match you with background-checked volunteers.',
    'feature.community': 'Community Impact',
    'feature.community_text': 'Build connections and strengthen our community.',
    
    // Settings
    'settings.title': 'Display Settings',
    'settings.text_size': 'Text Size',
    'settings.contrast': 'Contrast',
    'settings.language': 'Language',
    'settings.close': 'Close',
  },
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.dashboard': 'Tablero',
    'nav.profile': 'Mi Perfil',
    'nav.requests': 'Solicitudes',
    'nav.opportunities': 'Oportunidades',
    'nav.history': 'Historial',
    'nav.resources': 'Recursos',
    'nav.donate': 'Donar',
    'nav.login': 'Entrar',
    'nav.logout': 'Salir',
    'nav.about': 'Sobre NPVN',
    'nav.new_request': 'Nueva Solicitud',
    'nav.my_opps': 'Mis Oportunidades',
    'nav.contact': 'Contáctenos',
    
    // Roles
    'role.client': 'Cliente',
    'role.volunteer': 'Voluntario',
    'role.admin': 'Admin',
    
    // Common
    'welcome': 'Bienvenido',
    'need_help': '¿Ayuda?',
    'contact_support': 'Contactar soporte',
    'loading': 'Cargando...',
    
    // Client Dash
    'client.active_upcoming': 'Activos y Próximos',
    'client.history': 'Historial',
    'client.new_request': '+ Nueva Solicitud',
    'client.no_active': 'No tienes solicitudes activas.',
    'client.training': 'Centro de Entrenamiento',
    'client.directory': 'Directorio de Recursos',
    'client.notifications': 'Notificaciones',
    'client.announcements': 'Anuncios',
    'client.report_safety': 'Reportar Problema de Seguridad',
    
    // Volunteer Dash
    'vol.my_assignments': 'Mis Asignaciones',
    'vol.find_opps': 'Buscar Oportunidades',
    'vol.total_hours': 'Horas Totales',
    'vol.lives_impacted': 'Vidas Impactadas',
    'vol.badges': 'Mis Insignias',
    'vol.training': 'Centro de Entrenamiento',
    'vol.pending_app': 'Aplicación Pendiente',
    'vol.pending_msg': 'Su verificación de antecedentes se está procesando.',

    // Status
    'status.PENDING': 'Pendiente',
    'status.MATCHED': 'Asignado',
    'status.IN_PROGRESS': 'En Progreso',
    'status.COMPLETED': 'Completado',
    'status.CANCELLED': 'Cancelado',
    'status.EXPIRED': 'Vencido',
    
    // Public
    'hero.title_prefix': 'North Plains',
    'hero.title_suffix': 'Red de Voluntarios',
    'hero.subtitle': 'Vecinos Ayudando Vecinos',
    'hero.desc': 'Conectando a residentes de North Plains que necesitan ayuda con voluntarios locales listos para ayudar. Seguro, simple y comunitario.',
    'btn.get_assistance': 'Obtener Ayuda',
    'btn.join_volunteer': 'Ser Voluntario',
    'feature.assist': 'Obtener Ayuda',
    'feature.assist_text': 'Solicite fácilmente viajes, recados o visitas amistosas.',
    'feature.safe': 'Emparejamiento Seguro',
    'feature.safe_text': 'Te emparejamos con voluntarios verificados.',
    'feature.community': 'Impacto Comunitario',
    'feature.community_text': 'Construye conexiones y fortalece nuestra comunidad.',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.text_size': 'Tamaño de Texto',
    'settings.contrast': 'Contraste',
    'settings.language': 'Idioma',
    'settings.close': 'Cerrar',
  }
};

type Language = 'en' | 'es';

interface ThemeContextType {
  textSize: 'normal' | 'large' | 'xl';
  setTextSize: (size: 'normal' | 'large' | 'xl') => void;
  highContrast: boolean;
  setHighContrast: (enabled: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xl'>('normal');
  const [highContrast, setHighContrast] = useState(false);
  const [language, setLanguage] = useState<Language>('en');

  // Helper Translation Function
  const t = (key: string) => {
    // @ts-ignore
    return DICTIONARY[language][key] || key;
  };

  // Apply Root Level Font Scaling
  useEffect(() => {
    const root = document.documentElement;
    switch (textSize) {
      case 'large':
        root.style.fontSize = '18px'; // ~112.5%
        break;
      case 'xl':
        root.style.fontSize = '22px'; // ~137.5%
        break;
      default:
        // Reduced from 16px to 14px as requested for the smallest option
        root.style.fontSize = '14px'; 
    }
  }, [textSize]);

  // Apply High Contrast Body Class
  useEffect(() => {
    if (highContrast) {
       document.body.classList.add('high-contrast');
       document.documentElement.classList.add('dark');
    } else {
       document.body.classList.remove('high-contrast');
       document.documentElement.classList.remove('dark');
    }
  }, [highContrast]);

  return (
    <ThemeContext.Provider value={{ textSize, setTextSize, highContrast, setHighContrast, language, setLanguage, t }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
