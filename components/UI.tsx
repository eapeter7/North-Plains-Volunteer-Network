import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// --- Logo ---
export const Logo: React.FC<{ className?: string }> = ({ className = "h-12 w-auto" }) => {
  const [imgSrc, setImgSrc] = useState("./logo.png");
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      if (imgSrc === "./logo.png") {
        setImgSrc("logo.png");
        setHasError(true);
      }
    }
  };

  return (
    <img
      src={imgSrc}
      alt="North Plains Volunteer Network"
      className={`object-contain ${className}`}
      onError={handleError}
    />
  );
};

// --- Button ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success' | 'dark';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const { highContrast } = useTheme();

  const baseStyles = "inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  // High Contrast Overrides
  const hcVariants = {
    primary: "bg-yellow-400 text-black border-2 border-black hover:bg-yellow-500 font-bold",
    secondary: "bg-white text-black border-2 border-black hover:bg-slate-200 font-bold",
    outline: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-bold",
    danger: "bg-red-600 text-white border-2 border-white hover:bg-red-700 font-bold",
    success: "bg-green-600 text-white border-2 border-white hover:bg-green-700 font-bold",
    dark: "bg-slate-800 text-white border-2 border-white font-bold",
  };

  const variants = {
    primary: "bg-brand-600 text-white hover:bg-brand-700 focus:ring-brand-500",
    secondary: "bg-nature-500 text-white hover:bg-nature-600 focus:ring-nature-500",
    outline: "border-2 border-slate-300 text-slate-700 bg-white hover:bg-slate-50 focus:ring-slate-500",
    danger: "bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 focus:ring-emerald-500",
    dark: "bg-blue-800 text-white hover:bg-blue-900 focus:ring-blue-700",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button
      className={`${baseStyles} ${highContrast ? hcVariants[variant] : variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// --- Card ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', title, action, ...props }) => {
  const { highContrast } = useTheme();

  return (
    <div
      className={`
        rounded-xl shadow-sm border overflow-hidden
        ${highContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-200'}
        ${className}
      `}
      {...props}
    >
      {(title || action) && (
        <div className={`px-6 py-4 border-b flex justify-between items-center ${highContrast ? 'bg-slate-900 border-white' : 'bg-slate-50 border-slate-100'}`}>
          {title && <h3 className={`text-lg font-semibold ${highContrast ? 'text-yellow-400' : 'text-slate-800'}`}>{title}</h3>}
          {action && <div>{action}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
};

// --- Modal ---
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; hideCloseButton?: boolean }> = ({ isOpen, onClose, title, children, hideCloseButton }) => {
  const { highContrast } = useTheme();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-slate-900 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full ${highContrast ? 'bg-black border-2 border-yellow-400 text-white' : 'bg-white'}`}>
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-lg leading-6 font-medium ${highContrast ? 'text-yellow-400' : 'text-slate-900'}`}>{title}</h3>
              {!hideCloseButton && (
                <button onClick={onClose} className={`${highContrast ? 'text-white hover:text-yellow-400' : 'text-slate-400 hover:text-slate-500'}`}><X size={20} /></button>
              )}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Badge ---
export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const { highContrast, t } = useTheme();

  // Translated Status
  const label = t(`status.${status}`) !== `status.${status}` ? t(`status.${status}`) : status.replace('_', ' ');

  if (highContrast) {
    return (
      <span className="px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider bg-slate-900 text-yellow-400 border-yellow-400">
        {label}
      </span>
    );
  }

  const styles: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-800 border-amber-200",
    MATCHED: "bg-brand-100 text-brand-800 border-brand-200",
    IN_PROGRESS: "bg-purple-100 text-purple-800 border-purple-200",
    COMPLETED: "bg-emerald-100 text-emerald-800 border-emerald-200",
    CANCELLED: "bg-slate-100 text-slate-600 border-slate-200",
    EXPIRED: "bg-rose-100 text-rose-800 border-rose-200",
  };

  const defaultStyle = "bg-slate-100 text-slate-800 border-slate-200";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${styles[status] || defaultStyle}`}>
      {label}
    </span>
  );
};

// --- Form Input ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label: string;
  as?: 'input' | 'textarea' | 'select';
  rows?: number;
}

export const Input: React.FC<InputProps> = ({ label, id, className = '', as = 'input', children, ...props }) => {
  const { highContrast } = useTheme();

  const styles = highContrast
    ? "bg-black border-white text-white focus:ring-yellow-400 focus:border-yellow-400"
    : "bg-white border-slate-300 focus:ring-brand-500 focus:border-brand-500 text-slate-900";

  return (
    <div className="mb-4">
      <label htmlFor={id} className={`block text-sm font-medium mb-1 ${highContrast ? 'text-white' : 'text-slate-700'}`}>
        {label}
      </label>
      {as === 'select' ? (
        <select
          id={id}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${styles} ${className}`}
          {...(props as any)}
        >
          {children}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={id}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${styles} ${className}`}
          {...(props as any)}
        />
      ) : (
        <input
          id={id}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${styles} ${className}`}
          {...props}
        />
      )}
    </div>
  );
};

// --- Stats Widget ---
export const StatWidget: React.FC<{ label: string; value: string | number; icon?: React.ReactNode; color?: string; onClick?: () => void }> = ({ label, value, icon, color = 'bg-brand-500', onClick }) => {
  const { highContrast } = useTheme();

  return (
    <div
      className={`p-6 rounded-xl border shadow-sm flex items-center justify-between ${onClick ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} 
        ${highContrast ? 'bg-black border-white text-white' : 'bg-white border-slate-200'}
      `}
      onClick={onClick}
    >
      <div>
        <p className={`text-sm font-medium uppercase tracking-wide ${highContrast ? 'text-yellow-400' : 'text-slate-500'}`}>{label}</p>
        <p className={`mt-1 text-3xl font-bold ${highContrast ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      </div>
      {icon && (
        <div className={`p-3 rounded-full text-white bg-opacity-90 ${highContrast ? 'bg-slate-800 border border-white' : color}`}>
          {icon}
        </div>
      )}
    </div>
  );
};

// --- Progress Bar ---
export const ProgressBar: React.FC<{ current: number; total: number; labels?: string[] }> = ({ current, total, labels }) => {
  const { highContrast } = useTheme();
  const percentage = Math.min(100, Math.max(0, ((current - 1) / (total - 1)) * 100));

  return (
    <div className="w-full mb-8">
      {labels && (
        <div className={`flex justify-between text-xs font-medium mb-2 uppercase tracking-wide ${highContrast ? 'text-white' : 'text-slate-500'}`}>
          {labels.map((label, idx) => (
            <span key={idx} className={`${idx + 1 <= current ? (highContrast ? 'text-yellow-400 font-bold' : 'text-brand-600 font-bold') : ''}`}>{label}</span>
          ))}
        </div>
      )}
      <div className={`h-3 rounded-full overflow-hidden ${highContrast ? 'bg-slate-700' : 'bg-slate-200'}`}>
        <div
          className={`h-full transition-all duration-500 ease-out ${highContrast ? 'bg-yellow-400' : 'bg-brand-600'}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// --- Tabs ---
export const Tabs: React.FC<{ tabs: string[]; activeTab: string; onChange: (t: string) => void }> = ({ tabs, activeTab, onChange }) => {
  const { highContrast } = useTheme();

  return (
    <div className={`border-b mb-6 ${highContrast ? 'border-white' : 'border-slate-200'}`}>
      <nav className="-mb-px flex space-x-8 overflow-x-auto" aria-label="Tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onChange(tab)}
            className={`
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors
              ${activeTab === tab
                ? (highContrast ? 'border-yellow-400 text-yellow-400' : 'border-brand-500 text-brand-600')
                : (highContrast ? 'border-transparent text-white hover:text-yellow-200' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300')}
            `}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

// --- Accordion ---
export const Accordion: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; id?: string }> = ({ title, icon, children, defaultOpen = false, id }) => {
  const { highContrast } = useTheme();
  const [isOpen, setIsOpen] = useState(defaultOpen);

  React.useEffect(() => {
    if (defaultOpen) {
      setIsOpen(true);
      if (id) {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [defaultOpen, id]);

  return (
    <div className={`border-b last:border-0 ${highContrast ? 'border-white' : 'border-slate-200'}`} id={id}>
      <button
        className={`flex justify-between items-center w-full py-4 text-left font-semibold transition-colors focus:outline-none group
          ${highContrast ? 'text-white hover:text-yellow-400' : 'text-slate-900 hover:text-brand-700'}
        `}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-3">
          {icon && <span className={`${highContrast ? 'text-yellow-400' : 'text-brand-600'} group-hover:text-current`}>{icon}</span>}
          <span>{title}</span>
        </div>
        <span className={`ml-2 ${highContrast ? 'text-white' : 'text-slate-400'} group-hover:text-current`}>
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </span>
      </button>
      {isOpen && (
        <div className={`pb-4 pl-0 md:pl-8 leading-relaxed animate-in slide-in-from-top-2 fade-in duration-200 ${highContrast ? 'text-white' : 'text-slate-600'}`}>
          {children}
        </div>
      )}
    </div>
  );
};

// --- Custom Calendar Widget ---
export const CalendarWidget: React.FC<{ selectedDate: string; onChange: (d: string) => void; highlights?: string[] }> = ({ selectedDate, onChange, highlights = [] }) => {
  const { highContrast } = useTheme();
  const [currentDate, setCurrentDate] = useState(selectedDate ? new Date(selectedDate) : new Date());

  // Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const changeMonth = (offset: number) => {
    setCurrentDate(new Date(year, month + offset, 1));
  };

  const handleDayClick = (day: number) => {
    // Format YYYY-MM-DD
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    onChange(`${year}-${m}-${d}`);
  };

  const isHighlighted = (day: number) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    const dateStr = `${year}-${m}-${d}`;
    return highlights.includes(dateStr);
  };

  const isSelected = (day: number) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = day.toString().padStart(2, '0');
    const dateStr = `${year}-${m}-${d}`;
    return selectedDate === dateStr;
  };

  const baseText = highContrast ? 'text-white' : 'text-slate-700';
  const mutedText = highContrast ? 'text-slate-400' : 'text-slate-400';
  const bgMain = highContrast ? 'bg-black' : 'bg-white';
  const hoverBg = highContrast ? 'hover:bg-slate-800' : 'hover:bg-slate-100';

  return (
    <div className={`w-72 select-none ${bgMain} ${baseText}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={() => changeMonth(-1)} className={`p-1 rounded ${hoverBg} ${highContrast ? 'text-white' : 'text-slate-600'}`}><ChevronLeft size={20} /></button>
        <span className="font-bold">{monthNames[month]} {year}</span>
        <button onClick={() => changeMonth(1)} className={`p-1 rounded ${hoverBg} ${highContrast ? 'text-white' : 'text-slate-600'}`}><ChevronRight size={20} /></button>
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <span key={d} className={`text-xs font-bold ${mutedText}`}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const highlighted = isHighlighted(day);
          const selected = isSelected(day);

          let btnClass = `w-8 h-8 rounded-full text-sm flex items-center justify-center relative transition-colors ${hoverBg} `;

          if (selected) {
            btnClass = highContrast
              ? 'bg-yellow-400 text-black font-bold'
              : 'bg-brand-600 text-white font-bold';
          } else if (highlighted) {
            btnClass += highContrast ? 'font-bold text-yellow-400' : 'font-bold text-brand-700';
          } else {
            btnClass += highContrast ? 'text-white' : 'text-slate-700';
          }

          return (
            <button key={day} onClick={() => handleDayClick(day)} className={btnClass}>
              {day}
              {highlighted && !selected && (
                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${highContrast ? 'bg-yellow-400' : 'bg-brand-500'}`}></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};