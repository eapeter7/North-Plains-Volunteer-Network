/* eslint-disable */
import React, { useState } from 'react';
import { X, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, PlayCircle, HelpCircle, Phone, Mail, TrendingUp, TrendingDown, Calendar, FileText, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
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
export const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode; hideCloseButton?: boolean; maxWidth?: string; customStyle?: React.CSSProperties }> = ({ isOpen, onClose, title, children, hideCloseButton, maxWidth = "sm:max-w-lg", customStyle }) => {
  const { t, highContrast } = useTheme();
  const modalRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (modalRef.current && customStyle) {
      Object.assign(modalRef.current.style, customStyle);
    }
  }, [customStyle, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-slate-900 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div
          ref={modalRef}
          className={`inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${maxWidth} ${highContrast ? 'bg-black border-2 border-yellow-400 text-white' : 'bg-white'}`}
        >
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className={`text-lg leading-6 font-medium ${highContrast ? 'text-yellow-400' : 'text-slate-900'}`}>{title}</h3>
              {!hideCloseButton && (
                <button onClick={onClose} aria-label="Close" className={`${highContrast ? 'text-white hover:text-yellow-400' : 'text-slate-400 hover:text-slate-500'}`}><X size={20} /></button>
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
  title?: string;
}

export const Input: React.FC<InputProps> = ({ label, id, className = '', as = 'input', children, title, ...props }) => {
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
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <select
          id={id}
          {...(props as any)}
          title={title || label || 'Form Select'}
          aria-label={props['aria-label'] || label || 'Form Select'}
          className={`w-full px-4 py-2 rounded-lg border focus:ring-2 outline-none transition-all ${styles} ${className}`}
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
  const barRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (barRef.current) {
      barRef.current.style.setProperty('--w', `${percentage}%`);
    }
  }, [percentage]);

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
          ref={barRef}
          className="h-full transition-all duration-500 ease-out w-[var(--w)]"
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
        <button onClick={() => changeMonth(-1)} aria-label="Previous Month" className={`p-1 rounded ${hoverBg} ${highContrast ? 'text-white' : 'text-slate-600'}`}><ChevronLeft size={20} /></button>
        <span className="font-bold">{monthNames[month]} {year}</span>
        <button onClick={() => changeMonth(1)} aria-label="Next Month" className={`p-1 rounded ${hoverBg} ${highContrast ? 'text-white' : 'text-slate-600'}`}><ChevronRight size={20} /></button>
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

// --- Shared Dashboard Cards ---

export const DemoModeCard: React.FC<{ onTrigger: () => void; description?: string }> = ({ onTrigger, description }) => {
  return (
    <Card className="bg-indigo-50 dark:bg-indigo-950 border-indigo-200 dark:border-indigo-900 shadow-sm transition-all hover:shadow-md">
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
          <PlayCircle size={18} className="animate-pulse" />
          <h4 className="font-bold text-sm tracking-tight">DEMO PRESENTATION</h4>
        </div>
        <p className="text-xs text-indigo-600 dark:text-indigo-400 leading-relaxed font-medium">
          {description || "Trigger persistent surveys and background check simulations for the live demo."}
        </p>
        <Button
          variant="dark"
          size="sm"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white border-none shadow-sm transition-colors"
          onClick={onTrigger}
        >
          Activate Demo Mode
        </Button>
      </div>
    </Card>
  );
};

// --- Chart Utilities ---

export const ChartContainer: React.FC<{ children: React.ReactNode; height?: number | string }> = ({ children, height = 256 }) => {
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (containerRef.current) {
      const h = typeof height === 'number' ? `${height}px` : height;
      containerRef.current.style.setProperty('--h', h as string);
    }
  }, [height]);

  return (
    <div
      ref={containerRef}
      className="flex items-center justify-center w-full h-[var(--h)]"
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export const StandardGrid = () => (
  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
);

export const StandardXAxis = ({ dataKey }: { dataKey: string }) => (
  <XAxis
    dataKey={dataKey}
    axisLine={false}
    tickLine={false}
    tick={{ fontSize: 11, fill: '#94a3b8' }}
  />
);

export const StandardYAxis = () => (
  <YAxis
    allowDecimals={false}
    interval={0}
    axisLine={false}
    tickLine={false}
    tick={{ fontSize: 11, fill: '#94a3b8' }}
  />
);

export const StandardTooltip = () => (
  <Tooltip
    cursor={{ fill: '#f8fafc' }}
    contentStyle={{
      borderRadius: '8px',
      border: 'none',
      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      fontSize: '12px'
    }}
  />
);

export const NeedHelpCard: React.FC = () => {
  const { t } = useTheme();
  return (
    <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-white dark:bg-black rounded-xl text-slate-400 border border-slate-200 dark:border-slate-700 shadow-inner">
          <HelpCircle size={22} className="text-slate-500" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-slate-900 dark:text-white leading-tight">{t('need_help')}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-300 mb-2">{t('contact_support')}</p>
          <div className="space-y-1.5 pt-1">
            <p className="text-[11px] font-bold text-brand-700 dark:text-yellow-400 flex items-center gap-2 hover:opacity-80 cursor-pointer">
              <Phone size={12} strokeWidth={2.5} /> 971-712-3845
            </p>
            <p className="text-[11px] font-bold text-brand-700 dark:text-yellow-400 flex items-center gap-2 hover:opacity-80 cursor-pointer">
              <Mail size={12} strokeWidth={2.5} /> help@npvn.org
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export const TimeFrameSelector: React.FC<{ value: string; onChange: (val: string) => void; options?: string[] }> = ({ value, onChange, options = ['7 Days', '30 Days', '3 Months', '6 Months', '1 Year', 'All Time'] }) => {
  return (
    <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
      <span className="text-[10px] font-bold text-slate-500 uppercase px-2 flex items-center gap-1">
        <Calendar size={12} /> Period:
      </span>
      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Select Time Frame"
        title="Select Time Frame"
        className="text-xs border-none focus:ring-0 font-bold text-slate-700 dark:text-slate-200 bg-transparent cursor-pointer outline-none py-1 pr-8"
      >
        {options.map(opt => <option key={opt}>{opt}</option>)}
      </select>
    </div>
  );
};
export const WaiverForm: React.FC<{
  onAcknowledge: (name: string) => void;
  onBack: () => void;
}> = ({ onAcknowledge, onBack }) => {
  const { t } = useTheme();
  const [agreed, setAgreed] = useState(false);
  const [signature, setSignature] = useState('');
  const [error, setError] = useState(false);

  const handleNext = () => {
    if (agreed && signature.trim().length > 2) {
      onAcknowledge(signature);
    } else {
      setError(true);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto text-blue-600 dark:text-blue-300 mb-4">
          <FileText size={32} />
        </div>
        <h2 className="text-2xl font-bold dark:text-white">{t('onboarding.waiver_title')}</h2>
        <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto mt-2 italic text-sm">
          {t('onboarding.waiver_intro')}
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 max-h-64 overflow-y-auto shadow-inner">
        <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
          {t('onboarding.waiver_text')}
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <label className="flex items-start gap-3 cursor-pointer group">
          <input
            type="checkbox"
            className="mt-1 w-5 h-5 rounded border-slate-300 text-brand-600 dark:bg-black dark:border-slate-600 focus:ring-brand-500"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked);
              if (e.target.checked) setError(false);
            }}
          />
          <span className="text-sm text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
            {t('onboarding.waiver_checkbox_label')}
          </span>
        </label>

        <Input
          label={t('onboarding.waiver_signature_label')}
          placeholder="Type Full Legal Name"
          value={signature}
          onChange={(e) => {
            setSignature(e.target.value);
            if (e.target.value.trim().length > 2) setError(false);
          }}
        />

        {error && (
          <p className="text-rose-600 dark:text-rose-400 text-xs font-bold flex items-center gap-1 animate-pulse">
            <AlertTriangle size={14} /> {t('onboarding.waiver_error')}
          </p>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <Button variant="outline" onClick={onBack}>{t('common.back')}</Button>
        <Button onClick={handleNext} variant={agreed && signature.length > 2 ? 'success' : 'primary'}>
          {t('common.next')}
        </Button>
      </div>
    </div>
  );
};

