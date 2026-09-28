import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success' }) {
  const [isVisible, setIsVisible] = React.useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [message]);

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: 'bg-white',
      border: 'border-emerald-200',
      accent: 'bg-emerald-500',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      text: 'text-emerald-900',
    },
    error: {
      bg: 'bg-white',
      border: 'border-red-200',
      accent: 'bg-red-500',
      icon: <XCircle className="w-5 h-5 text-red-600" />,
      text: 'text-red-900',
    },
    info: {
      bg: 'bg-white',
      border: 'border-primary-200',
      accent: 'bg-primary-500',
      icon: <AlertCircle className="w-5 h-5 text-primary-600" />,
      text: 'text-primary-900',
    },
  };

  const style = styles[type] || styles.success;

  return (
    <div
      className={`fixed top-6 right-6 z-50 animate-slide-in max-w-md`}
    >
      <div
        className={`${style.bg} rounded-2xl shadow-saas-xl border ${style.border} p-4 flex items-start gap-3 min-w-[300px]`}
      >
        <div className={`${style.accent} rounded-full p-1 bg-opacity-10`}>
          {style.icon}
        </div>
        <p className={`font-semibold text-sm ${style.text} flex-1 mt-0.5`}>
          {message}
        </p>
        <button
          onClick={() => setIsVisible(false)}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

