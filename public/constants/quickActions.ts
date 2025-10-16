// constants/quickActions.ts
import { GraduationCap, DollarSign, BookOpen, Award } from 'lucide-react';

export const quickActions = [
  { 
    id: 1, 
    label: "Carreras Disponibles", 
    icon: GraduationCap, 
    query: "¿Qué carreras disponibles tienen?",
    emoji: "🎓",
    description: "Conoce todas las opciones académicas"
  },
  { 
    id: 2, 
    label: "Precios", 
    icon: DollarSign, 
    query: "¿Cuáles son los precios y costos de matrícula?",
    emoji: "💰",
    description: "Consulta costos y planes de pago"
  },
  { 
    id: 3, 
    label: "Carreras de Grado", 
    icon: BookOpen, 
    query: "Información sobre carreras de grado",
    emoji: "📚",
    description: "Explora nuestras licenciaturas"
  },
  { 
    id: 4, 
    label: "Carreras de Postgrado", 
    icon: Award, 
    query: "¿Qué carreras de postgrado ofrecen?",
    emoji: "🎯",
    description: "Maestrías y especializaciones"
  },
];