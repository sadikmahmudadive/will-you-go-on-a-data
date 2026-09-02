import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import FloatingHearts from './components/FloatingHearts';
import ProposalScreen from './components/ProposalScreen';
import QuestionnaireScreen from './components/QuestionnaireScreen';
import DateTicket from './components/DateTicket';

export default function App() {
  const [phase, setPhase] = useState('proposal'); // 'proposal' | 'questionnaire' | 'ticket'
  const [dateData, setDateData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if previous response exists in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('romantic_date_response');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.date) {
          setDateData(parsed);
          // Don't auto-skip proposal screen so she can experience the fun question, but preserve answers if she returns
        }
      }
    } catch (e) {
      console.warn('Could not read local storage', e);
    }
  }, []);

  // When she clicks "YES"
  const handleAccept = () => {
    // Quick celebratory burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3'],
    });

    // Move to questionnaire after slight celebratory pause
    setTimeout(() => {
      setPhase('questionnaire');
    }, 450);
  };

  // When questionnaire is submitted
  const handleSubmit = async (answers) => {
    setIsSubmitting(true);
    const finalData = {
      ...answers,
      submittedAt: new Date().toISOString(),
    };

    setDateData(finalData);

    // 1. Save to localStorage
    try {
      localStorage.setItem('romantic_date_response', JSON.stringify(finalData));
    } catch (e) {
      console.warn('LocalStorage error', e);
    }

    // 2. Post to /api/save (caught by Vite dev plugin in dev or Vercel serverless function in production)
    try {
      await fetch('/api/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
    } catch (err) {
      console.log('Saved locally (serverless endpoint optional):', err);
    }

    // 3. Auto-download the JSON file directly to her device
    try {
      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(finalData, null, 2)
      )}`;
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', jsonString);
      downloadAnchor.setAttribute('download', 'date-plan.json');
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    } catch (err) {
      console.warn('Could not trigger automatic download', err);
    }

    setIsSubmitting(false);
    setPhase('ticket');
  };

  const handleReset = () => {
    setPhase('questionnaire');
  };

  return (
    <div className="relative min-h-screen w-full font-sans text-gray-800 flex flex-col justify-between">
      {/* Animated Romantic Background */}
      <FloatingHearts />

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center">
        {phase === 'proposal' && <ProposalScreen onAccept={handleAccept} />}
        {phase === 'questionnaire' && (
          <QuestionnaireScreen onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        )}
        {phase === 'ticket' && dateData && (
          <DateTicket data={dateData} onReset={handleReset} />
        )}
      </main>

      {/* Subtle bottom credit */}
      <footer className="relative z-10 py-3 text-center text-xs text-rose-400/80 select-none">
        Crafted with love & sparkles ✨
      </footer>
    </div>
  );
}
