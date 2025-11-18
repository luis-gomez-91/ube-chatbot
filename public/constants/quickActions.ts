// constants/quickActions.ts
import { 
  GraduationCap, 
  Gift, 
  BookOpen, 
  Award,
  CreditCard,
  Clock,
  Monitor,
  FileText,
  Users,
  Scroll
} from 'lucide-react';

export interface QuickAction {
  id: number;
  label: string;
  icon: any;
  query: string;
  emoji: string;
  description: string;
}

// Quick Actions para estudiantes UBE (authProvider === 'ube')
export const quickActionsUBE: QuickAction[] = [
  {
    id: 1,
    label: "Pagos y Beneficios",
    icon: CreditCard,
    query: "¿Cuáles son los pagos y beneficios disponibles para estudiantes?",
    emoji: "💳",
    description: "Información sobre aranceles y ayudas"
  },
  {
    id: 2,
    label: "Clases y Horarios",
    icon: Clock,
    query: "¿Dónde puedo consultar mi horario de clases?",
    emoji: "⏰",
    description: "Accede a tu calendario académico"
  },
  {
    id: 3,
    label: "Plataforma Virtual",
    icon: Monitor,
    query: "¿Cómo accedo a la plataforma virtual de la UBE?",
    emoji: "💻",
    description: "Acceso a Moodle y aulas virtuales"
  },
  {
    id: 4,
    label: "Certificados y Trámites",
    icon: FileText,
    query: "¿Cómo solicito certificados y realizar trámites administrativos?",
    emoji: "📋",
    description: "Gestiona tus documentos"
  },
  {
    id: 5,
    label: "Vida Universitaria",
    icon: Users,
    query: "¿Qué actividades y apoyo estudiantil ofrece la UBE?",
    emoji: "🎉",
    description: "Eventos y programas de apoyo"
  },
  {
    id: 6,
    label: "Graduación",
    icon: Scroll,
    query: "¿Cuál es el proceso y requisitos para graduarme?",
    emoji: "🎓",
    description: "Información de egreso"
  },
];

// Quick Actions para usuarios generales (otros proveedores)
export const quickActionsGeneral: QuickAction[] = [
  {
    id: 1,
    label: "Información General",
    icon: BookOpen,
    query: "¿Cuál es la información general sobre la UBE?",
    emoji: "ℹ️",
    description: "Conoce nuestra institución"
  },
  {
    id: 2,
    label: "Carreras de Grado",
    icon: GraduationCap,
    query: "¿Qué carreras de grado ofrece la UBE?",
    emoji: "🎓",
    description: "Explora nuestras licenciaturas"
  },
  {
    id: 3,
    label: "Carreras de Postgrado",
    icon: Award,
    query: "¿Qué carreras de postgrado ofrecen?",
    emoji: "🎯",
    description: "Maestrías y especializaciones"
  },
  {
    id: 4,
    label: "Beneficios y Ayudas",
    icon: Gift,
    query: "¿Cuáles son los beneficios y ayudas estudiantiles?",
    emoji: "💎",
    description: "Becas y apoyos disponibles"
  },
  {
    id: 5,
    label: "Requisitos de Admisión",
    icon: FileText,
    query: "¿Cuáles son los requisitos para ingresar a la UBE?",
    emoji: "📝",
    description: "Proceso de admisión"
  },
  {
    id: 6,
    label: "Contacto y Ubicación",
    icon: Users,
    query: "¿Cuál es el teléfono, email y ubicación de la UBE?",
    emoji: "📍",
    description: "Información de contacto"
  },
];

/**
 * Obtiene los quickActions según el proveedor de autenticación
 * @param authProvider - Proveedor de autenticación ('ube', 'google', 'facebook', etc.)
 * @returns Array de QuickActions correspondiente
 */
export function getQuickActions(authProvider?: string): QuickAction[] {
  if (authProvider === 'ube') {
    return quickActionsUBE;
  }
  return quickActionsGeneral;
}