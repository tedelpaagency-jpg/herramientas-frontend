'use client';
import React from 'react';
import { motion } from 'framer-motion';

export function Skeleton({ className }: { className?: string }) {
  return (
    <motion.div
      className={`bg-surface-variant rounded-md overflow-hidden relative ${className || ''}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{ repeat: Infinity, duration: 1.5, repeatType: 'mirror', ease: 'easeInOut' }}
    >
      <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
    </motion.div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="w-full bg-surface rounded-xl border border-outline-variant overflow-hidden">
      <div className="flex border-b border-outline-variant bg-surface-container-low p-4 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-4 flex-1 rounded-sm" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, idx) => (
        <div key={idx} className="flex p-5 gap-4 border-b border-outline-variant last:border-b-0">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <Skeleton className="h-4 w-3/4 rounded-sm" />
            <Skeleton className="h-3 w-1/2 rounded-sm" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export default Skeleton;
