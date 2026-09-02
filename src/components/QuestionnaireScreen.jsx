import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Utensils,
  Shirt,
  MessageCircleHeart,
  ArrowRight,
  ArrowLeft,
  Heart,
} from 'lucide-react';

const QUESTIONS = [
  {
    id: 'date',
    title: 'When are we going? 📅',
    subtitle: 'Pick the perfect day for our date',
    icon: Calendar,
    type: 'date',
    quickOptions: [
      'This Friday evening',
      'This Saturday',
      'This Sunday',
      'Next Weekend',
    ],
    placeholder: 'Or choose a specific date below...',
  },
  {
    id: 'time',
    title: 'What time is best for you? ⏰',
    subtitle: 'Set our rendezvous hour',
    icon: Clock,
    type: 'time',
    quickOptions: [
      'Afternoon Coffee (3:00 PM) ☕',
      'Golden Hour Sunset (5:30 PM) 🌅',
      'Romantic Dinner (7:30 PM) 🕯️',
      'Late Night Stroll (9:00 PM) 🌙',
    ],
    placeholder: 'Or specify an exact time...',
  },
  {
    id: 'place',
    title: 'Where should we go? 📍',
    subtitle: 'The atmosphere for our special day',
    icon: MapPin,
    type: 'text',
    quickOptions: [
      'Cozy Italian Bistro 🍝',
      'Rooftop View & City Lights 🌃',
      'Sunset Beach / Park Picnic 🧺',
      'Cute Café & Bookstore ☕',
      'Arcade & Games 🎳',
      'Surprise Me! ✨',
    ],
    placeholder: 'Type a favorite spot or idea...',
  },
  {
    id: 'food',
    title: 'What will you eat? 🍕',
    subtitle: 'Tell me your cravings, I treat!',
    icon: Utensils,
    type: 'text',
    quickOptions: [
      'Sushi & Ramen 🍣',
      'Pasta, Pizza & Wine 🍝',
      'Juicy Burgers & Fries 🍔',
      'Street Food & Tacos 🌮',
      'Dessert & Ice Cream Bar 🍨',
      'We Cook Together 🍳',
    ],
    placeholder: 'What are you in the mood for?',
  },
  {
    id: 'outfit',
    title: 'What will you wear? 👗',
    subtitle: "Dress vibe (so I know how to match you!)",
    icon: Shirt,
    type: 'text',
    quickOptions: [
      'Cute Summer Dress 🌸',
      'Casual Chic (Jeans & Top) 👟',
      'Fancy & Elegant 💃',
      'Comfy & Warm Sweater 🧸',
      'Let’s Match Colors! 🎨',
    ],
    placeholder: 'Describe your outfit or style...',
  },
  {
    id: 'notes',
    title: 'Any special requests or notes? 💌',
    subtitle: 'Anything you want me to know or prepare...',
    icon: MessageCircleHeart,
    type: 'textarea',
    quickOptions: [
      'Bring flowers 💐',
      'I get to control the music playlist 🎵',
      'Take lots of cute pictures 📸',
      'Just bring yourself and your smile 😊',
    ],
    placeholder: 'Optional sweet message or special wishes...',
  },
];

export default function QuestionnaireScreen({ onSubmit, isSubmitting }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    date: '',
    time: '',
    place: '',
    food: '',
    outfit: '',
    notes: '',
  });

  const question = QUESTIONS[currentStep];
  const Icon = question.icon;

  const handleSelectQuick = (val) => {
    setAnswers((prev) => ({ ...prev, [question.id]: val }));
  };

  const handleTextChange = (e) => {
    setAnswers((prev) => ({ ...prev, [question.id]: e.target.value }));
  };

  const isLast = currentStep === QUESTIONS.length - 1;
  const isFirst = currentStep === 0;

  const handleNext = () => {
    if (isLast) {
      onSubmit(answers);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (!isFirst) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isAnswered = answers[question.id]?.trim()?.length > 0;
  const canProceed = question.id === 'notes' || isAnswered;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
      <div className="glass-card max-w-xl w-full p-6 md:p-10 rounded-3xl relative overflow-hidden shadow-2xl transition-all">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center text-xs font-semibold text-rose-500 mb-2">
            <span>Step {currentStep + 1} of {QUESTIONS.length}</span>
            <span>{Math.round(((currentStep + 1) / QUESTIONS.length) * 100)}% Completed</span>
          </div>
          <div className="w-full h-2.5 bg-rose-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-400 to-pink-500 rounded-full transition-all duration-400"
              style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto mb-3 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-600 shadow-sm">
            <Icon className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 mb-1">
            {question.title}
          </h2>
          <p className="text-gray-500 text-sm">{question.subtitle}</p>
        </div>

        {/* Quick select chips */}
        <div className="mb-6">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2.5">
            Quick Options (Tap to choose)
          </label>
          <div className="flex flex-wrap gap-2">
            {question.quickOptions.map((opt) => {
              const selected = answers[question.id] === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelectQuick(opt)}
                  className={`px-3.5 py-2 text-sm rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                    selected
                      ? 'bg-rose-500 text-white shadow-md shadow-rose-300 scale-102 ring-2 ring-rose-300'
                      : 'bg-white/80 text-gray-700 hover:bg-rose-50 border border-rose-100/80 shadow-xs'
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Input */}
        <div className="mb-8">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
            Or customize:
          </label>
          {question.type === 'textarea' ? (
            <textarea
              rows={3}
              value={answers[question.id]}
              onChange={handleTextChange}
              placeholder={question.placeholder}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-800 text-sm resize-none"
            />
          ) : question.type === 'date' ? (
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={answers[question.id]?.match(/^\d{4}-\d{2}-\d{2}$/) ? answers[question.id] : ''}
              onChange={handleTextChange}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-800 text-sm cursor-pointer"
            />
          ) : question.type === 'time' ? (
            <input
              type="time"
              value={answers[question.id]?.match(/^\d{2}:\d{2}$/) ? answers[question.id] : ''}
              onChange={handleTextChange}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-800 text-sm cursor-pointer"
            />
          ) : (
            <input
              type="text"
              value={answers[question.id]}
              onChange={handleTextChange}
              placeholder={question.placeholder}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 bg-white/90 focus:outline-none focus:ring-2 focus:ring-rose-400 text-gray-800 text-sm"
            />
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4 pt-2 border-t border-rose-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={isFirst}
            className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-medium transition cursor-pointer ${
              isFirst ? 'opacity-0 pointer-events-none' : 'text-gray-600 hover:bg-rose-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            disabled={!canProceed || isSubmitting}
            className={`inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm md:text-base font-bold text-white shadow-lg transition-all duration-200 cursor-pointer ${
              canProceed && !isSubmitting
                ? 'bg-gradient-to-r from-rose-500 to-pink-500 shadow-rose-300 hover:shadow-xl hover:brightness-105 active:scale-95'
                : 'bg-gray-300 opacity-60 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : isLast ? (
              <span className="flex items-center gap-2">
                Lock It In! <Heart className="w-4 h-4 fill-white" />
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Continue <ArrowRight className="w-4 h-4" />
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

