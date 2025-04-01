"use client";

import { useEffect, useRef } from 'react';
import Script from 'next/script';

export default function VantaBackground() {
  const vantaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && vantaRef.current) {
      // @ts-expect-error VANTA is loaded from CDN and not available in TypeScript types
      if (window.VANTA) {
        // @ts-expect-error VANTA.BIRDS is a dynamic method added by the CDN script
        window.VANTA.BIRDS({
          el: vantaRef.current,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00
        });
      }
    }
  }, []);

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="beforeInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.birds.min.js" strategy="beforeInteractive" />
      <div ref={vantaRef} className="fixed inset-0 -z-10" />
    </>
  );
} 