
import React, { useState, useEffect } from 'react';
import { Request, RequestStatus, BadgeDef, User, OnboardingStep, RequestCategory, UserRole } from '../types';
import { BADGES, MOCK_USERS } from '../services/mockData';
import { Card, Button, StatusBadge, StatWidget, Modal, Input, ProgressBar, CalendarWidget, Accordion } from '../components/UI';
import { Calendar, MapPin, CheckCircle, Clock, AlertTriangle, ChevronDown, ChevronUp, User as UserIcon, Car, ShoppingBasket, Heart, Home, HelpCircle, Phone, Mail, ShieldCheck, ExternalLink, FileText, CreditCard, X, BookOpen, Globe, Bus, ShieldAlert, PlayCircle, Lightbulb, Lock, Utensils, Map, Info, CalendarPlus, ArrowRight, Settings } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface VolunteerProps {
   user: User;
   requests: Request[];
   onAccept: (id: string) => void;
   onNavigate: (p: string) => void;
   onUpdateUser: (u: Partial<User>) => void;
   onCompleteRequest: (reqId: string, data: any) => void;
   onWithdraw: (reqId: string, reason: string) => void;
}

// --- Post Service Survey Component ---
const SurveyForm: React.FC<{ onSubmit: (data: any) => void; onCancel: () => void }> = ({ onSubmit, onCancel }) => {
   const [step, setStep] = useState<'INITIAL' | 'SUCCESS_DETAILS' | 'NO_SHOW' | 'UNABLE'>('INITIAL');
   const [data, setData] = useState<any>({ rating: 5, safety: 'Yes' }); // Default values

   if (step === 'INITIAL') {
      return (
         <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">Did you complete this request?</h3>
            <div className="space-y-2">
               <button
                  className="w-full p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-brand-500 hover:bg-brand-50 dark:hover:bg-slate-800 transition-all font-bold text-left flex items-center justify-between group"
                  onClick={() => setStep('SUCCESS_DETAILS')}
               >
                  <span>Yes, service completed</span>
                  <ArrowRight className="text-slate-300 group-hover:text-brand-500" />
               </button>
               <button
                  className="w-full p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-slate-800 transition-all font-bold text-left flex items-center justify-between group"
                  onClick={() => setStep('NO_SHOW')}
               >
                  <span>No, client was a "No Show"</span>
                  <ArrowRight className="text-slate-300 group-hover:text-amber-500" />
               </button>
               <button
                  className="w-full p-4 rounded-lg border-2 border-slate-200 dark:border-slate-700 hover:border-red-500 hover:bg-red-50 dark:hover:bg-slate-800 transition-all font-bold text-left flex items-center justify-between group"
                  onClick={() => setStep('UNABLE')}
               >
                  <span>No, I was unable to complete it</span>
                  <ArrowRight className="text-slate-300 group-hover:text-red-500" />
               </button>
            </div>
            <Button variant="outline" className="w-full mt-4" onClick={onCancel}>Cancel</Button>
         </div>
      );
   }

   if (step === 'SUCCESS_DETAILS') {
      return (
         <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="font-bold text-lg">Service Details</h3>

            <div className="space-y-2">
               <label className="font-bold text-sm">How would you rate this experience?</label>
               <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                     <button
                        key={star}
                        className={`p-2 rounded-full transition-colors ${data.rating >= star ? 'text-yellow-400' : 'text-slate-300'}`}
                        onClick={() => setData({ ...data, rating: star })}
                     >
                        <Heart size={24} fill={data.rating >= star ? "currentColor" : "none"} />
                     </button>
                  ))}
               </div>
            </div>

            <div className="space-y-2">
               <label className="font-bold text-sm">Did you feel safe and comfortable?</label>
               <div className="flex gap-2">
                  {['Yes', 'Maybe', 'No'].map(opt => (
                     <button
                        key={opt}
                        className={`px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${data.safety === opt ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-black text-slate-600 border-slate-300'}`}
                        onClick={() => setData({ ...data, safety: opt })}
                     >
                        {opt}
                     </button>
                  ))}
               </div>
            </div>

            <Input label="Hours Spent (including travel)" type="number" step="0.5" value={data.hours || ''} onChange={e => setData({ ...data, hours: e.target.value })} />
            <Input label="Notes (Optional)" as="textarea" placeholder="Any feedback or concerns?" value={data.notes || ''} onChange={e => setData({ ...data, notes: e.target.value })} />

            <div className="flex justify-between pt-4">
               <Button variant="outline" onClick={() => setStep('INITIAL')}>Back</Button>
               <Button onClick={() => onSubmit({ ...data, status: 'COMPLETED' })}>Submit Report</Button>
            </div>
         </div>
      );
   }

   if (step === 'NO_SHOW') {
      return (
         <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="font-bold text-lg text-amber-600">Report No Show</h3>
            <p className="text-sm text-slate-600">We're sorry this happened. Please provide details so we can follow up with the client.</p>

            <Input label="How long did you wait?" placeholder="e.g. 15 minutes" value={data.waitTime || ''} onChange={e => setData({ ...data, waitTime: e.target.value })} />
            <Input label="Did you attempt to contact them?" as="select" value={data.contactAttempt || ''} onChange={e => setData({ ...data, contactAttempt: e.target.value })}>
               <option value="">Select...</option>
               <option>Yes, called and texted</option>
               <option>Yes, called only</option>
               <option>No</option>
            </Input>
            <Input label="Additional Notes" as="textarea" value={data.notes || ''} onChange={e => setData({ ...data, notes: e.target.value })} />

            <div className="flex justify-between pt-4">
               <Button variant="outline" onClick={() => setStep('INITIAL')}>Back</Button>
               <Button variant="danger" onClick={() => onSubmit({ ...data, status: 'NO_SHOW' })}>Submit Report</Button>
            </div>
         </div>
      );
   }

   if (step === 'UNABLE') {
      return (
         <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <h3 className="font-bold text-lg">Unable to Complete</h3>
            <Input label="Reason" as="select" value={data.reason || ''} onChange={e => setData({ ...data, reason: e.target.value })}>
               <option value="">Select...</option>
               <option>Client cancelled on arrival</option>
               <option>Task was unsafe/different than described</option>
               <option>Personal emergency</option>
               <option>Other</option>
            </Input>
            <Input label="Notes" as="textarea" value={data.notes || ''} onChange={e => setData({ ...data, notes: e.target.value })} />

            <div className="flex justify-between pt-4">
               <Button variant="outline" onClick={() => setStep('INITIAL')}>Back</Button>
               <Button onClick={() => onSubmit({ ...data, status: 'INCOMPLETE' })}>Submit Report</Button>
            </div>
         </div>
      );
   }

   return null;
};

export const VolunteerDashboard: React.FC<VolunteerProps> = ({ user, requests, onNavigate, onUpdateUser, onCompleteRequest, onWithdraw }) => {
   const [completingId, setCompletingId] = useState<string | null>(null);
   const [celebratingBadge, setCelebratingBadge] = useState<BadgeDef | null>(null);
   const { t } = useTheme();

   const isPending = user.backgroundCheckStatus === 'PENDING' || user.backgroundCheckStatus === 'NOT_STARTED';

   // Check for New Badges to Celebrate
   useEffect(() => {
      if (user.newBadges && user.newBadges.length > 0) {
         const badgeId = user.newBadges[0];
         const badgeDef = BADGES.find(b => b.id === badgeId);
         if (badgeDef) {
            setCelebratingBadge(badgeDef);
         }
      }
   }, [user.newBadges]);

   const handleCloseCelebration = () => {
      if (!celebratingBadge || !user.newBadges) return;
      const remainingNewBadges = user.newBadges.filter(id => id !== celebratingBadge.id);
      onUpdateUser({ newBadges: remainingNewBadges });
      setCelebratingBadge(null);
   };

   // Auto-open reporting for completed requests (1 hour after service time)
   useEffect(() => {
      const now = new Date();

      const overdue = requests.find(r => {
         const isMyAssignment = (r.volunteerId === user.id && r.status === RequestStatus.MATCHED) ||
            (r.isGroupEvent && r.enrolledVolunteers?.includes(user.id));

         if (!isMyAssignment) return false;

         // Parse Request Date
         const [y, m, d] = r.date.split('-').map(Number);
         let reqDateTime = new Date(y, m - 1, d);

         if (r.timeWindow || r.appointmentTime || r.pickupTime) {
            const timeStr = r.appointmentTime || r.pickupTime || r.timeWindow;
            const match = timeStr?.match(/(\d+):(\d+)/);
            if (match) {
               let hours = parseInt(match[1]);
               const minutes = parseInt(match[2]);
               if (timeStr.toLowerCase().includes('pm') && hours < 12) hours += 12;
               if (timeStr.toLowerCase().includes('am') && hours === 12) hours = 0;
               reqDateTime.setHours(hours, minutes);
            } else {
               reqDateTime.setHours(23, 59, 59);
            }
         } else {
            reqDateTime.setHours(23, 59, 59);
         }

         // Add 1 hour delay
         const oneHourAfter = new Date(reqDateTime.getTime() + 60 * 60 * 1000);

         return now >= oneHourAfter;
      });

      if (overdue) {
         setCompletingId(overdue.id);
      }
   }, [requests, user.id]);

   if (user.onboardingStep !== OnboardingStep.COMPLETE) {
      return <VolunteerOnboarding user={user} onUpdate={onUpdateUser} onNavigate={onNavigate} />;
   }

   const myAssignments = requests.filter(r => {
      const isSoloMatch = r.volunteerId === user.id && r.status === RequestStatus.MATCHED;
      const isGroupEnrollment = r.isGroupEvent && r.enrolledVolunteers?.includes(user.id);
      return isSoloMatch || isGroupEnrollment;
   });

   return (
      <div className="space-y-8">
         {/* Stats & Badges */}
         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <StatWidget label={t('vol.total_hours')} value={user.totalHours || 0} icon={<Clock size={20} />} color="bg-brand-500" />
            <StatWidget label={t('vol.lives_impacted')} value="28" icon={<CheckCircle size={20} />} color="bg-emerald-500" />
            <div className="md:col-span-2 bg-white dark:bg-black p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
               <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">{t('vol.badges')}</h3>
               <div className="flex flex-wrap gap-2">
                  {BADGES.filter(b => user.badges?.includes(b.id)).map(badge => (
                     <div key={badge.id} className={`${badge.color} text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-sm`}>
                        <span className="mr-1">{badge.icon}</span> {badge.label}
                     </div>
                  ))}
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-6">
               {isPending ? (
                  <Card className="border-l-4 border-l-amber-500 bg-amber-50 dark:bg-slate-900">
                     <div className="text-center py-8">
                        <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center mx-auto text-amber-600 dark:text-amber-400 mb-4">
                           <Lock size={32} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t('vol.pending_app')}</h2>
                        <p className="text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6">
                           {t('vol.pending_msg')}
                        </p>
                        <p className="text-sm text-amber-800 dark:text-amber-400 font-bold">
                           Access to Opportunities and Assignments will unlock once approved.
                        </p>
                     </div>
                  </Card>
               ) : (
                  <>
                     <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-yellow-400">{t('vol.my_assignments')}</h2>
                        <Button onClick={() => onNavigate('opportunities')} variant="secondary">{t('vol.find_opps')}</Button>
                     </div>

                     {myAssignments.length === 0 ? (
                        <Card className="text-center py-12 text-slate-500 dark:text-slate-400">
                           No active assignments. Check the Opportunity Board!
                        </Card>
                     ) : (
                        myAssignments.map(req => (
                           <AssignedRequestCard
                              key={req.id}
                              request={req}
                              onLogHours={() => setCompletingId(req.id)}
                              onWithdraw={onWithdraw}
                           />
                        ))
                     )}
                  </>
               )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
               {/* Training Center - Pulses if Pending */}
               <div className={`transition-all duration-500 ${isPending ? 'ring-4 ring-blue-200 dark:ring-blue-900 rounded-xl animate-pulse' : ''}`}>
                  <Card title={t('vol.training')}>
                     <div className="space-y-2">
                        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                           <div className={`h-2.5 rounded-full ${isPending ? 'bg-amber-500 w-1/3' : 'bg-brand-600 dark:bg-yellow-400 w-full'}`}></div>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-right">
                           {isPending ? 'Training Incomplete' : 'Platform Training: Complete'}
                        </p>
                        <Button
                           variant={isPending ? 'primary' : 'outline'}
                           size="sm"
                           className="w-full mt-2"
                           onClick={() => onNavigate('volunteer-resources')}
                        >
                           {isPending ? 'Start Training' : 'View Resources'}
                        </Button>
                     </div>
                  </Card>
               </div>

               <Card title={t('client.notifications')}>
                  <div className="space-y-3">
                     {user.notifications?.map((notif, i) => (
                        <div key={i} className="flex items-start gap-3 p-2 bg-blue-50 dark:bg-slate-800 rounded border border-blue-100 dark:border-slate-700 text-sm">
                           <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                           <div>
                              <p className="font-medium text-slate-800 dark:text-white">New Update</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">{notif.message}</p>
                           </div>
                        </div>
                     ))}
                     {(!user.notifications || user.notifications.length === 0) && !isPending && (
                        <div className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded transition-colors text-sm">
                           <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                           <div>
                              <p className="font-medium text-slate-800 dark:text-white">New Match Confirmed</p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">You are matched with Martha for Nov 15.</p>
                           </div>
                        </div>
                     )}
                  </div>
               </Card>

               <Card title={t('client.announcements')}>
                  <div className="space-y-3">
                     <div className="p-3 bg-brand-50 dark:bg-slate-800 border border-brand-100 dark:border-slate-700 rounded-lg text-sm">
                        <p className="font-bold text-brand-800 dark:text-white mb-1">❄️ Winter Services</p>
                        <p className="text-brand-700 dark:text-slate-300">We are now accepting requests for holiday decoration help!</p>
                     </div>
                  </div>
               </Card>

               <div className="pt-2">
                  <Button variant="danger" className="w-full justify-center py-3 font-bold shadow-sm" onClick={() => onNavigate('report-safety')}>
                     <AlertTriangle size={20} className="mr-2" />
                     {t('client.report_safety')}
                  </Button>
               </div>

               <Card className="bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                  <div className="space-y-4">
                     <div className="flex items-start gap-3">
                        <div className="p-2 bg-white dark:bg-black rounded-full text-slate-400 border border-slate-200 dark:border-slate-700">
                           <HelpCircle size={20} />
                        </div>
                        <div>
                           <h4 className="font-bold text-slate-900 dark:text-white">{t('need_help')}</h4>
                           <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{t('contact_support')}</p>
                           <div className="text-xs space-y-1">
                              <p className="flex items-center gap-2 text-brand-700 dark:text-yellow-400"><Phone size={12} /> 971-712-3845</p>
                              <p className="flex items-center gap-2 text-brand-700 dark:text-yellow-400"><Mail size={12} /> help@npvn.org</p>
                           </div>
                        </div>
                     </div>
                     <Button variant="outline" className="w-full text-xs" onClick={() => onNavigate('settings')}>
                        <Settings size={14} className="mr-2" /> Account Settings
                     </Button>
                  </div>
               </Card>
            </div>
         </div>

         {completingId && (
            <Modal isOpen={true} onClose={() => { }} title="Post-Service Report" hideCloseButton={true}>
               <SurveyForm
                  onSubmit={(data) => {
                     onCompleteRequest(completingId, data);
                     setCompletingId(null);
                  }}
                  onCancel={() => { }}
               />
            </Modal>
         )}

         {/* Settings Modal - Placeholder for now, triggered by future UI */}
         {/* We can add a Settings button to the sidebar or header later if requested.
             Verified requirements mention Account & Privacy. 
             Let's add a Settings Button in the sidebar right now. */}


         {celebratingBadge && (
            <Modal isOpen={true} onClose={handleCloseCelebration} title="">
               <div className="text-center py-6 px-4">
                  <div className="flex justify-center mb-4">
                     <span className="text-6xl">{celebratingBadge.icon}</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Congratulations!</h2>
                  <p className="text-xl text-slate-600 dark:text-slate-300 mb-6">You earned the <span className="text-brand-700 dark:text-yellow-400 font-bold">{celebratingBadge.label}</span> badge!</p>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 mb-8 max-w-sm mx-auto">
                     <p className="text-slate-700 dark:text-slate-300 italic">"{celebratingBadge.description}"</p>
                  </div>
                  <Button onClick={handleCloseCelebration} size="lg" className="w-full">Awesome!</Button>
               </div>
            </Modal>
         )}
      </div>
   );
};

// --- Helper Functions ---

const downloadICS = (request: Request) => {
   const formatDate = (dateStr: string) => dateStr.replace(/-/g, '');
   const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//NPVN//Volunteer Network//EN
BEGIN:VEVENT
UID:${request.id}@npvn.org
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
DTSTART;VALUE=DATE:${formatDate(request.date)}
SUMMARY:Volunteer: ${request.category} - ${request.subcategory}
DESCRIPTION:${request.description}
LOCATION:${request.location}
END:VEVENT
END:VCALENDAR`;

   const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
   const link = document.createElement('a');
   link.href = window.URL.createObjectURL(blob);
   link.setAttribute('download', `event-${request.id}.ics`);
   document.body.appendChild(link);
   link.click();
   document.body.removeChild(link);
};

const AssignedRequestCard: React.FC<{ request: Request; onLogHours: () => void; onWithdraw: (id: string, reason: string) => void }> = ({ request, onLogHours, onWithdraw }) => {
   const [expanded, setExpanded] = useState(false);
   const [withdrawing, setWithdrawing] = useState(false);
   const [withdrawReason, setWithdrawReason] = useState('');

   // Lookup Client
   const client = Object.values(MOCK_USERS).find(u => u.id === request.clientId);

   const withdrawalReasons = [
      "Health or medical reasons",
      "Schedule or time constraints",
      "Family responsibilities",
      "Transportation issues",
      "Moving out of the area",
      "I did not feel confident in the volunteer tasks",
      "I had concerns about safety",
      "The platform or process was confusing",
      "Something else"
   ];

   if (withdrawing) {
      return (
         <Card className="border-l-4 border-l-rose-500 bg-rose-50 dark:bg-slate-900">
            <h3 className="text-lg font-bold text-rose-800 dark:text-rose-400 mb-2">Withdraw Assignment</h3>
            <p className="text-sm text-rose-700 dark:text-rose-300 mb-4">Please let us know why you need to withdraw. This helps us improve.</p>
            <Input label="Reason" as="select" value={withdrawReason} onChange={e => setWithdrawReason(e.target.value)}>
               <option value="">Select a reason...</option>
               {withdrawalReasons.map(r => <option key={r}>{r}</option>)}
            </Input>
            <div className="flex gap-2 mt-4">
               <Button variant="outline" size="sm" onClick={() => setWithdrawing(false)}>Cancel</Button>
               <Button variant="danger" size="sm" onClick={() => onWithdraw(request.id, withdrawReason)}>Confirm Withdrawal</Button>
            </div>
         </Card>
      );
   }

   return (
      <Card className="border-l-4 border-l-purple-500 transition-all dark:bg-slate-900">
         <div className="flex justify-between items-start cursor-pointer" onClick={() => setExpanded(!expanded)}>
            <div className="flex gap-4 items-start">
               {/* Icon Placeholder */}
               <div className="w-16 h-16 flex-shrink-0 bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg flex flex-col items-center justify-center p-1 text-center group-hover:border-purple-300 transition-colors">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase leading-tight">{request.category.substring(0, 4)}</span>
               </div>

               <div>
                  <div className="flex items-center gap-2 mb-1">
                     <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wide">My Assignment</span>
                     <span className="text-xs text-slate-500 dark:text-slate-400">#{request.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{request.category}: {request.subcategory}</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">{request.date} @ {request.timeWindow || request.pickupTime}</p>
               </div>
            </div>
            <button className="text-slate-400">{expanded ? <ChevronUp /> : <ChevronDown />}</button>
         </div>

         {expanded && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-in fade-in">
               <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-2 text-sm text-slate-700 dark:text-slate-300 mb-4">
                  <p><strong>Client:</strong> {request.clientName}</p>
                  <p><strong>Location:</strong> {request.location} <a href="#" className="text-blue-600 dark:text-blue-400 underline ml-2">(Map)</a></p>
                  <p><strong>Details:</strong> {request.description}</p>

                  {client && (
                     <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-brand-700 dark:text-yellow-400 mb-1">Client Insights</h4>
                        <p className="text-xs"><span className="font-semibold">Pets:</span> {client.pets || 'None listed'}</p>
                        <p className="text-xs"><span className="font-semibold">Hobbies/Interests:</span> {client.hobbies?.join(', ') || client.interestingFacts || 'None listed'}</p>

                        <div className="mt-2 flex gap-2">
                           {client.accessibility?.mobility && (
                              <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded text-xs font-bold">{client.accessibility.mobility}</span>
                           )}
                        </div>
                     </div>
                  )}

                  {request.adminNotes && <p className="text-amber-700 bg-amber-50 dark:bg-amber-900 dark:text-amber-100 p-2 rounded mt-2">Note: {request.adminNotes}</p>}
               </div>

               <div className="flex gap-3 flex-wrap">
                  <Button className="flex-1" onClick={onLogHours}>Log Hours</Button>
                  <Button variant="secondary" className="flex items-center gap-2" onClick={(e) => { e.stopPropagation(); downloadICS(request); }}>
                     <CalendarPlus size={16} /> Add to Calendar
                  </Button>
                  <Button variant="outline" className="text-rose-600 hover:text-rose-700 dark:text-rose-400" onClick={() => setWithdrawing(true)}>Withdraw</Button>
               </div>
            </div>
         )}
      </Card>
   );
};

export const VolunteerOnboarding: React.FC<{ user: User; onUpdate: (u: Partial<User>) => void; onNavigate: (p: string) => void }> = ({ user, onUpdate, onNavigate }) => {
   const [step, setStep] = useState(1);
   const [formData, setFormData] = useState<Partial<User>>({
      address: 'North Plains, OR 97133', // Prefill
      ...user
   });

   const handleFinish = () => {
      onUpdate({ ...formData, onboardingStep: OnboardingStep.COMPLETE, backgroundCheckStatus: 'PENDING', intakeDate: new Date().toISOString().split('T')[0] });
      // Show dashboard
   };

   return (
      <div className="max-w-3xl mx-auto py-8">
         <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">North Plains Volunteer Network Registration</h1>
         <div className="max-w-2xl mx-auto mb-8">
            <ProgressBar current={step} total={5} labels={['Contact', 'Demographics', 'Personal', 'Skills', 'Complete']} />
         </div>

         <Card>
            {step === 1 && (
               <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold dark:text-white mb-4">Step 1: Contact Information</h2>
                  <div className="grid grid-cols-2 gap-4">
                     <Input label="First Name" value={formData.name?.split(' ')[0] || ''} onChange={e => setFormData({ ...formData, name: `${e.target.value} ${formData.name?.split(' ')[1] || ''}` })} />
                     <Input label="Last Name" value={formData.name?.split(' ')[1] || ''} onChange={e => setFormData({ ...formData, name: `${formData.name?.split(' ')[0] || ''} ${e.target.value}` })} />
                  </div>
                  <Input label="Preferred Name (Optional)" value={formData.preferredName || ''} onChange={e => setFormData({ ...formData, preferredName: e.target.value })} />

                  <div className="grid grid-cols-2 gap-4">
                     <Input label="Date of Birth" type="date" value={formData.dob || ''} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                     <Input label="Gender" as="select" value={formData.gender || ''} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                        <option value="">Select...</option>
                        <option>Female</option>
                        <option>Male</option>
                        <option>Non-binary</option>
                        <option>Prefer not to say</option>
                     </Input>
                  </div>

                  <Input label="Address" value={formData.address} disabled className="bg-slate-50 dark:bg-slate-800" />

                  <div className="grid grid-cols-2 gap-4">
                     <Input label="Phone Number" type="tel" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                     <Input label="Email Address" type="email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>

                  <Input label="Preferred Contact Method" as="select" value={formData.preferredContactMethod || 'Email'} onChange={e => setFormData({ ...formData, preferredContactMethod: e.target.value as any })}>
                     <option>Email</option>
                     <option>Call</option>
                     <option>Text</option>
                  </Input>

                  <div className="flex justify-end pt-4">
                     <Button onClick={() => setStep(2)}>Next Step</Button>
                  </div>
               </div>
            )}

            {step === 2 && (
               <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold dark:text-white mb-4">Step 2: Demographics (HUD Standards)</h2>
                  <p className="text-sm text-slate-500 mb-4">We collect this information to comply with HUD grant requirements. Your data is kept confidential.</p>

                  <div className="grid grid-cols-2 gap-4">
                     <Input label="Race" as="select" value={formData.race || ''} onChange={e => setFormData({ ...formData, race: e.target.value })}>
                        <option value="">Select...</option>
                        <option>American Indian or Alaska Native</option>
                        <option>Asian</option>
                        <option>Black or African American</option>
                        <option>Native Hawaiian or Other Pacific Islander</option>
                        <option>White</option>
                        <option>Other / Multi-Racial</option>
                     </Input>
                     <Input label="Ethnicity" as="select" value={formData.ethnicity || ''} onChange={e => setFormData({ ...formData, ethnicity: e.target.value as any })}>
                        <option value="">Select...</option>
                        <option>Hispanic/Latino</option>
                        <option>Not Hispanic/Latino</option>
                     </Input>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <Input label="Marital Status" as="select" value={formData.maritalStatus || ''} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}>
                        <option value="">Select...</option>
                        <option>Single</option>
                        <option>Married</option>
                        <option>Widowed</option>
                        <option>Divorced</option>
                     </Input>
                     <Input label="Household Income Range" as="select" value={formData.incomeRange || ''} onChange={e => setFormData({ ...formData, incomeRange: e.target.value })}>
                        <option value="">Select...</option>
                        <option>Under $30,000</option>
                        <option>$30,000 - $50,000</option>
                        <option>$50,000 - $80,000</option>
                        <option>$80,000+</option>
                     </Input>
                  </div>

                  <div className="border-t pt-4 mt-4 dark:border-slate-700">
                     <h3 className="font-bold mb-2">Emergency Contact</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <Input label="Name" value={formData.emergencyContact?.name || ''} onChange={e => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact!, name: e.target.value } })} />
                        <Input label="Phone" value={formData.emergencyContact?.phone || ''} onChange={e => setFormData({ ...formData, emergencyContact: { ...formData.emergencyContact!, phone: e.target.value } })} />
                     </div>
                  </div>

                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
                     <Button onClick={() => setStep(3)}>Next Step</Button>
                  </div>
               </div>
            )}

            {step === 3 && (
               <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold dark:text-white mb-4">Step 3: Personal & Safety</h2>

                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg flex items-center justify-between">
                     <div>
                        <h4 className="font-bold">Profile Photo</h4>
                        <p className="text-xs text-slate-500">This helps volunteers and clients recognize you safely.</p>
                     </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="sm">Choose from Gallery</Button>
                        <Button variant="secondary" size="sm">Take Photo</Button>
                     </div>
                  </div>

                  <Input label="Pets in the home?" placeholder="e.g. 2 Dogs (Max & Spot)" value={formData.pets || ''} onChange={e => setFormData({ ...formData, pets: e.target.value })} />
                  <Input label="Interesting facts about you (Optional)" as="textarea" value={formData.interestingFacts || ''} onChange={e => setFormData({ ...formData, interestingFacts: e.target.value })} />

                  <div className="border-t pt-4 mt-4 dark:border-slate-700">
                     <h3 className="font-bold mb-2">Accessibility Notes</h3>
                     <p className="text-xs text-slate-500 mb-4">Do you have any impairments we should be aware of?</p>
                     <div className="grid grid-cols-3 gap-4">
                        <Input label="Hearing Impairment" as="select" value={formData.accessibility?.hearing || 'Unknown'} onChange={e => setFormData({ ...formData, accessibility: { ...formData.accessibility!, hearing: e.target.value } })}>
                           <option>Unknown</option>
                           <option>Yes</option>
                           <option>No</option>
                        </Input>
                        <Input label="Vision Impairment" as="select" value={formData.accessibility?.vision || 'Unknown'} onChange={e => setFormData({ ...formData, accessibility: { ...formData.accessibility!, vision: e.target.value } })}>
                           <option>Unknown</option>
                           <option>Yes</option>
                           <option>No</option>
                        </Input>
                        <Input label="Mobility" as="select" value={formData.accessibility?.mobility || 'None'} onChange={e => setFormData({ ...formData, accessibility: { ...formData.accessibility!, mobility: e.target.value } })}>
                           <option>None</option>
                           <option>Walker</option>
                           <option>Wheelchair</option>
                           <option>Stairs are difficult</option>
                        </Input>
                     </div>
                  </div>

                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                     <Button onClick={() => setStep(4)}>Next Step</Button>
                  </div>
               </div>
            )}

            {step === 4 && (
               <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                  <h2 className="text-xl font-bold dark:text-white mb-4">Step 4: Skills Assessment</h2>

                  <div className="space-y-2">
                     <label className="font-bold text-sm">Languages Spoken</label>
                     <div className="flex gap-2 flex-wrap">
                        {['English', 'Spanish', 'French', 'Sign Language', 'Other'].map(lang => (
                           <button
                              key={lang}
                              className={`px-3 py-1 rounded-full text-xs font-bold border transition-colors ${formData.languages?.includes(lang) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-black text-slate-600 border-slate-300'}`}
                              onClick={() => {
                                 const current = formData.languages || [];
                                 setFormData({ ...formData, languages: current.includes(lang) ? current.filter(l => l !== lang) : [...current, lang] });
                              }}
                           >
                              {lang}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="flex items-center gap-4 py-2">
                     <input type="checkbox" id="driver" className="w-5 h-5 rounded text-brand-600" checked={formData.isDriver || false} onChange={e => setFormData({ ...formData, isDriver: e.target.checked })} />
                     <label htmlFor="driver" className="font-medium">Active Driver with Valid License</label>
                  </div>

                  <Input label="Profession / Previous Profession" placeholder="e.g. Teacher, Nurse, Engineer..." />
                  <Input label="Special Skills" placeholder="e.g. IT support, Carpentry, Gardening..." />
                  <Input label="Hobbies" placeholder="e.g. Reading, Chess, Hiking..." value={formData.hobbies?.join(', ') || ''} onChange={e => setFormData({ ...formData, hobbies: e.target.value.split(',').map(s => s.trim()) })} />

                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
                     <Button onClick={() => setStep(5)}>Next Step</Button>
                  </div>
               </div>
            )}

            {step === 5 && (
               <div className="space-y-6 animate-in fade-in slide-in-from-right-4 text-center">
                  <div className="w-20 h-20 bg-brand-100 dark:bg-brand-900 rounded-full flex items-center justify-center mx-auto text-brand-600 mb-4">
                     <ShieldCheck size={40} />
                  </div>
                  <h2 className="text-2xl font-bold dark:text-white">Almost Done!</h2>
                  <p className="text-slate-600 dark:text-slate-300 max-w-lg mx-auto">
                     Thank you for your application to become a verified North Plains Volunteer Network member.
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto text-left space-y-4">
                     <h3 className="font-bold text-lg">Next Steps: Background Check</h3>
                     <p className="text-sm text-slate-600 dark:text-slate-300">
                        To ensure the safety of our community, all volunteers must complete a background check.
                     </p>

                     <div className="flex gap-2">
                        <Button className="flex-1">Fill e-Form Now</Button>
                        <Button variant="outline" className="flex-1">Download PDF</Button>
                     </div>

                     <p className="text-xs text-slate-500 italic p-2 bg-white dark:bg-black rounded border border-slate-100 dark:border-slate-800">
                        "While your background check is processing, you are welcome to begin orientation training."
                     </p>
                  </div>

                  <div className="flex justify-between pt-4 max-w-md mx-auto">
                     <Button variant="outline" onClick={() => setStep(4)}>Back</Button>
                     <Button onClick={handleFinish} variant="success">Finish Registration</Button>
                  </div>
               </div>
            )}
         </Card>
      </div>
   );
};

export const OpportunityBoard: React.FC<{ requests: Request[]; onAccept: (id: string) => void }> = ({ requests, onAccept }) => {
   const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
   const [dateFilter, setDateFilter] = useState('');
   const [viewingId, setViewingId] = useState<string | null>(null);

   const available = requests.filter(r =>
      r.status === RequestStatus.PENDING ||
      (r.isGroupEvent && r.status === RequestStatus.MATCHED && (r.enrolledVolunteers?.length || 0) < (r.maxVolunteers || 1))
   );

   const filtered = available.filter(r => {
      const matchesCat = selectedCategories.length === 0 || selectedCategories.includes(r.category);
      const matchesDate = !dateFilter || r.date === dateFilter;
      return matchesCat && matchesDate;
   });

   const categories = Object.values(RequestCategory);
   const toggleCategory = (cat: string) => {
      if (selectedCategories.includes(cat)) {
         setSelectedCategories(prev => prev.filter(c => c !== cat));
      } else {
         setSelectedCategories(prev => [...prev, cat]);
      }
   };

   return (
      <div className="space-y-6">
         <div className="flex flex-col md:flex-row justify-between items-end gap-4 bg-white dark:bg-black p-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="flex-1 overflow-x-auto pb-2 md:pb-0">
               <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Filter by Category</label>
               <div className="flex gap-2">
                  <button
                     onClick={() => setSelectedCategories([])}
                     className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${selectedCategories.length === 0 ? 'bg-slate-800 text-white border-slate-800 dark:bg-yellow-400 dark:text-black' : 'bg-white dark:bg-black text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                  >
                     All
                  </button>
                  {categories.map(cat => (
                     <button
                        key={cat}
                        onClick={() => toggleCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border whitespace-nowrap flex items-center gap-1
                  ${selectedCategories.includes(cat) ? 'bg-brand-600 text-white border-brand-600' : 'bg-white dark:bg-black text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}
                `}
                     >
                        {getCategoryIcon(cat as RequestCategory)} {cat}
                     </button>
                  ))}
               </div>
            </div>
            <div className="w-full md:w-auto">
               <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase mb-2 block">Date</label>
               <input
                  type="date"
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-black text-slate-700 dark:text-white text-sm outline-none focus:ring-2 focus:ring-brand-500"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
               />
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(req => (
               <div key={req.id} className="bg-white dark:bg-black rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
                  <div className={`h-2 ${getCategoryColor(req.category)}`} />
                  <div className="p-5 flex-1">
                     <div className="flex justify-between items-start mb-3">
                        <div className={`p-2 rounded-lg ${getCategoryColor(req.category)} bg-opacity-10 text-slate-700 dark:text-slate-300`}>
                           {getCategoryIcon(req.category)}
                        </div>
                        <div className="flex flex-col items-end">
                           <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">{req.category}</span>
                           {req.isGroupEvent && (
                              <span className="text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded mt-1">
                                 {req.enrolledVolunteers?.length || 0} / {req.maxVolunteers} Volunteers
                              </span>
                           )}
                        </div>
                     </div>
                     <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">{req.subcategory}</h3>
                     <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-4">
                        <MapPin size={14} className="mr-1" /> {req.geozone}
                     </div>
                     <div className="flex items-center text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2 rounded">
                        <Clock size={14} className="mr-2 text-brand-500" />
                        {req.isFlexible ? (
                           <span>Flexible: {req.flexStartDate} - {req.flexEndDate}</span>
                        ) : (
                           <span>{req.date} @ {req.pickupTime || req.timeWindow}</span>
                        )}
                     </div>
                  </div>
                  <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                     <Button className="w-full" onClick={() => setViewingId(req.id)}>View Details</Button>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-2 text-[10px] text-center text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-slate-700">
                     Client address revealed upon acceptance.
                  </div>
               </div>
            ))}
            {filtered.length === 0 && (
               <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 bg-white dark:bg-black rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  No opportunities match your filters.
               </div>
            )}
         </div>

         {viewingId && (
            <Modal isOpen={true} onClose={() => setViewingId(null)} title="Opportunity Details">
               <div className="space-y-4">
                  {(() => {
                     const req = requests.find(r => r.id === viewingId);
                     if (!req) return null;

                     // Group Event Logic
                     const isGroup = req.isGroupEvent;
                     const taken = req.enrolledVolunteers?.length || 0;
                     const max = req.maxVolunteers || 1;
                     const spotsLeft = max - taken;
                     const isFull = isGroup && spotsLeft <= 0;

                     return (
                        <>
                           <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded text-sm text-slate-700 dark:text-slate-300">
                              <div className="flex justify-between items-start mb-2">
                                 <p className="font-bold text-lg">{req.category} - {req.subcategory}</p>
                                 {isGroup && (
                                    <span className={`text-xs px-2 py-1 rounded font-bold ${isFull ? 'bg-rose-100 text-rose-800' : 'bg-blue-100 text-blue-800'}`}>
                                       {isFull ? 'Event Full' : `${spotsLeft} Spots Left`}
                                    </span>
                                 )}
                              </div>

                              {req.isFlexible ? (
                                 <div className="bg-blue-50 dark:bg-blue-900 border border-blue-100 dark:border-blue-800 p-3 rounded mb-2">
                                    <p className="font-bold text-blue-800 dark:text-blue-100 mb-1 flex items-center"><Calendar className="w-4 h-4 mr-2" /> Flexible Schedule</p>
                                    <p><strong>Range:</strong> {req.flexStartDate} to {req.flexEndDate}</p>
                                    <p><strong>Preferred:</strong> {req.flexTimes}</p>
                                    <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                                       Please connect with the client via phone or email to arrange a specific time that works for both of you.
                                    </p>
                                 </div>
                              ) : (
                                 <p><strong>When:</strong> {req.date} @ {req.timeWindow || req.pickupTime}</p>
                              )}

                              <p><strong>Where:</strong> {req.geozone} (Precise location hidden)</p>
                              <p className="mt-2"><strong>Description:</strong> {req.description}</p>
                              {isGroup && <p className="mt-2 text-xs text-blue-600 font-bold bg-blue-50 p-2 rounded">👥 This is a group event! Join other volunteers.</p>}
                           </div>
                           <p className="text-xs text-slate-500 dark:text-slate-400">By accepting, you commit to fulfilling this request. The client will be notified immediately.</p>
                           <div className="flex gap-2 justify-end">
                              <Button variant="outline" onClick={() => setViewingId(null)}>Cancel</Button>
                              <Button
                                 variant={isFull ? 'secondary' : 'success'}
                                 disabled={isFull}
                                 onClick={() => {
                                    if (req.isFlexible) {
                                       // In a real app, we might prompt for a specific time proposal here.
                                       // For now, accepting implies "I will coordinate".
                                       alert("Please contact the client to finalize the time.");
                                    }
                                    onAccept(req.id);
                                    setViewingId(null);
                                 }}
                              >
                                 {isGroup ? 'Join Group Event' : 'Accept & Connect'}
                              </Button>
                           </div>
                        </>
                     );
                  })()}
               </div>
            </Modal>
         )}
      </div>
   );
};

export const VolunteerResources: React.FC = () => (
   <div className="max-w-3xl mx-auto space-y-8">
      <div>
         <h2 className="text-3xl font-bold dark:text-white mb-2">Volunteer Handbook & Resources</h2>
         <p className="text-slate-600 dark:text-slate-300">Everything you need to succeed as a verified volunteer.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
         <Card title="Training Modules">
            <div className="space-y-4">
               <div className="p-4 border rounded-lg dark:border-slate-700 bg-white dark:bg-slate-900">
                  <div className="flex justify-between items-start mb-2">
                     <h4 className="font-bold dark:text-white">Module 1: Safety First</h4>
                     <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-bold">Completed</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Learn about safety protocols and boundaries.</p>
                  <Button size="sm" variant="outline" className="w-full">Review</Button>
               </div>
               <div className="p-4 border rounded-lg dark:border-slate-700 bg-white dark:bg-slate-900">
                  <h4 className="font-bold dark:text-white">Module 2: Platform Guide</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">How to use the NPVN app effectively.</p>
                  <Button size="sm" className="w-full">Start Module</Button>
               </div>
            </div>
         </Card>

         <Card title="Quick Downloads">
            <div className="space-y-3">
               <button className="flex items-center gap-3 w-full p-3 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200">
                  <div className="bg-red-50 text-red-600 p-2 rounded"><FileText size={20} /></div>
                  <div className="text-left">
                     <p className="font-bold text-sm text-slate-900 dark:text-white">Volunteer Handbook (PDF)</p>
                     <p className="text-xs text-slate-500">Full guidelines & policies</p>
                  </div>
               </button>
               <button className="flex items-center gap-3 w-full p-3 rounded hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200">
                  <div className="bg-blue-50 text-blue-600 p-2 rounded"><FileText size={20} /></div>
                  <div className="text-left">
                     <p className="font-bold text-sm text-slate-900 dark:text-white">Code of Conduct</p>
                     <p className="text-xs text-slate-500">Ethical standards agreement</p>
                  </div>
               </button>
            </div>
         </Card>
      </div>

      <Card title="Handbook Highlights & Policies">
         <div className="space-y-1">
            <Accordion title="Code of Conduct" defaultOpen icon={<ShieldCheck size={18} />}>
               <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  All volunteers must treat clients, staff, and fellow volunteers with respect and dignity. Discrimination, harassment, or exploitation of any kind will result in immediate termination.
               </p>
               <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-300">
                  <li>Be reliable and punctual.</li>
                  <li>Respect client privacy.</li>
                  <li>Maintain professional boundaries.</li>
               </ul>
            </Accordion>
            <Accordion title="Boundaries & Scope" icon={<Map size={18} />}>
               <p className="text-sm text-slate-600 dark:text-slate-300">
                  Volunteers are friends and neighbors, not medical professionals or home health aides. Do not perform medical tasks, handle client finances/banking, or provide personal hygiene care.
               </p>
            </Accordion>
            <Accordion title="Confidentiality" icon={<Lock size={18} />}>
               <p className="text-sm text-slate-600 dark:text-slate-300">
                  What you see and hear in a client's home stays there. Do not share client names, addresses, or conditions on social media or with others.
               </p>
            </Accordion>
            <Accordion title="Mandatory Reporting" icon={<AlertTriangle size={18} />}>
               <p className="text-sm text-slate-600 dark:text-slate-300">
                  If you witness signs of abuse or neglect (physical, emotional, or financial) of a senior or vulnerable adult, you are required to report it to the NPVN Coordinator immediately.
               </p>
            </Accordion>
         </div>
      </Card>

      <div className="space-y-4">
         <h3 className="text-xl font-bold dark:text-white">Frequently Asked Questions</h3>
         <div className="grid gap-4">
            <Card>
               <Accordion title="What if a client offers me money?" icon={<HelpCircle size={18} />}>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                     Please politely decline. You may suggest they donate to the North Plains Senior Center if they wish to show appreciation.
                  </p>
               </Accordion>
               <Accordion title="What do I do if I can't make a shift?" icon={<HelpCircle size={18} />}>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                     Cancel via the app as soon as possible so another volunteer can pick it up. If it's less than 24 hours notice, please call the Coordinator directly.
                  </p>
               </Accordion>
               <Accordion title="Can I bring my child or pet?" icon={<HelpCircle size={18} />}>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                     Generally, no. Unless explicitly cleared for a specific "family-friendly" group event, please volunteer solo to focus on the client.
                  </p>
               </Accordion>
            </Card>
         </div>
      </div>
   </div>
);

export const VolunteerHistory: React.FC<{ user: User; requests: Request[] }> = ({ user, requests }) => {
   const history = requests.filter(r => r.volunteerId === user.id && (r.status === RequestStatus.COMPLETED || r.status === RequestStatus.CANCELLED));

   return (
      <div className="space-y-6">
         <h2 className="text-2xl font-bold dark:text-white">My Volunteer History</h2>
         <Card>
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
               <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Category</th>
                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Client</th>
                     <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {history.map(req => (
                     <tr key={req.id}>
                        <td className="px-6 py-4 text-sm dark:text-slate-300">{req.date}</td>
                        <td className="px-6 py-4 text-sm dark:text-slate-300">{req.category}</td>
                        <td className="px-6 py-4 text-sm dark:text-slate-300">{req.clientName}</td>
                        <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                     </tr>
                  ))}
                  {history.length === 0 && <tr><td colSpan={4} className="p-4 text-center text-slate-500">No history yet.</td></tr>}
               </tbody>
            </table>
         </Card>
      </div>
   );
};

export const DualHistory: React.FC<{ user: User; requests: Request[] }> = ({ user, requests }) => {
   return (
      <div className="space-y-8">
         <VolunteerHistory user={user} requests={requests} />

         <div className="space-y-6">
            <h2 className="text-2xl font-bold dark:text-white">My Client History (Requests Made)</h2>
            <Card>
               <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                  <thead className="bg-slate-50 dark:bg-slate-800">
                     <tr>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Category</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 dark:text-slate-400 uppercase">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                     {requests.filter(r => r.clientId === user.id && (r.status === RequestStatus.COMPLETED || r.status === RequestStatus.CANCELLED)).map(req => (
                        <tr key={req.id}>
                           <td className="px-6 py-4 text-sm dark:text-slate-300">{req.date}</td>
                           <td className="px-6 py-4 text-sm dark:text-slate-300">{req.category}</td>
                           <td className="px-6 py-4"><StatusBadge status={req.status} /></td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </Card>
         </div>
      </div>
   );
};

export const SafetyReportingPage: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
   const [submitted, setSubmitted] = useState(false);

   if (submitted) {
      return (
         <Card className="text-center py-10">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
               <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold mb-2">Report Submitted</h2>
            <p className="text-slate-600 mb-6">Thank you for keeping our community safe. A coordinator will review this immediately.</p>
            <Button onClick={() => onNavigate('dashboard')}>Return to Dashboard</Button>
         </Card>
      );
   }

   return (
      <div className="max-w-2xl mx-auto py-8">
         <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6">Report a Safety Concern</h1>
         <Card>
            <div className="space-y-4">
               <Input label="Concern Category" as="select">
                  <option value="">Select Category...</option>
                  <option>Medical Emergency (Non-911)</option>
                  <option>Home Safety Hazard (Clutter, hygiene, etc.)</option>
                  <option>Client Behavioral Concern</option>
                  <option>Volunteer Injury</option>
                  <option>Animal / Pet Issue</option>
                  <option>Other</option>
               </Input>

               <Input label="Date & Time of Incident" type="datetime-local" />

               <Input label="Description of Incident/Concern" as="textarea" rows={4} placeholder="Please provide specific details..." />

               <div className="p-4 bg-blue-50 dark:bg-slate-800 rounded text-sm text-blue-800 dark:text-blue-200">
                  <p className="font-bold flex items-center gap-2"><Info size={16} /> Note</p>
                  <p>If this is an immediate emergency, please call 911. This form is for non-emergency reporting only.</p>
               </div>

               <div className="flex justify-end gap-4 pt-4">
                  <Button variant="outline" onClick={() => onNavigate('dashboard')}>Cancel</Button>
                  <Button variant="danger" onClick={() => setSubmitted(true)}>Submit Report</Button>
               </div>
            </div>
         </Card>
      </div>
   );
};

export const CommunityResources: React.FC = () => (
   <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Community Resources</h1>
      <p className="text-slate-600 dark:text-slate-300">Local services available to North Plains residents.</p>

      <div className="grid gap-6">
         <Card title="Food Assistance">
            <div className="space-y-4">
               <div className="border-b pb-4 last:border-0 dark:border-slate-700">
                  <h3 className="font-bold dark:text-white">North Plains Food Pantry</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Open Mondays & Thursdays, 4pm - 7pm.</p>
                  <p className="text-sm text-slate-500">312 Main St.</p>
               </div>
            </div>
         </Card>
         <Card title="Transportation">
            <div className="space-y-4">
               <div className="border-b pb-4 last:border-0 dark:border-slate-700">
                  <h3 className="font-bold dark:text-white">Ride Connection</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Free transportation for seniors and people with disabilities.</p>
                  <a href="#" className="text-brand-600 text-sm hover:underline">Visit Website</a>
               </div>
            </div>
         </Card>
      </div>
   </div>
);

export const VolunteerSettings: React.FC = () => (
   <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">Account Settings</h2>

      <Card title="Notification Preferences">
         <div className="space-y-3">
            <div className="flex items-center justify-between">
               <label className="font-medium text-slate-700 dark:text-slate-300">Email Notifications</label>
               <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-brand-600" />
            </div>
            <div className="flex items-center justify-between">
               <label className="font-medium text-slate-700 dark:text-slate-300">SMS / Text Alerts</label>
               <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-brand-600" />
            </div>
            <div className="flex items-center justify-between">
               <label className="font-medium text-slate-700 dark:text-slate-300">Marketing / Newsletters</label>
               <input type="checkbox" className="w-5 h-5 rounded text-brand-600" />
            </div>
         </div>
      </Card>

      <Card title="Security">
         <div className="space-y-4">
            <div>
               <label className="block text-sm font-bold mb-1">Current Password</label>
               <Input type="password" value="********" disabled />
            </div>
            <Button variant="outline">Change Password</Button>
         </div>
      </Card>

      <Card title="Privacy & Data">
         <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
               You can download a copy of your volunteer history and personal data.
            </p>
            <Button variant="outline">Download My Data</Button>

            <div className="border-t pt-4 mt-4 dark:border-slate-700">
               <p className="text-xs text-red-600 mb-2 font-bold">Danger Zone</p>
               <Button variant="danger" size="sm">Deactivate Account</Button>
            </div>
         </div>
      </Card>
   </div>
);

// --- Styling Helpers ---
const VolunteerSettingsDuplicate: React.FC = () => (
   <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">Account Settings</h2>

      <Card title="Notification Preferences">
         <div className="space-y-3">
            <div className="flex items-center justify-between">
               <label className="font-medium text-slate-700 dark:text-slate-300">Email Notifications</label>
               <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-brand-600" />
            </div>
            <div className="flex items-center justify-between">
               <label className="font-medium text-slate-700 dark:text-slate-300">SMS / Text Alerts</label>
               <input type="checkbox" defaultChecked className="w-5 h-5 rounded text-brand-600" />
            </div>
            <div className="flex items-center justify-between">
               <label className="font-medium text-slate-700 dark:text-slate-300">Marketing / Newsletters</label>
               <input type="checkbox" className="w-5 h-5 rounded text-brand-600" />
            </div>
         </div>
      </Card>

      <Card title="Security">
         <div className="space-y-4">
            <div>
               <label className="block text-sm font-bold mb-1">Current Password</label>
               <Input type="password" value="********" disabled />
            </div>
            <Button variant="outline">Change Password</Button>
         </div>
      </Card>

      <Card title="Privacy & Data">
         <div className="space-y-4">
            <p className="text-sm text-slate-600 dark:text-slate-300">
               You can download a copy of your volunteer history and personal data.
            </p>
            <Button variant="outline">Download My Data</Button>

            <div className="border-t pt-4 mt-4 dark:border-slate-700">
               <p className="text-xs text-red-600 mb-2 font-bold">Danger Zone</p>
               <Button variant="danger" size="sm">Deactivate Account</Button>
            </div>
         </div>
      </Card>
   </div>
);

const getCategoryColor = (cat: RequestCategory) => {
   switch (cat) {
      case RequestCategory.RIDE: return 'bg-blue-500 text-blue-500';
      case RequestCategory.SHOPPING: return 'bg-green-500 text-green-500';
      case RequestCategory.SOCIAL: return 'bg-purple-500 text-purple-500';
      case RequestCategory.HOME_HELP: return 'bg-orange-500 text-orange-500';
      default: return 'bg-slate-500 text-slate-500';
   }
};

const getCategoryIcon = (cat: RequestCategory) => {
   switch (cat) {
      case RequestCategory.RIDE: return <Car size={16} />;
      case RequestCategory.SHOPPING: return <ShoppingBasket size={16} />;
      case RequestCategory.SOCIAL: return <Heart size={16} />;
      case RequestCategory.HOME_HELP: return <Home size={16} />;
      default: return <HelpCircle size={16} />;
   }
};
