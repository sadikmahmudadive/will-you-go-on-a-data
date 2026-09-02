import React, { useState, useRef, useCallback } from 'react';
import { Heart, Sparkles } from 'lucide-react';

const NO_PHRASES = [
  "No 🥺",
  "Are you sure? 👀",
  "Wait, wrong button! 👉",
  "Nice try! 😜",
  "Can't catch me! 🏃‍♀️",
  "Think about it again! 💕",
  "Error 404: 'No' not found 🚫",
  "You know you want to! 🥰",
  "Is that your final answer? 🤨",
  "Look at the shiny button! ✨",
  "I won't let you say no! 🤭",
  "Just click YES already! 💖",
];

export default function ProposalScreen({ onAccept }) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [translatePos, setTranslatePos] = useState({ x: 0, y: 0 });
  const [isMoved, setIsMoved] = useState(false);

  const cardRef = useRef(null);
  const noBtnRef = useRef(null);
  const yesBtnRef = useRef(null);
  const lastDodgeTimeRef = useRef(0);

  const triggerDodge = useCallback(
    (cursorClientX, cursorClientY) => {
      const now = Date.now();
      // Debounce slightly to prevent erratic re-triggers (120ms)
      if (now - lastDodgeTimeRef.current < 120) return;
      lastDodgeTimeRef.current = now;

      const card = cardRef.current;
      const noBtn = noBtnRef.current;
      if (!card || !noBtn) return;

      const cardRect = card.getBoundingClientRect();
      const btnRect = noBtn.getBoundingClientRect();

      // Current translation offset
      const currentX = translatePos.x;
      const currentY = translatePos.y;

      // Base un-translated position of the NO button relative to the card
      const baseLeft = btnRect.left - cardRect.left - currentX;
      const baseTop = btnRect.top - cardRect.top - currentY;

      const btnWidth = btnRect.width || 120;
      const btnHeight = btnRect.height || 48;

      // Safe boundaries inside the card (leaving 18px padding from all card edges)
      const pad = 18;
      const minTranslateX = -baseLeft + pad;
      const maxTranslateX = cardRect.width - baseLeft - btnWidth - pad;
      const minTranslateY = -baseTop + pad;
      const maxYTranslateY = cardRect.height - baseTop - btnHeight - pad;

      // YES button bounds relative to card to prevent overlapping
      let yesLeft = 0,
        yesTop = 0,
        yesRight = 0,
        yesBottom = 0;
      if (yesBtnRef.current) {
        const yRect = yesBtnRef.current.getBoundingClientRect();
        yesLeft = yRect.left - cardRect.left;
        yesTop = yRect.top - cardRect.top;
        yesRight = yRect.right - cardRect.left;
        yesBottom = yRect.bottom - cardRect.top;
      }

      // Find a safe spot inside the card
      let chosenX = minTranslateX;
      let chosenY = minTranslateY;
      let found = false;

      // Try 35 random points inside the allowed range
      for (let attempt = 0; attempt < 35; attempt++) {
        const candX = Math.round(
          minTranslateX + Math.random() * (maxTranslateX - minTranslateX)
        );
        const candY = Math.round(
          minTranslateY + Math.random() * (maxYTranslateY - minTranslateY)
        );

        // Calculate candidate's absolute position on the card
        const candLeft = baseLeft + candX;
        const candTop = baseTop + candY;
        const candRight = candLeft + btnWidth;
        const candBottom = candTop + btnHeight;

        // Check if candidate overlaps YES button (with 20px comfort buffer)
        const overlapsYes =
          candLeft < yesRight + 20 &&
          candRight > yesLeft - 20 &&
          candTop < yesBottom + 20 &&
          candBottom > yesTop - 20;

        if (overlapsYes) continue;

        // Check distance from current position so it actually makes a visible jump
        const jumpDist = Math.hypot(candX - currentX, candY - currentY);
        if (jumpDist < 70) continue;

        // If cursor coordinates are available, check distance from cursor
        if (cursorClientX !== undefined && cursorClientY !== undefined) {
          const candCenterScreenX = cardRect.left + candLeft + btnWidth / 2;
          const candCenterScreenY = cardRect.top + candTop + btnHeight / 2;
          const distToCursor = Math.hypot(
            candCenterScreenX - cursorClientX,
            candCenterScreenY - cursorClientY
          );
          // Don't jump directly under the cursor!
          if (distToCursor < 90) continue;
        }

        chosenX = candX;
        chosenY = candY;
        found = true;
        break;
      }

      // Safe corner fallbacks if random search was exhausted
      if (!found) {
        const safeCorners = [
          { x: minTranslateX + 5, y: minTranslateY + 5 },
          { x: maxTranslateX - 5, y: minTranslateY + 5 },
          { x: minTranslateX + 5, y: maxYTranslateY - 5 },
          { x: maxTranslateX - 5, y: maxYTranslateY - 5 },
        ];
        const corner = safeCorners[(dodgeCount + 1) % safeCorners.length];
        chosenX = corner.x;
        chosenY = corner.y;
      }

      setTranslatePos({ x: chosenX, y: chosenY });
      setIsMoved(true);
      setDodgeCount((prev) => prev + 1);
    },
    [translatePos, dodgeCount]
  );

  // Proximity detection on the card: if mouse gets within 70px of the button, dodge early!
  const handleCardMouseMove = (e) => {
    if (!noBtnRef.current) return;
    const btnRect = noBtnRef.current.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const dist = Math.hypot(e.clientX - btnCenterX, e.clientY - btnCenterY);
    if (dist < 75) {
      triggerDodge(e.clientX, e.clientY);
    }
  };

  const handleTouchCard = (e) => {
    if (!e.touches || !e.touches[0] || !noBtnRef.current) return;
    const touch = e.touches[0];
    const btnRect = noBtnRef.current.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;

    const dist = Math.hypot(touch.clientX - btnCenterX, touch.clientY - btnCenterY);
    if (dist < 90) {
      e.preventDefault();
      triggerDodge(touch.clientX, touch.clientY);
    }
  };

  const currentPhrase = NO_PHRASES[dodgeCount % NO_PHRASES.length];
  const yesScale = Math.min(1 + dodgeCount * 0.07, 1.45);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center">
      {/* Main Proposal Canvas / Card */}
      <div
        ref={cardRef}
        onMouseMove={handleCardMouseMove}
        onTouchMove={handleTouchCard}
        className="glass-card max-w-lg w-full p-8 md:p-12 rounded-3xl relative overflow-hidden transition-all duration-300 shadow-2xl"
        style={{ minHeight: '480px' }}
      >
        {/* Top envelope badge */}
        <div className="w-20 h-20 md:w-24 md:h-24 mx-auto mb-6 bg-gradient-to-tr from-rose-400 to-pink-300 rounded-full flex items-center justify-center shadow-lg shadow-rose-300/50 animate-bounce">
          <span className="text-4xl md:text-5xl select-none">💌</span>
        </div>

        {/* Romantic intro text */}
        <p className="text-rose-500 font-semibold tracking-wider uppercase text-xs md:text-sm mb-2 flex items-center justify-center gap-1.5">
          <Sparkles className="w-4 h-4" /> A Special Question For You <Sparkles className="w-4 h-4" />
        </p>

        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 leading-tight mb-4">
          Will you go on a date with me? <span className="text-rose-500">💖</span>
        </h1>

        <p className="font-cursive text-2xl md:text-3xl text-rose-600/90 mb-8 font-medium">
          {dodgeCount === 0
            ? "I promise great vibes, good laughs & sweet memories..."
            : dodgeCount < 4
            ? "Hey, you're trying to click the wrong button! 😜"
            : "Come on, you know you want to say yes! 🥰"}
        </p>

        {/* Buttons container */}
        <div className="relative min-h-[90px] flex items-center justify-center gap-6 flex-wrap">
          {/* YES Button */}
          <button
            ref={yesBtnRef}
            onClick={onAccept}
            style={{ transform: `scale(${yesScale})` }}
            className="group relative inline-flex items-center justify-center px-8 py-3.5 md:px-10 md:py-4 text-lg md:text-xl font-bold text-white transition-all duration-200 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-full shadow-lg shadow-rose-400/50 hover:shadow-xl hover:shadow-rose-500/60 hover:brightness-105 active:scale-95 cursor-pointer z-20"
          >
            <Heart className="w-5 h-5 mr-2 fill-white animate-pulse" />
            <span>YES! 🥰</span>
            <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-300 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-rose-400"></span>
            </span>
          </button>

          {/* NO Button (Guaranteed to remain on the canvas, but completely untouchable) */}
          <button
            ref={noBtnRef}
            onMouseEnter={(e) => triggerDodge(e.clientX, e.clientY)}
            onMouseMove={(e) => triggerDodge(e.clientX, e.clientY)}
            onTouchStart={(e) => {
              e.preventDefault();
              const t = e.touches[0];
              triggerDodge(t?.clientX, t?.clientY);
            }}
            onPointerDown={(e) => {
              e.preventDefault();
              triggerDodge(e.clientX, e.clientY);
            }}
            onClick={(e) => {
              e.preventDefault();
              triggerDodge(e.clientX, e.clientY);
            }}
            style={{
              transform: `translate3d(${translatePos.x}px, ${translatePos.y}px, 0)`,
              transition: isMoved
                ? 'transform 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)'
                : 'none',
              zIndex: 30,
              willChange: 'transform',
            }}
            className="inline-flex items-center justify-center px-6 py-3.5 text-base md:text-lg font-medium text-gray-500 bg-white/95 border border-rose-200 rounded-full shadow-md hover:bg-rose-50 select-none cursor-pointer whitespace-nowrap"
          >
            <span>{currentPhrase}</span>
          </button>
        </div>

        {dodgeCount > 0 && (
          <p className="mt-8 text-xs md:text-sm text-gray-400 italic animate-fade-in">
            (Dodged {dodgeCount} {dodgeCount === 1 ? 'time' : 'times'}... 'No' is simply not in our vocabulary! 💕)
          </p>
        )}
      </div>
    </div>
  );
}
