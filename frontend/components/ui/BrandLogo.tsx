import React from 'react';
import Image from 'next/image';

interface BrandLogoProps {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function BrandLogo({
  variant = 'dark',
  size = 'md',
  className = '',
}: BrandLogoProps) {
  // Balanced refined dimensions
  const heightClasses = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-13 sm:h-14',
    xl: 'h-18 sm:h-20',
  }[size];

  const imgSrc = variant === 'light' ? '/logo-blanco.png' : '/logo.png';

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <Image
        src={imgSrc}
        alt="ARTEVÍA"
        width={180}
        height={180}
        className={`w-auto ${heightClasses} object-contain transition-transform duration-300 group-hover:scale-105`}
        priority
      />
    </div>
  );
}
