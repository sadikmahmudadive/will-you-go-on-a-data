import React, { useState, useRef, useEffect } from 'react';
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
  "Look at the big shiny button! ✨",
  "I won't let you say no! 🤭",
  "Just click YES already! 💖",
];

export default function ProposalScreen({ onAccept }) {
  const [dodgeCount, setDodgeCount] = useState(0);
  const [noPosition, setNoPosition] = useState(null); // { x, y } relative to card
  const [isMoved, setIsMoved] = useState(false);
  const cardRef = useRef(null);
  const noBtnRef = useRef(null);
  const yesBtnRef = useRef(null);

  const triggerDodge = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const card = cardRef.current;
    const noBtn = noBtnRef.current;
    if (!card || !noBtn) return;

    const cardRect = card.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const btnWidth = btnRect.width || 120;
    const btnHeight = btnRect.height || 48;

    // Boundary padding inside the card so it never touches the border
    const padX = 20;
    const padY = 20;
    const minX = padX;
    const maxX = Math.max(minX, cardRect.width - btnWidth - padX);
    const minY = padY;
    const maxY = Math.max(minY, cardRect.height - btnHeight - padY);

    // YES button bounds relative to card to avoid overlapping
    let yesLeft = 0, yesTop = 0, yesRight = 0, yesBottom = 0;
    if (yesBtnRef.current) {
      const yRect = yesBtnRef.current.getBoundingClientRect();
      yesLeft = yRect.left - cardRect.left - 15;
      yesTop = yRect.top - cardRect.top - 15;
      yesRight = yRect.right - cardRect.left + 15;
      yesBottom = yRect.bottom - cardRect.top + 15;
    }

    // Find a new random position inside the card that doesn't overlap YES button
    let newX = minX;
    let newY = minY;
    let attempts = 0;
    let found = false;

    while (attempts < 25 && !found) {
      attempts++;
      const candidateX = Math.floor(minX + Math.random() * (maxX - minX));
      const candidateY = Math.floor(minY + Math.random() * (maxY - minY));

      // Check collision with YES button
      const overlapsYes =
        candidateX + btnWidth > yesLeft &&
        candidateX < yesRight &&
        candidateY + btnHeight > yesTop &&
        candidateY < yesBottom;

      // Check distance from current position if moved
      let farEnough = true;
      if (noPosition) {
        const dx = candidateX - noPosition.x;
        const dy = candidateY - noPosition.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 70) farEnough = false;
      }

      if (!overlapsYes && farEnough) {
        newX = candidateX;
        newY = candidateY;
        found = true;
      }
    }

    // Fallback if loop didn't find spot: pick one of four safe corners of the card
    if (!found) {
      const corners = [
        { x: minX, y: minY },
        { x: maxX, y: minY },
        { x: minX, y: maxY },
        { x: maxX, y: maxY },
      ];
      const corner = corners[dodgeCount % corners.length];
      newX = corner.x;
      newY = corner.y;
    }

    setNoPosition({ x: newX, y: newY });
    setIsMoved(true);
    setDodgeCount((prev) => prev + 1);
  };

  // Keep button safely inside card on window resize
  useEffect(() => {
    const handleResize = () => {
      if (isMoved && noPosition && cardRef.current && noBtnRef.current) {
        const cardRect = cardRef.current.getBoundingClientRect();
        const btnWidth = noBtnRef.current.offsetWidth || 120;
        const btnHeight = noBtnRef.current.offsetHeight || 48;
        const padX = 20;
        const padY = 20;
        const maxX = Math.max(padX, cardRect.width - btnWidth - padX);
        const maxY = Math.max(padY, cardRect.height - btnHeight - padY);

        setNoPosition((pos) => ({
          x: Math.min(Math.max(padX, pos.x), maxX),
          y: Math.min(Math.max(padY, pos.y), maxY),
        }));
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMoved, noPosition]);

  const currentPhrase = NO_PHRASES[dodgeCount % NO_PHRASES.length];
  const yesScale = Math.min(1 + dodgeCount * 0.07, 1.45);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8 text-center">
      {/* Main Proposal Canvas / Card */}
      <div
        ref={cardRef}
        className="glass-card max-w-lg w-full p-8 md:p-12 rounded-3xl relative overflow-hidden transition-all duration-300 shadow-2xl"
        style={{ minHeight: '480px' }}
      >
        {/* Cute floating top heart badge */}
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
        <div className="relative min-h-[80px] flex items-center justify-center gap-6 flex-wrap">
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

          {/* Spacer if button has moved, to keep YES centered */}
          {isMoved && <div className="hidden" />}

          {/* NO Button (Trick Runaway Button - Always stays ON THE CANVAS) */}
          <button
            ref={noBtnRef}
            onMouseEnter={triggerDodge}
            onMouseMove={triggerDodge}
            onTouchStart={triggerDodge}
            onPointerDown={triggerDodge}
            onClick={triggerDodge}
            style={
              isMoved && noPosition
                ? {
                    position: 'absolute',
                    left: `${noPosition.x}px`,
                    top: `${noPosition.y}px`,
                    zIndex: 30,
                    transition: 'left 0.22s cubic-bezier(0.34, 1.56, 0.64, 1), top 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  }
                : {
                    position: 'relative',
                    zIndex: 10,
                  }
            }
            className="inline-flex items-center justify-center px-6 py-3.5 text-base md:text-lg font-medium text-gray-500 bg-white/95 border border-rose-200 rounded-full shadow-md hover:bg-rose-50 transition-all select-none cursor-pointer whitespace-nowrap"
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
