import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`relative overflow-hidden bg-slate-200/40 dark:bg-white/5 rounded-xl before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent ${className}`} />
  );
};

export const CardSkeleton = () => (
  <div className="premium-card bg-white/50 backdrop-blur-md border border-white/10 space-y-6">
    <div className="flex items-center gap-4">
      <Skeleton className="w-12 h-12 rounded-2xl" />
      <div className="space-y-2">
        <Skeleton className="w-32 h-4" />
        <Skeleton className="w-24 h-3" />
      </div>
    </div>
    <div className="space-y-3">
      <Skeleton className="w-full h-12" />
      <Skeleton className="w-3/4 h-12" />
    </div>
  </div>
);

export default Skeleton;
