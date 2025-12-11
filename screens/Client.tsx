import React, { useState, useEffect } from 'react';
import { Request, RequestStatus, RequestCategory, User, OnboardingStep } from '../types';
import { Card, Button, StatusBadge, Input, Modal, ProgressBar, Tabs } from '../components/UI';
import { Calendar, MapPin, Clock, AlertTriangle, CheckCircle, ShieldCheck, CreditCard, Heart, ChevronRight, ChevronLeft, Phone, Mail, HelpCircle } from 'lucide-react';
import { VolunteerDashboard } from './Volunteer';
import { MOCK_USERS } from '../services/mockData';
import { useTheme } from '../context/ThemeContext';

interface ClientProps {
   user: User;
   requests: Request[];
   onCreateRequest: (r: Partial<Request>) => void;
   onUpdateUser: (u: Partial<User>) => void;
   onNavigate: (p: string) => void;
   onCompleteSurvey: (reqId: string, data: any) => void;
}

export interface DualProps {
   user: User;
   requests: Request[];
   actions: {
      onCreateRequest: (r: Partial<Request>) => void;
      onUpdateUser: (u: Partial<User>) => void;
      onNavigate: (p: string) => void;
      onCompleteSurvey: (reqId: string, data: any) => void;
      onAccept: (id: string) => void;
      onCompleteRequest: (reqId: string, data: any) => void;
      onWithdraw: (reqId: string, reason: string) => void;
   };
}

export const ClientDashboard: React.FC<ClientProps> = ({ user, requests, onCreateRequest, onUpdateUser, onNavigate, onCompleteSurvey }) => {
   const [surveyRequest, setSurveyRequest] = useState<Request | null>(null);
   const { t } = useTheme();

   // Check for onboarding
   if (user.onboardingStep !== OnboardingStep.COMPLETE) {
      return <ClientOnboarding user={user} onUpdate={onUpdateUser} />;
   }

   // Check for mandatory surveys (1 hour after service completion)
   useEffect(() => {
      const now = new Date();
      const pendingSurvey = requests.find(r => {
         if (r.status !== RequestStatus.COMPLETED || r.clientSurveyCompleted) return false;

         // Parse request date and time
         const [y, m, d] = r.date.split('-').map(Number);
         let serviceDateTime = new Date(y, m - 1, d);

         // Extract time from timeWindow, appointmentTime, or pickupTime
         const timeStr = r.appointmentTime || r.pickupTime || r.timeWindow;
         if (timeStr) {
            const match = timeStr.match(/(\d+):(\d+)/);
            if (match) {
               let hours = parseInt(match[1]);
               const minutes = parseInt(match[2]);
               if (timeStr.toLowerCase().includes('pm') && hours < 12) hours += 12;
               if (timeStr.toLowerCase().includes('am') && hours === 12) hours = 0;
               serviceDateTime.setHours(hours, minutes);
            }
         }

         // Add 1 hour delay
         const oneHourAfter = new Date(serviceDateTime.getTime() + 60 * 60 * 1000);

         // Show survey if current time is at least 1 hour after service time
         return now >= oneHourAfter;
      });

      if (pendingSurvey) {
         setSurveyRequest(pendingSurvey);
      }
   }, [requests]);

   const activeRequests = requests.filter(r =>
      [RequestStatus.PENDING, RequestStatus.MATCHED, RequestStatus.IN_PROGRESS].includes(r.status)
   );

   const historyRequests = requests.filter(r =>
      [RequestStatus.COMPLETED, RequestStatus.CANCELLED, RequestStatus.EXPIRED].includes(r.status)
   );

   return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Content Area */}
         <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center">
               <h2 className="text-2xl font-bold text-slate-900 dark:text-yellow-400">{t('welcome')}, {user.preferredName || user.name}</h2>
               <Button onClick={() => onNavigate('create-request')}>{t('client.new_request')}</Button>
            </div>

            {/* Active Requests */}
            <section>
               <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-4">{t('client.active_upcoming')}</h3>
               {activeRequests.length === 0 ? (
                  <Card className="p-8 text-center text-slate-500 dark:text-slate-300">{t('client.no_active')}</Card>
               ) : (
                  <div className="grid gap-6">
                     {activeRequests.map(req => (
                        <RequestCard key={req.id} request={req} />
                     ))}
                  </div>
               )}
            </section>

            {/* History */}
            <section>
               <h3 className="text-lg font-semibold text-slate-700 dark:text-white mb-4">{t('client.history')}</h3>
               <Card className="overflow-hidden">
                  <div className="overflow-x-auto">
                     <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800">
                           <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Type</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Volunteer</th>
                           </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-black divide-y divide-slate-200 dark:divide-slate-700">
                           {historyRequests.map(req => (
                              <tr key={req.id}>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900 dark:text-white">{req.date}</td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{req.category}</td>
                                 <td className="px-6 py-4 whitespace-nowrap"><StatusBadge status={req.status} /></td>
                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">{req.volunteerName || '-'}</td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </Card>
            </section>
         </div>

         {/* Sidebar Area */}
         <div className="space-y-6">
            {/* Training Center for Clients */}
            <Card title={t('client.training')}>
               <div className="space-y-2">
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                     <div className="bg-brand-600 dark:bg-yellow-400 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 text-right">Platform Overview: Complete</p>
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => onNavigate('client-resources')}>View Resources</Button>
               </div>
            </Card>

            {/* Local Resource Directory */}
            <Card title={t('client.directory')}>
               <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">Access local food, housing, and transportation resources.</p>
               <Button variant="secondary" className="w-full" onClick={() => onNavigate('resources')}>View Local Directory</Button>
            </Card>

            {/* Notifications */}
            <Card title={t('client.notifications')}>
               <div className="space-y-3">
                  {activeRequests.some(r => r.status === RequestStatus.MATCHED) && (
                     <div className="flex items-start gap-3 p-2 bg-blue-50 dark:bg-slate-800 rounded border border-blue-100 dark:border-slate-600 text-sm">
                        <div className="w-2 h-2 mt-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                        <div>
                           <p className="font-bold text-blue-900 dark:text-blue-300">Volunteer Assigned!</p>
                           <p className="text-xs text-blue-700 dark:text-blue-200">A neighbor has picked up your request.</p>
                        </div>
                     </div>
                  )}
                  <div className="flex items-start gap-3 p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded transition-colors text-sm">
                     <div className="w-2 h-2 mt-1.5 bg-green-500 rounded-full flex-shrink-0" />
                     <div>
                        <p className="font-medium text-slate-800 dark:text-white">System Update</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Holiday hours updated for support.</p>
                     </div>
                  </div>
               </div>
            </Card>

            {/* Announcements */}
            <Card title={t('client.announcements')}>
               <div className="space-y-3">
                  <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm">
                     <p className="font-bold text-slate-800 dark:text-white mb-1">📢 Senior Center Events</p>
                     <p className="text-slate-600 dark:text-slate-300">Lunch & Learn this Friday at 12pm.</p>
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
               <div className="flex items-start gap-3">
                  <div className="p-2 bg-white dark:bg-black rounded-full text-slate-400 border border-slate-200 dark:border-slate-700">
                     <HelpCircle size={20} />
                  </div>
                  <div>
                     <h4 className="font-bold text-slate-900 dark:text-white">{t('need_help')}</h4>
                     <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{t('contact_support')}</p>
                     <div className="space-y-1">
                        <p className="text-sm font-bold text-brand-700 dark:text-yellow-400 flex items-center gap-2">
                           <Phone size={14} /> 971-712-3845
                        </p>
                        <p className="text-sm font-bold text-brand-700 dark:text-yellow-400 flex items-center gap-2">
                           <Mail size={14} /> npvolunteernetwork@gmail.com
                        </p>
                     </div>
                  </div>
               </div>
            </Card>
         </div>

         {/* Mandatory Survey Modal */}
         {surveyRequest && (
            <PostServiceSurvey
               request={surveyRequest}
               onSubmit={(data) => {
                  onCompleteSurvey(surveyRequest.id, data);
                  setSurveyRequest(null);
               }}
            />
         )}
      </div>
   );
};

export const DualDashboard: React.FC<DualProps> = ({ user, requests, actions }) => {
   const [view, setView] = useState<'CLIENT' | 'VOLUNTEER'>('CLIENT');
   const { t } = useTheme();

   return (
      <div className="space-y-6">
         <Tabs
            tabs={[t('client.active_upcoming'), t('vol.my_assignments')]}
            activeTab={view === 'CLIENT' ? t('client.active_upcoming') : t('vol.my_assignments')}
            onChange={(tab) => setView(tab === t('client.active_upcoming') ? 'CLIENT' : 'VOLUNTEER')}
         />

         {view === 'CLIENT' ? (
            <ClientDashboard
               user={user}
               requests={requests.filter(r => r.clientId === user.id)}
               onCreateRequest={actions.onCreateRequest}
               onUpdateUser={actions.onUpdateUser}
               onNavigate={actions.onNavigate}
               onCompleteSurvey={actions.onCompleteSurvey}
            />
         ) : (
            <VolunteerDashboard
               user={user}
               requests={requests}
               onAccept={actions.onAccept}
               onNavigate={actions.onNavigate}
               onUpdateUser={actions.onUpdateUser}
               onCompleteRequest={actions.onCompleteRequest}
               onWithdraw={actions.onWithdraw}
            />
         )}
      </div>
   );
};

const ClientOnboarding: React.FC<{ user: User; onUpdate: (u: Partial<User>) => void }> = ({ user, onUpdate }) => {
   const [step, setStep] = useState(1);
   const [formData, setFormData] = useState<Partial<User>>({
      ...user,
      incomeSources: user.incomeSources || [],
      nonCashBenefits: user.nonCashBenefits || []
   });

   // Logic for Preferred Language 'Other'
   const STANDARD_LANGUAGES = ['English', 'Spanish'];
   const [langSelect, setLangSelect] = useState<string>('');

   useEffect(() => {
      if (formData.preferredLanguage && STANDARD_LANGUAGES.includes(formData.preferredLanguage)) {
         setLangSelect(formData.preferredLanguage);
      } else if (formData.preferredLanguage) {
         setLangSelect('Other');
      } else {
         setLangSelect('');
      }
   }, []);

   const handleLanguageChange = (val: string) => {
      setLangSelect(val);
      if (val !== 'Other') {
         setFormData(prev => ({ ...prev, preferredLanguage: val }));
      } else {
         setFormData(prev => ({ ...prev, preferredLanguage: '' }));
      }
   };

   const toggleArrayItem = (field: 'incomeSources' | 'nonCashBenefits', item: string) => {
      const current = formData[field] || [];
      if (current.includes(item)) {
         setFormData({ ...formData, [field]: current.filter(i => i !== item) });
      } else {
         setFormData({ ...formData, [field]: [...current, item] });
      }
   };

   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'avatar') => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setFormData(prev => ({ ...prev, [field]: reader.result as string }));
         };
         reader.readAsDataURL(file);
      }
   };

   const handleNext = () => setStep(s => s + 1);
   const handleFinish = () => {
      onUpdate({ ...formData, onboardingStep: OnboardingStep.COMPLETE, intakeDate: new Date().toISOString().split('T')[0] });
   };

   return (
      <div className="max-w-2xl mx-auto py-8">
         <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-6 text-center">Welcome to NPVN</h1>
         <p className="text-slate-600 dark:text-slate-300 text-center mb-8">Please complete your profile. This information is required for our grant reporting.</p>

         <ProgressBar current={step} total={5} labels={['Profile', 'Identity', 'Household', 'Health', 'Contact']} />

         <Card>
            {step === 1 && (
               <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Step 1: Personal Profile</h2>
                  <div className="grid grid-cols-2 gap-4">
                     <Input label="First Name" value={formData.name?.split(' ')[0] || ''} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                     <Input label="Last Name" placeholder="Smith" />
                  </div>
                  <Input label="Preferred Name (Optional)" value={formData.preferredName || ''} onChange={e => setFormData({ ...formData, preferredName: e.target.value })} />
                  <Input label="Address" value="North Plains, OR 97133" disabled className="bg-slate-50 dark:bg-slate-800" />
                  <Input label="Date of Birth" type="date" value={formData.dob || ''} onChange={e => setFormData({ ...formData, dob: e.target.value })} />

                  <div className="grid grid-cols-1 gap-6 pt-4">
                     {/* Profile Photo */}
                     <div className="bg-blue-50 dark:bg-slate-800 p-4 rounded border border-blue-200 dark:border-slate-600">
                        <label className="block text-sm font-bold text-blue-900 dark:text-blue-300 mb-2 flex items-center">
                           <ShieldCheck size={18} className="mr-2" />
                           Profile Photo
                        </label>
                        <Input label="" type="file" className="bg-white dark:bg-black" onChange={(e) => handleFileUpload(e as React.ChangeEvent<HTMLInputElement>, 'avatar')} />
                        <p className="text-sm font-bold text-blue-800 dark:text-blue-200 mt-2">
                           "This helps volunteers recognize you safely."
                        </p>
                     </div>
                  </div>

                  <div className="flex justify-end pt-4">
                     <Button onClick={handleNext}>Next Step</Button>
                  </div>
               </div>
            )}

            {/* ... (Other onboarding steps omitted for brevity, logic remains similar with dark mode classes) ... */}
            {/* I'll include the next steps with dark mode fixes */}

            {step === 2 && (
               <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Step 2: Identity & Demographics</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">HUD-required demographic information.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input label="Gender" as="select" value={formData.gender || ''} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                        <option value="">Select...</option>
                        <option>Female</option>
                        <option>Male</option>
                        <option>Non-binary</option>
                        <option>Prefer not to say</option>
                     </Input>
                     <Input label="Veteran Status" as="select" value={formData.veteranStatus !== undefined ? (formData.veteranStatus ? 'Yes' : 'No') : ''} onChange={e => setFormData({ ...formData, veteranStatus: e.target.value === 'Yes' })}>
                        <option value="">Select...</option>
                        <option value="Yes">Yes, I am a veteran</option>
                        <option value="No">No</option>
                     </Input>
                  </div>

                  <Input label="Ethnicity" as="select" value={formData.ethnicity || ''} onChange={e => setFormData({ ...formData, ethnicity: e.target.value as any })}>
                     <option value="">Select...</option>
                     <option value="Hispanic/Latino">Hispanic or Latino</option>
                     <option value="Not Hispanic/Latino">Not Hispanic or Latino</option>
                  </Input>

                  <Input label="Race (HUD)" as="select" value={formData.race || ''} onChange={e => setFormData({ ...formData, race: e.target.value })}>
                     <option value="">Select...</option>
                     <option value="White">White</option>
                     <option value="Black">Black or African American</option>
                     <option value="Asian">Asian</option>
                     <option value="Native">American Indian or Alaska Native</option>
                     <option value="Pacific">Native Hawaiian / Pacific Islander</option>
                     <option value="Multi">Multi-Racial</option>
                  </Input>

                  <div>
                     <Input label="Preferred Language" as="select" value={langSelect} onChange={e => handleLanguageChange(e.target.value)}>
                        <option value="">Select...</option>
                        <option>English</option>
                        <option>Spanish</option>
                        <option>Other</option>
                     </Input>
                     {langSelect === 'Other' && (
                        <Input label="Specify Language" value={formData.preferredLanguage || ''} onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value })} />
                     )}
                  </div>

                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
                     <Button onClick={handleNext}>Next Step</Button>
                  </div>
               </div>
            )}

            {step === 3 && (
               <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Step 3: Household & Financial</h2>

                  <div className="grid grid-cols-2 gap-4">
                     <Input label="Household Type" as="select" value={formData.householdType || ''} onChange={e => setFormData({ ...formData, householdType: e.target.value })}>
                        <option value="">Select...</option>
                        <option>Single Adult</option>
                        <option>Couple</option>
                        <option>Family with Children</option>
                        <option>Multi-generational</option>
                     </Input>
                     <Input label="Household Size" type="number" value={formData.householdSize || ''} onChange={e => setFormData({ ...formData, householdSize: parseInt(e.target.value) })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <label className="flex items-center gap-2 text-sm dark:text-slate-300"><input type="checkbox" checked={formData.hasMinors || false} onChange={e => setFormData({ ...formData, hasMinors: e.target.checked })} /> Household includes minors</label>
                     <label className="flex items-center gap-2 text-sm dark:text-slate-300"><input type="checkbox" checked={formData.hasSeniors || false} onChange={e => setFormData({ ...formData, hasSeniors: e.target.checked })} /> Household includes seniors</label>
                  </div>

                  <div className="border-t pt-4">
                     <Input label="Annual Income Range" as="select" value={formData.incomeRange || ''} onChange={e => setFormData({ ...formData, incomeRange: e.target.value })}>
                        <option value="">Select...</option>
                        <option value="0-30k">Under $30,000</option>
                        <option value="30k-50k">$30,000 - $50,000</option>
                        <option value="50k-80k">$50,000 - $80,000</option>
                        <option value="80k+">Over $80,000</option>
                     </Input>

                     <div className="mt-2">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Income Sources (Select all that apply)</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                           {['Wages', 'Social Security', 'SSI', 'SSDI', 'Pension', 'Unemployment', 'None'].map(src => (
                              <label key={src} className="flex items-center gap-2 dark:text-slate-300">
                                 <input type="checkbox" checked={formData.incomeSources?.includes(src)} onChange={() => toggleArrayItem('incomeSources', src)} />
                                 {src}
                              </label>
                           ))}
                        </div>
                     </div>

                     <div className="mt-4">
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Non-Cash Benefits</p>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                           {['SNAP', 'WIC', 'TANF', 'VA Benefits', 'Housing Voucher'].map(ben => (
                              <label key={ben} className="flex items-center gap-2 dark:text-slate-300">
                                 <input type="checkbox" checked={formData.nonCashBenefits?.includes(ben)} onChange={() => toggleArrayItem('nonCashBenefits', ben)} />
                                 {ben}
                              </label>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
                     <Button onClick={handleNext}>Next Step</Button>
                  </div>
               </div>
            )}

            {step === 4 && (
               <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Step 4: Health & Disability</h2>

                  <Input label="Do you have a disability?" as="select" value={formData.disabilityStatus !== undefined ? (formData.disabilityStatus ? 'Yes' : 'No') : ''} onChange={e => setFormData({ ...formData, disabilityStatus: e.target.value === 'Yes' })}>
                     <option value="">Select...</option>
                     <option value="Yes">Yes</option>
                     <option value="No">No</option>
                  </Input>

                  {formData.disabilityStatus && (
                     <div className="space-y-4 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                        <Input label="Disability Type (Optional)" placeholder="e.g. Physical, Developmental" value={formData.disabilityType || ''} onChange={e => setFormData({ ...formData, disabilityType: e.target.value })} />
                        <Input label="Does this affect your ability to live independently?" as="select" value={formData.affectsIndependence !== undefined ? (formData.affectsIndependence ? 'Yes' : 'No') : ''} onChange={e => setFormData({ ...formData, affectsIndependence: e.target.value === 'Yes' })}>
                           <option value="">Select...</option>
                           <option value="Yes">Yes</option>
                           <option value="No">No</option>
                        </Input>
                     </div>
                  )}

                  <div className="space-y-3 border-t pt-4">
                     <h3 className="font-bold text-slate-900 dark:text-white">Functional Needs</h3>
                     <div className="grid grid-cols-3 gap-4">
                        <Input label="Hearing Impaired?" as="select" onChange={e => setFormData({ ...formData, accessibility: { ...(formData.accessibility || { vision: 'Unknown', mobility: "" }), hearing: e.target.value } })}>
                           <option value="Unknown">Unknown</option><option value="Yes">Yes</option><option value="No">No</option>
                        </Input>
                        <Input label="Vision Impaired?" as="select" onChange={e => setFormData({ ...formData, accessibility: { ...(formData.accessibility || { hearing: 'Unknown', mobility: "" }), vision: e.target.value } })}>
                           <option value="Unknown">Unknown</option><option value="Yes">Yes</option><option value="No">No</option>
                        </Input>
                     </div>
                     <Input label="Mobility Needs" as="select" value={formData.accessibility?.mobility || ''} onChange={e => setFormData({ ...formData, accessibility: { ...(formData.accessibility || { hearing: 'Unknown', vision: 'Unknown' }), mobility: e.target.value } })}>
                        <option value="">None / Unknown</option>
                        <option value="Walker">Uses Walker</option>
                        <option value="Wheelchair">Uses Wheelchair</option>
                        <option value="Stairs difficult">Stairs are difficult</option>
                     </Input>
                  </div>

                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
                     <Button onClick={handleNext}>Next Step</Button>
                  </div>
               </div>
            )}

            {step === 5 && (
               <div className="space-y-4">
                  <h2 className="text-xl font-bold mb-4">Step 5: Contact & Interests</h2>

                  <div className="grid grid-cols-2 gap-4">
                     <Input label="Phone Number" value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                     <Input label="Email" value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                  <Input label="Preferred Contact Method" as="select" value={formData.preferredContactMethod || ''} onChange={e => setFormData({ ...formData, preferredContactMethod: e.target.value as any })}>
                     <option value="">Select...</option>
                     <option>Call</option>
                     <option>Text</option>
                     <option>Email</option>
                  </Input>

                  <h3 className="font-bold text-slate-700 dark:text-slate-300 pt-2">Emergency Contact</h3>
                  <div className="grid grid-cols-2 gap-4">
                     <Input label="Name" value={formData.emergencyContact?.name || ''} onChange={e => setFormData({ ...formData, emergencyContact: { ...(formData.emergencyContact || { phone: '', relation: '' }), name: e.target.value } })} />
                     <Input label="Phone" value={formData.emergencyContact?.phone || ''} onChange={e => setFormData({ ...formData, emergencyContact: { ...(formData.emergencyContact || { name: '', relation: '' }), phone: e.target.value } })} />
                  </div>
                  <Input label="Relationship" value={formData.emergencyContact?.relation || ''} onChange={e => setFormData({ ...formData, emergencyContact: { ...(formData.emergencyContact || { name: '', phone: '' }), relation: e.target.value } })} />

                  <div className="space-y-2 border-t pt-4">
                     <label className="font-medium text-slate-700 dark:text-slate-300">Pets</label>
                     <Input label="Pet Details" placeholder="e.g., 1 Friendly Dog named Spot" value={formData.pets || ''} onChange={e => setFormData({ ...formData, pets: e.target.value })} />
                  </div>
                  <Input label="Hobbies & Interests" as="textarea" value={formData.hobbies?.join(', ') || ''} onChange={e => setFormData({ ...formData, hobbies: e.target.value.split(', ') })} />

                  <Input label="How did you hear about us? (Referral)" value={formData.referralSource || ''} onChange={e => setFormData({ ...formData, referralSource: e.target.value })} />

                  <div className="flex justify-between pt-6">
                     <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
                     <Button variant="success" onClick={handleFinish}>Complete Profile</Button>
                  </div>
               </div>
            )}
         </Card>
      </div>
   );
};

const RequestCard: React.FC<{ request: Request }> = ({ request }) => {
   // Mock lookup for volunteer hobbies if matched
   const volunteer = Object.values(MOCK_USERS).find(u => u.id === request.volunteerId);

   return (
      <Card className="relative border-l-4 border-l-brand-500 dark:bg-slate-900">
         <div className="flex justify-between items-start mb-4">
            <div>
               <h4 className="font-bold text-lg text-slate-900 dark:text-white">{request.category}</h4>
               <p className="text-slate-500 dark:text-slate-300 text-sm">{request.subcategory}</p>
            </div>
            <StatusBadge status={request.status} />
         </div>

         <div className="space-y-3 text-sm text-slate-700 dark:text-slate-300 mb-6">
            <div className="flex items-center">
               <Calendar className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
               <span>{request.date} @ {request.timeWindow || request.appointmentTime}</span>
            </div>
            <div className="flex items-center">
               <MapPin className="w-4 h-4 mr-2 text-slate-400 dark:text-slate-500" />
               <span>{request.category === RequestCategory.RIDE ? `To: ${request.destinationAddress || 'Destination'}` : request.location}</span>
            </div>
            {request.volunteerName ? (
               <div className="bg-green-50 dark:bg-green-900/30 rounded-md text-green-800 dark:text-green-300 border border-green-100 dark:border-green-800 mt-2">
                  <div className="flex items-center p-3">
                     <CheckCircle className="w-5 h-5 mr-2" />
                     <div>
                        <p className="font-bold text-xs uppercase">Your Volunteer</p>
                        <span className="font-medium">{request.volunteerName}</span>
                     </div>
                  </div>
                  {/* Display Volunteer Hobbies */}
                  {volunteer && volunteer.hobbies && (
                     <div className="px-3 pb-3 pt-0 text-xs border-t border-green-100 dark:border-green-800 mt-2">
                        <p className="font-bold mt-2 text-green-700 dark:text-green-300 flex items-center gap-1"><Heart size={10} /> Hobbies:</p>
                        <p>{volunteer.hobbies.join(', ')}</p>
                     </div>
                  )}
               </div>
            ) : (
               <div className="flex items-center p-2 bg-amber-50 dark:bg-amber-900/30 rounded-md text-amber-800 dark:text-amber-300 border border-amber-100 dark:border-amber-800 mt-2 text-xs">
                  Looking for a neighbor to help...
               </div>
            )}
         </div>

         <div className="flex space-x-3">
            <Button size="sm" variant="outline" className="flex-1">Edit</Button>
            {request.status === RequestStatus.PENDING && (
               <Button size="sm" variant="danger" className="flex-1">Cancel</Button>
            )}
         </div>
      </Card>
   );
};

export const CreateRequestFlow: React.FC<{ onSubmit: (data: Partial<Request>) => void; onCancel: () => void }> = ({ onSubmit, onCancel }) => {
   // ... content largely the same, but Card and Inputs handle themselves. 
   // We just need to check for hardcoded text colors.
   // I'll update the component structure to include dark mode classes where needed.

   const [step, setStep] = useState(1);
   const [data, setData] = useState<Partial<Request>>({
      category: RequestCategory.RIDE,
      isRecurring: false
   });

   const SUBCATEGORY_OPTIONS: Record<string, string[]> = {
      [RequestCategory.RIDE]: ['Medical Appointment', 'Work/Job Interview', 'Social Event', 'Errand Run', 'Other'],
      [RequestCategory.SHOPPING]: ['Grocery Shopping', 'Post Office Run', 'Library Drop-off', 'Donation Drop-off', 'Other'],
      [RequestCategory.HOME_HELP]: ['Light Bulb Replacement', 'Smoke Alarm Battery', 'Moving Furniture/Boxes', 'Safety Check', 'Holiday Decoration', 'Garden/Yard Help', 'Other'],
      [RequestCategory.SOCIAL]: ['Friendly Visit', 'Phone Check-in', 'Walk Companion', 'Game/Activity Buddy', 'Reading Helper', 'Other'],
   };

   const categories = Object.values(RequestCategory);
   const handleNext = () => setStep(s => s + 1);
   const handleBack = () => setStep(s => s - 1);

   return (
      <div className="max-w-2xl mx-auto py-8">
         <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">New Request</h1>
            <Button variant="outline" size="sm" onClick={onCancel}>Cancel</Button>
         </div>

         <ProgressBar current={step} total={3} labels={['Category', 'Details', 'Review']} />

         <Card>
            {step === 1 && (
               <div className="space-y-6">
                  <h2 className="text-xl font-bold">What do you need help with?</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {categories.map(cat => (
                        <div
                           key={cat}
                           onClick={() => setData({ ...data, category: cat })}
                           className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${data.category === cat ? 'border-brand-500 bg-brand-50 dark:bg-slate-800 dark:border-yellow-400' : 'border-slate-200 dark:border-slate-700 hover:border-brand-200'}`}
                        >
                           <h3 className="font-bold text-slate-900 dark:text-white">{cat}</h3>
                           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Select for {cat.toLowerCase()} assistance.</p>
                        </div>
                     ))}
                  </div>

                  <div className="mt-4">
                     {data.category !== RequestCategory.OTHER ? (
                        <>
                           <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type of Errand / Task (Subcategory)</label>
                           <select
                              className="w-full px-4 py-2 rounded-lg border border-slate-300 bg-white dark:bg-black dark:border-slate-600 dark:text-white"
                              value={data.subcategory || ''}
                              onChange={e => setData({ ...data, subcategory: e.target.value })}
                           >
                              <option value="">Select...</option>
                              {SUBCATEGORY_OPTIONS[data.category || '']?.map(opt => (
                                 <option key={opt} value={opt}>{opt}</option>
                              ))}
                           </select>
                           <p className="text-xs text-slate-500 mt-1">Choose the specific task type from the list.</p>
                        </>
                     ) : (
                        <p className="text-sm text-slate-500 italic">No subcategories for "Other". Please describe your request in the next step.</p>
                     )}
                  </div>

                  <div className="flex justify-end pt-4">
                     <Button onClick={handleNext}>Next Step <ChevronRight size={16} className="ml-2" /></Button>
                  </div>
               </div>
            )}

            {/* Step 2 and 3 omitted for brevity but would follow same pattern. */}
            {step === 2 && (
               <div className="space-y-4">
                  <h2 className="text-xl font-bold">Request Details</h2>

                  <div className="bg-white dark:bg-black border border-slate-200 dark:border-slate-800 p-4 rounded-lg space-y-4">
                     <div className="flex items-center gap-3 mb-2">
                        <input
                           type="checkbox"
                           id="isFlexible"
                           className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                           checked={data.isFlexible || false}
                           onChange={e => setData({ ...data, isFlexible: e.target.checked })}
                        />
                        <label htmlFor="isFlexible" className="font-medium text-slate-900 dark:text-white cursor-pointer select-none">
                           Is the date/time variable?
                        </label>
                     </div>

                     {data.isFlexible ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                           <Input label="Start Date Range" type="date" value={data.flexStartDate || ''} onChange={e => setData({ ...data, flexStartDate: e.target.value })} />
                           <Input label="End Date Range" type="date" value={data.flexEndDate || ''} onChange={e => setData({ ...data, flexEndDate: e.target.value })} />
                           <div className="md:col-span-2">
                              <Input label="Preferred Times / Range" placeholder="e.g. Mon-Wed Afternoons, or Any day 9am-12pm" value={data.flexTimes || ''} onChange={e => setData({ ...data, flexTimes: e.target.value })} />
                           </div>
                        </div>
                     ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in">
                           <Input label="Date Needed" type="date" value={data.date || ''} onChange={e => setData({ ...data, date: e.target.value })} />
                           <Input label="Time Needed" type="time" value={data.timeWindow || ''} onChange={e => setData({ ...data, timeWindow: e.target.value })} />
                        </div>
                     )}
                  </div>

                  {data.category === RequestCategory.RIDE ? (
                     <div className="space-y-4 pt-2">
                        <Input
                           label="Pickup Address"
                           value={data.pickupAddress || '123 Main St, North Plains (Home)'}
                           onChange={e => setData({ ...data, pickupAddress: e.target.value })}
                           placeholder="Enter pickup location"
                        />
                        <Input
                           label="Destination Address"
                           value={data.destinationAddress || ''}
                           onChange={e => setData({ ...data, destinationAddress: e.target.value })}
                           placeholder="e.g. 500 N 10th Ave, Hillsboro (Clinic)"
                        />
                        <p className="text-xs text-slate-500">Volunteers will see exact addresses only after accepting.</p>
                     </div>
                  ) : data.category === RequestCategory.OTHER ? (
                     <Input
                        label="Address / Location"
                        value={data.location || ''}
                        onChange={e => setData({ ...data, location: e.target.value })}
                        placeholder="Enter the specific address for this request"
                     />
                  ) : (
                     <Input
                        label="Service Address"
                        value={data.location || ''}
                        onChange={e => setData({ ...data, location: e.target.value })}
                        placeholder="e.g. 123 Main St, North Plains"
                     />
                  )}

                  <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-100 dark:border-slate-800">
                     <div className="flex items-center gap-3">
                        <input
                           type="checkbox"
                           id="groupEvent"
                           className="w-5 h-5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                           checked={data.isGroupEvent || false}
                           onChange={e => setData({ ...data, isGroupEvent: e.target.checked, maxVolunteers: e.target.checked ? 2 : 1 })}
                        />
                        <label htmlFor="groupEvent" className="font-medium text-slate-900 dark:text-white cursor-pointer select-none flex items-center gap-2">
                           Is this a group event?
                           <div className="relative group">
                              <HelpCircle size={16} className="text-slate-400 cursor-help" />
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 bg-slate-900 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                 Group events allow multiple volunteers to sign up for a single large task (e.g., yard cleanup, moving help). Enables tracking of spots filled vs. needed.
                              </div>
                           </div>
                        </label>
                     </div>
                     {data.isGroupEvent && (
                        <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                           <Input
                              label="How many volunteers are needed?"
                              type="number"
                              min={2}
                              max={20}
                              value={data.maxVolunteers || 2}
                              onChange={e => setData({ ...data, maxVolunteers: parseInt(e.target.value) })}
                           />
                           <p className="text-xs text-slate-500">Multiple volunteers will be able to sign up for this request.</p>
                        </div>
                     )}
                  </div>

                  <Input
                     label="Description / Additional Details"
                     as="textarea"
                     rows={3}
                     placeholder="Please provide more details about what you need..."
                     value={data.description || ''}
                     onChange={e => setData({ ...data, description: e.target.value })}
                  />
                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={handleBack}><ChevronLeft size={16} className="mr-2" /> Back</Button>
                     <Button onClick={handleNext}>Review <ChevronRight size={16} className="ml-2" /></Button>
                  </div>
               </div>
            )}
            {step === 3 && (
               <div className="space-y-6">
                  <h2 className="text-xl font-bold">Review Request</h2>
                  <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg space-y-3 text-sm text-slate-700 dark:text-slate-300">
                     <p><span className="font-bold">Category:</span> {data.category}</p>
                     <p><span className="font-bold">Task:</span> {data.subcategory}</p>
                     <p><span className="font-bold">Date:</span> {data.date}</p>
                     {data.category === RequestCategory.RIDE ? (
                        <>
                           <p><span className="font-bold">Pickup:</span> {data.pickupAddress || 'Home'}</p>
                           <p><span className="font-bold">Destination:</span> {data.destinationAddress}</p>
                        </>
                     ) : (
                        <p><span className="font-bold">Location:</span> {data.location}</p>
                     )}
                  </div>
                  <div className="flex justify-between pt-4">
                     <Button variant="outline" onClick={handleBack}>Back</Button>
                     <Button variant="success" onClick={() => onSubmit(data)} className="px-8">Submit Request</Button>
                  </div>
               </div>
            )}
         </Card>
      </div>
   );
};

export const PostServiceSurvey: React.FC<{ request: Request; onSubmit: (data: any) => void }> = ({ request, onSubmit }) => {
   const [status, setStatus] = useState<'COMPLETED' | 'NO_SHOW' | 'UNABLE'>('COMPLETED');
   const [rating, setRating] = useState(0);
   const [onTime, setOnTime] = useState('');
   const [safe, setSafe] = useState('');
   const [comments, setComments] = useState('');

   return (
      <Modal isOpen={true} onClose={() => { }} title="Service Confirmation" hideCloseButton={true}>
         <div className="space-y-6">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-sm dark:text-slate-200">
               <h4 className="font-bold text-slate-700 dark:text-slate-300 mb-2 uppercase text-xs tracking-wide">Request Details</h4>
               <p><span className="font-semibold">Service:</span> {request.category} - {request.subcategory}</p>
               <p><span className="font-semibold">Date:</span> {request.date}</p>
               {request.category === 'Ride' ? (
                  <p><span className="font-semibold">Time:</span> {request.pickupTime} (Pickup)</p>
               ) : (
                  <p><span className="font-semibold">Time:</span> {request.timeWindow}</p>
               )}
               <p><span className="font-semibold">Volunteer:</span> {request.volunteerName || 'Unassigned'}</p>
            </div>

            <h3 className="font-bold text-lg text-center dark:text-white">Was the request completed?</h3>
            <div className="flex flex-col gap-2">
               <button
                  onClick={() => setStatus('COMPLETED')}
                  className={`p-3 rounded border text-left flex items-center justify-between transition-all ${status === 'COMPLETED' ? 'bg-green-50 dark:bg-green-900/30 border-green-500 ring-1 ring-green-500 text-green-900 dark:text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
               >
                  <span>Yes, it was completed</span>
                  {status === 'COMPLETED' && <CheckCircle className="text-green-600" size={18} />}
               </button>
               <button
                  onClick={() => setStatus('NO_SHOW')}
                  className={`p-3 rounded border text-left flex items-center justify-between transition-all ${status === 'NO_SHOW' ? 'bg-rose-50 dark:bg-rose-900/30 border-rose-500 ring-1 ring-rose-500 text-rose-900 dark:text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
               >
                  <span>No, the volunteer did not show up</span>
               </button>
               <button
                  onClick={() => setStatus('UNABLE')}
                  className={`p-3 rounded border text-left flex items-center justify-between transition-all ${status === 'UNABLE' ? 'bg-amber-50 dark:bg-amber-900/30 border-amber-500 ring-1 ring-amber-500 text-amber-900 dark:text-white' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'}`}
               >
                  <span>No, they were unable to complete it</span>
               </button>
            </div>

            {/* Questions visible only if Completed */}
            {status === 'COMPLETED' && (
               <div className="space-y-4 animate-in fade-in slide-in-from-top-2 border-t pt-4 dark:border-slate-700">
                  <div>
                     <p className="font-bold text-slate-900 dark:text-white mb-2">Did the volunteer arrive on time?</p>
                     <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white">
                           <input type="radio" name="ontime" value="Yes" onChange={(e) => setOnTime(e.target.value)} /> Yes
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white">
                           <input type="radio" name="ontime" value="No" onChange={(e) => setOnTime(e.target.value)} /> No
                        </label>
                     </div>
                  </div>

                  <div>
                     <p className="font-bold text-slate-900 dark:text-white mb-2">Did you feel safe and comfortable?</p>
                     <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white">
                           <input type="radio" name="safe" value="Yes" onChange={(e) => setSafe(e.target.value)} /> Yes
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer p-2 rounded hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-white">
                           <input type="radio" name="safe" value="No" onChange={(e) => setSafe(e.target.value)} /> No
                        </label>
                     </div>
                  </div>

                  <div>
                     <p className="font-bold text-slate-900 dark:text-white mb-2">Rate your experience (1-5)</p>
                     <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                           <button
                              key={star}
                              onClick={() => setRating(star)}
                              className={`w-10 h-10 rounded-full font-bold text-lg transition-colors ${rating >= star ? 'bg-yellow-400 text-black' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'}`}
                           >
                              {star}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            )}

            <Input
               label="Is there anything you would like us to know?"
               as="textarea"
               placeholder="Optional comments..."
               value={comments}
               onChange={(e) => setComments(e.target.value)}
            />

            <Button className="w-full" onClick={() => onSubmit({ status, rating, onTime, safe, comments })}>Submit Feedback</Button>
         </div>
      </Modal>
   );
};

export const ClientResources: React.FC = () => (
   <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold dark:text-white">Client Resources</h2>
      <Card title="Platform Guide">
         <p className="mb-4">Watch this video to learn how to make requests.</p>
         <div className="w-full h-64 bg-slate-200 dark:bg-slate-700 rounded flex items-center justify-center">
            <span className="text-slate-500 dark:text-slate-400 font-bold">Video Placeholder</span>
         </div>
      </Card>
   </div>
);