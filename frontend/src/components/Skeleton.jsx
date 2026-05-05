import React from 'react';

const Skeleton = ({ className }) => {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
  );
};

export const CardSkeleton = () => (
  <div className="premium-card space-y-6">
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
