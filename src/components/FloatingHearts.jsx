import React, { useMemo } from 'react';

export default function FloatingHearts() {
  const particles = useMemo(() => {
    const symbols = ['❤️', '💖', '✨', '🌸', '💕', '🥰', '🌷', '💘'];
    return Array.from({ length: 24 }).map((_, i) => ({
      id: i,
      symbol: symbols[i % symbols.length],
      left: `${(i * 4.3 + Math.random() * 4) % 96}%`,
      size: `${14 + (i % 5) * 6}px`,
      duration: `${9 + (i % 6) * 3}s`,
      delay: `${(i * 0.7) % 8}s`,
      opacity: 0.25 + (i % 4) * 0.15,
    }));
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {/* Soft gradient ambient orbs */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-32 w-96 h-96 bg-rose-200/40 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-red-100/50 rounded-full blur-3xl animate-pulse animation-delay-4000" />

      {/* Floating emojis */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute select-none animate-float"
          style={{
            left: p.left,
            bottom: '-40px',
            fontSize: p.size,
            opacity: p.opacity,
            animation: `floatUp ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        >
          {p.symbol}
        </div>
      ))}

      <style>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg) scale(0.8);
            opacity: 0;
          }
          15% {
            opacity: 0.6;
          }
          85% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-110vh) rotate(360deg) scale(1.1);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}

