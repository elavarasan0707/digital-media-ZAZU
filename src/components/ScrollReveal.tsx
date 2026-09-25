import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'pop';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  delay = 0,
  direction = 'up'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getTransformClasses = () => {
    if (isVisible) {
      return 'opacity-100 translate-x-0 translate-y-0 scale-100 filter blur-0';
    }

    switch (direction) {
      case 'up':
        return 'opacity-0 translate-y-12 scale-[0.98] filter blur-[2px]';
      case 'down':
        return 'opacity-0 -translate-y-12 scale-[0.98] filter blur-[2px]';
      case 'left':
        return 'opacity-0 translate-x-12 scale-[0.98] filter blur-[2px]';
      case 'right':
        return 'opacity-0 -translate-x-12 scale-[0.98] filter blur-[2px]';
      case 'pop':
        return 'opacity-0 scale-90 translate-y-6 filter blur-[4px]';
      default:
        return 'opacity-0 translate-y-12 scale-[0.98]';
    }
  };

  return (
    <div
      ref={elementRef}
      style={{
        transitionDuration: '750ms',
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`transition-all ${getTransformClasses()} ${className}`}
    >
      {children}
    </div>
  );
};
