import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Shirt,
  MessageCircleHeart,
  Download,
  Copy,
  Check,
  Sparkles,
  RefreshCw,
  Heart,
} from 'lucide-react';

export default function DateTicket({ data, onReset }) {
  const [copied, setCopied] = useState(false);

  // Trigger celebration confetti on view
  useEffect(() => {
    const duration = 3.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#fb7185', '#fef08a'],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#f43f5e', '#ec4899', '#fda4af', '#fb7185', '#fef08a'],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  // Format date summary for clipboard
  const summaryText = `💖 OUR OFFICIAL DATE PLAN 💖
----------------------------------
📅 Date: ${data.date || 'To be decided'}
⏰ Time: ${data.time || 'To be decided'}
📍 Place: ${data.place || 'To be decided'}
🍕 Food: ${data.food || 'To be decided'}
👗 Outfit: ${data.outfit || 'To be decided'}
${data.notes ? `💌 Special Note: ${data.notes}\n` : ''}----------------------------------
Can't wait! 🥰`;

  const handleCopy = () => {
    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', jsonString);
    downloadAnchor.setAttribute('download', 'date-plan.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="glass-card max-w-lg w-full p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-2xl transition-all">
        {/* Top celebratory header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-100/90 text-rose-600 text-xs font-bold tracking-wider uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Date Confirmed! <Sparkles className="w-3.5 h-3.5" />
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 leading-tight">
            YAY! It's A Date! 🎉
          </h1>
          <p className="font-cursive text-2xl text-rose-500 mt-1 font-semibold">
            I can't wait to see you ❤️
          </p>
        </div>

        {/* Ticket Box */}
        <div className="relative bg-white/95 rounded-2xl border-2 border-dashed border-rose-200 p-5 md:p-6 mb-6 shadow-inner">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-rose-100">
            <span className="font-bold text-xs uppercase tracking-widest text-rose-400">
              Official Date Pass #001
            </span>
            <span className="text-rose-500 font-bold text-xs flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 fill-rose-500" /> RESERVED
            </span>
          </div>

          <div className="space-y-3.5 text-left text-sm">
            <div className="flex items-start gap-3">
              <Calendar className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-400 text-xs block">DATE</span>
                <span className="font-semibold text-gray-800">{data.date || 'Not specified'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-400 text-xs block">TIME</span>
                <span className="font-semibold text-gray-800">{data.time || 'Not specified'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-400 text-xs block">WHERE</span>
                <span className="font-semibold text-gray-800">{data.place || 'Not specified'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Utensils className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-400 text-xs block">WHAT SHE'LL EAT</span>
                <span className="font-semibold text-gray-800">{data.food || 'Not specified'}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Shirt className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-gray-400 text-xs block">DRESS VIBE</span>
                <span className="font-semibold text-gray-800">{data.outfit || 'Not specified'}</span>
              </div>
            </div>

            {data.notes && (
              <div className="flex items-start gap-3 pt-1 border-t border-rose-100/60">
                <MessageCircleHeart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-gray-400 text-xs block">SPECIAL WISH</span>
                  <span className="font-medium text-gray-700 italic">"{data.notes}"</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-rose-500 hover:bg-rose-600 text-white shadow-md shadow-rose-300 transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copy Date Plan
              </>
            )}
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 shadow-sm transition cursor-pointer"
          >
            <Download className="w-4 h-4" /> Download JSON
          </button>
        </div>

        {/* Start over option */}
        <div className="text-center mt-6">
          <button
            onClick={onReset}
            className="inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-rose-500 transition cursor-pointer"
          >
            <RefreshCw className="w-3 h-3" /> Change my answers
          </button>
        </div>
      </div>
    </div>
  );
}

