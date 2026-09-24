'use client';

import React from 'react';
import { BookOpen, Clock, Award } from 'lucide-react';

export interface StackedPathCardProps {
  title: string;
  progress: number;
  completedCourses: number;
  totalCourses: number;
  remainingHours: number;
  categoryTag?: string;
  images?: string[];
}

export const StackedPathCard: React.FC<StackedPathCardProps> = ({
  title,
  progress = 0,
  completedCourses = 0,
  totalCourses = 0,
  remainingHours = 0,
  categoryTag = 'Ruta de Aprendizaje',
  images = [],
}) => {
  const defaultImg1 = 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80';
  const defaultImg2 = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80';
  const defaultImg3 = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&auto=format&fit=crop&q=80';

  const imgRight = images[0] || defaultImg1;  // 1ra imagen -> Derecha
  const imgLeft = images[1] || defaultImg2;   // 2da imagen -> Izquierda
  const imgCenter = images[2] || defaultImg3; // 3ra imagen -> Centro (Frente)

  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className="group relative w-full max-w-sm bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-3xl p-0 overflow-visible cursor-pointer select-none shadow-xl hover:shadow-2xl hover:border-indigo-500/40 transition-all duration-300 flex flex-col justify-between mt-6">
      
      {/* SECCIÓN SUPERIOR: BARAJA SOBRESALIENDO DEL CUADRO PADRE */}
      <div className="relative w-full h-48 flex items-center justify-center pt-2 px-2 overflow-visible">

        {/* 1. PRIMERA IMAGEN -> DERECHA (Ligera rotación y offset controlado para evitar traslape entre tarjetas) */}
        <div 
          className="absolute right-2 -top-3 w-[72%] h-44 scale-90 translate-x-3 rotate-3 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-700/60 transform transition-all duration-300 ease-out group-hover:-translate-y-3 group-hover:translate-x-5 group-hover:rotate-6 group-hover:scale-95 group-hover:shadow-xl z-0 bg-slate-100 dark:bg-slate-800"
        >
          <img 
            src={imgRight} 
            alt="1ra Imagen Derecha" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </div>

        {/* 2. SEGUNDA IMAGEN -> IZQUIERDA (Ligera rotación y offset controlado) */}
        <div 
          className="absolute left-2 -top-2 w-[74%] h-44 scale-95 -translate-x-3 -rotate-3 rounded-2xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700/80 transform transition-all duration-300 ease-out group-hover:-translate-y-2 group-hover:-translate-x-5 group-hover:-rotate-6 group-hover:scale-[0.98] group-hover:shadow-xl z-10 bg-slate-100 dark:bg-slate-800"
        >
          <img 
            src={imgLeft} 
            alt="2da Imagen Izquierda" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </div>

        {/* 3. TERCERA IMAGEN -> CENTRO / FRENTE */}
        <div 
          className="relative top-0 z-20 mx-auto w-[82%] h-44 scale-100 rotate-0 rounded-2xl overflow-hidden shadow-xl border border-indigo-200 dark:border-indigo-500/40 transform transition-all duration-300 ease-out group-hover:-translate-y-1 bg-slate-100 dark:bg-slate-800"
        >
          <img 
            src={imgCenter} 
            alt="3ra Imagen Centro" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
          />
        </div>

      </div>

      {/* BLOQUE INFERIOR DE INFORMACIÓN: EN EL CONTENEDOR PADRE Y CUBRIENDO LA MITAD DE LA IMAGEN */}
      <div className="relative z-30 -mt-16 w-full p-5 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-2xl backdrop-blur-md space-y-3 rounded-b-3xl">
        
        {/* Header Superior - Badges */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-black uppercase tracking-wider border border-indigo-200 dark:border-indigo-800">
            <Award className="w-3.5 h-3.5" />
            <span>{categoryTag}</span>
          </span>

          <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 text-xs font-extrabold border border-emerald-200 dark:border-emerald-800">
            {clampedProgress}%
          </span>
        </div>

        {/* Título de la Ruta */}
        <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-1">
          {title}
        </h3>

        {/* Badges de Información */}
        <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 font-semibold">
          <div className="flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-indigo-500" />
            <span>{completedCourses}/{totalCourses} Cursos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>{remainingHours}h restantes</span>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="space-y-1 pt-1">
          <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${clampedProgress}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  );
};

export default StackedPathCard;
