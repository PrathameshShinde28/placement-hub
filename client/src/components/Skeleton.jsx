import React from 'react';

export function SkeletonText({ width = 'full', height = 'h-4', className = '' }) {
  return (
    <div
      className={`skeleton ${height} ${width === 'full' ? 'w-full' : width} ${className}`}
    />
  );
}

export function SkeletonCircle({ size = 'w-12 h-12', className = '' }) {
  return (
    <div className={`skeleton rounded-full ${size} ${className}`} />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <SkeletonText width="w-32" />
        <SkeletonCircle size="w-10 h-10" />
      </div>
      <SkeletonText width="w-16" height="h-8" className="mb-3" />
      <SkeletonText width="w-3/4" />
    </div>
  );
}

export function SkeletonRow({ count = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <SkeletonCircle size="w-10 h-10" />
          <div className="flex-1 space-y-2">
            <SkeletonText width="w-1/3" />
            <SkeletonText width="w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonGrid({ count = 4 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonChatBubble({ align = 'left' }) {
  return (
    <div className={`flex ${align === 'right' ? 'justify-end' : 'justify-start'}`}>
      <div className={`skeleton h-12 ${align === 'right' ? 'w-2/3' : 'w-1/2'} rounded-2xl`} />
    </div>
  );
}

export function SkeletonPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <SkeletonText width="w-64" height="h-10" />
      </div>
      <SkeletonGrid count={4} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SkeletonCard />
        </div>
        <SkeletonCard />
      </div>
    </div>
  );
}

export default function Skeleton({ variant = 'text', ...props }) {
  switch (variant) {
    case 'card':
      return <SkeletonCard {...props} />;
    case 'grid':
      return <SkeletonGrid {...props} />;
    case 'row':
      return <SkeletonRow {...props} />;
    case 'circle':
      return <SkeletonCircle {...props} />;
    case 'chat':
      return <SkeletonChatBubble {...props} />;
    case 'page':
      return <SkeletonPage {...props} />;
    default:
      return <SkeletonText {...props} />;
  }
}
