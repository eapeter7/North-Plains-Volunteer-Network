
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Card, Button, Input } from '../components/UI';
import { User as UserIcon, Mail, MapPin, Shield, BookOpen, Heart, Briefcase, PlusCircle, Camera } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface ProfileProps {
   user: User;
   onUpdate: (u: Partial<User>) => void;
}

// Helper to render section
const Section = ({ title, icon, children }: { title: string; icon?: React.ReactNode; children?: React.ReactNode }) => (
   <div className="mb-8 border-b border-slate-100 pb-8 last:border-0 last:pb-0">
      <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
         {icon && <span className="mr-2 text-brand-600">{icon}</span>}
         {title}
      </h3>
      {children}
   </div>
);

const Grid = ({ children }: { children?: React.ReactNode }) => (
   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">{children}</div>
);

const LabelVal = ({ label, val }: { label: string; val: any }) => (
   <div><label className="text-xs text-slate-500 uppercase font-bold">{label}</label><p>{val || '-'}</p></div>
);

export const UserProfile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
   const { t } = useTheme();
   const [isEditing, setIsEditing] = useState(false);
   const [formData, setFormData] = useState<User>(user);

   // Logic for Preferred Language 'Other'
   const STANDARD_LANGUAGES = ['English', 'Spanish'];
   const [langSelect, setLangSelect] = useState<string>('');

   useEffect(() => {
      if (isEditing) {
         if (formData.preferredLanguage && STANDARD_LANGUAGES.includes(formData.preferredLanguage)) {
            setLangSelect(formData.preferredLanguage);
         } else if (formData.preferredLanguage) {
            setLangSelect('Other');
         } else {
            setLangSelect('');
         }
      }
   }, [isEditing, formData.preferredLanguage]);

   const handleLanguageChange = (val: string) => {
      setLangSelect(val);
      if (val !== 'Other') {
         setFormData(prev => ({ ...prev, preferredLanguage: val }));
      } else {
         // Clear it so user can type
         setFormData(prev => ({ ...prev, preferredLanguage: '' }));
      }
   };

   const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         const reader = new FileReader();
         reader.onloadend = () => {
            setFormData(prev => ({ ...prev, avatar: reader.result as string }));
         };
         reader.readAsDataURL(file);
      }
   };

   const handleSave = () => {
      onUpdate(formData);
      setIsEditing(false);
   };

   const handleCancel = () => {
      setFormData(user);
      setIsEditing(false);
   };

   const handleAddRole = () => {
      // Upgrade to Dual Role
      setFormData({ ...formData, role: UserRole.CLIENT_VOLUNTEER });
   };

   const toggleArrayItem = (field: 'incomeSources' | 'nonCashBenefits', item: string) => {
      const current = formData[field] || [];
      if (current.includes(item)) {
         setFormData({ ...formData, [field]: current.filter(i => i !== item) });
      } else {
         setFormData({ ...formData, [field]: [...current, item] });
      }
   };

   return (
      <div className="max-w-4xl mx-auto space-y-6">
         {/* Header Card */}
         <Card className="bg-gradient-to-r from-brand-600 to-brand-700 text-white border-none">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
               <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white/30 overflow-hidden shrink-0">
                  {user.avatar ? <img src={user.avatar} alt={user.name || "User Avatar"} className="w-full h-full object-cover" /> : <UserIcon size={40} />}
               </div>
               <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:justify-between items-center mb-2">
                     <h1 className="text-3xl font-bold">{user.name}</h1>
                     <span className="mt-2 md:mt-0 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wide border border-white/30">
                        {user.role === UserRole.CLIENT_VOLUNTEER ? 'Client & Volunteer' : user.role}
                     </span>
                  </div>
                  <p className="text-brand-100 flex items-center justify-center md:justify-start gap-2 mb-1">
                     <Mail size={16} /> {user.email}
                  </p>
                  <p className="text-brand-100 flex items-center justify-center md:justify-start gap-2">
                     <MapPin size={16} /> {user.address || t('profile.no_address')}
                  </p>
               </div>
               <div className="flex flex-col gap-2">
                  {!isEditing ? (
                     <Button variant="secondary" onClick={() => setIsEditing(true)}>{t('profile.edit_profile')}</Button>
                  ) : (
                     <div className="flex gap-2">
                        <Button variant="outline" onClick={handleCancel} className="bg-white/10 text-white border-white/40 hover:bg-white/20">{t('common.cancel')}</Button>
                        <Button variant="success" onClick={handleSave}>{t('common.save')}</Button>
                     </div>
                  )}
               </div>
            </div>
         </Card>

         {/* Main Content */}
         <Card>
            {!isEditing ? (
               // --- READ ONLY VIEW ---
               <>
                  <Section title={t('profile.personal_info')} icon={<UserIcon size={20} />}>
                     <Grid>
                        <LabelVal label={t('profile.full_name')} val={user.name} />
                        <LabelVal label={t('profile.preferred_name')} val={user.preferredName} />
                        <LabelVal label={t('profile.dob')} val={user.dob} />
                        <LabelVal label={t('common.phone')} val={user.phone} />
                        <LabelVal label={t('profile.preferred_contact')} val={user.preferredContactMethod} />
                     </Grid>
                  </Section>

                  <Section title={t('profile.demographics')} icon={<BookOpen size={20} />}>
                     <Grid>
                        <LabelVal label={t('profile.gender')} val={user.gender} />
                        <LabelVal label={t('profile.ethnicity')} val={user.ethnicity} />
                        <LabelVal label={t('profile.race')} val={user.race} />
                        <LabelVal label={t('profile.veteran_status')} val={user.veteranStatus ? t('common.yes') : t('common.no')} />
                        <LabelVal label={t('profile.language')} val={user.preferredLanguage || user.languages?.join(', ')} />
                        <LabelVal label={t('profile.marital_status')} val={user.maritalStatus} />
                     </Grid>
                  </Section>

                  {(user.role === UserRole.CLIENT || user.role === UserRole.CLIENT_VOLUNTEER) && (
                     <Section title={t('profile.household_financial')} icon={<Briefcase size={20} />}>
                        <Grid>
                           <LabelVal label={t('profile.household_type')} val={user.householdType} />
                           <LabelVal label={t('profile.household_size')} val={user.householdSize} />
                           <LabelVal label={t('profile.income_range')} val={user.incomeRange} />
                           <LabelVal label={t('profile.income_sources')} val={user.incomeSources?.join(', ')} />
                           <LabelVal label={t('profile.non_cash_benefits')} val={user.nonCashBenefits?.join(', ')} />
                        </Grid>
                     </Section>
                  )}

                  <Section title={t('profile.emergency_contact')} icon={<Shield size={20} />}>
                     <Grid>
                        <LabelVal label={t('profile.contact_name')} val={user.emergencyContact?.name} />
                        <LabelVal label={t('profile.relationship')} val={user.emergencyContact?.relation} />
                        <LabelVal label={t('profile.contact_phone')} val={user.emergencyContact?.phone} />
                     </Grid>
                  </Section>

                  <Section title={t('profile.interests_hobbies')} icon={<Heart size={20} />}>
                     {/* Unified Hobbies Display */}
                     {user.hobbies ? (
                        <div className="flex flex-wrap gap-2">
                           {user.hobbies.map(h => <span key={h} className="px-2 py-1 bg-brand-50 text-brand-700 rounded text-sm">{h}</span>)}
                        </div>
                     ) : (
                        <p>{user.interestingFacts || t('profile.no_interests')}</p>
                     )}
                  </Section>

                  {(user.role === UserRole.CLIENT || user.role === UserRole.CLIENT_VOLUNTEER) && (
                     <Section title={t('profile.health_home')} icon={<Heart size={20} />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                           <LabelVal label={t('profile.pets')} val={user.pets} />
                           <LabelVal label={t('profile.interesting_facts')} val={user.interestingFacts} />
                        </div>
                        <div className="bg-slate-50 p-4 rounded-lg">
                           <h4 className="font-bold text-sm mb-2">{t('profile.accessibility_disability')}</h4>
                           <div className="grid grid-cols-2 gap-4 mb-2">
                              <LabelVal label={t('profile.disability_status')} val={user.disabilityStatus ? t('common.yes') : t('common.no')} />
                              <LabelVal label={t('profile.affects_independence')} val={user.affectsIndependence ? t('common.yes') : t('common.no')} />
                           </div>
                           <div className="grid grid-cols-3 gap-4 mb-2 border-t border-slate-200 pt-2">
                              <LabelVal label={t('profile.mobility')} val={user.accessibility?.mobility} />
                              <LabelVal label={t('profile.vision')} val={user.accessibility?.vision} />
                              <LabelVal label={t('profile.hearing')} val={user.accessibility?.hearing} />
                           </div>
                           <p className="text-sm text-slate-600 border-t pt-2 mt-2">{user.accessibility?.notes || t('profile.no_notes')}</p>
                        </div>
                     </Section>
                  )}

                  {(user.role === UserRole.VOLUNTEER || user.role === UserRole.CLIENT_VOLUNTEER) && (
                     <Section title={t('profile.volunteer_details')} icon={<Briefcase size={20} />}>
                        <Grid>
                           <LabelVal label={t('profile.driver_status')} val={user.isDriver ? t('profile.active_driver') : t('profile.non_driver')} />
                        </Grid>
                     </Section>
                  )}
               </>
            ) : (
               // --- EDIT MODE ---
               <div className="space-y-6">
                  <h2 className="text-xl font-bold border-b pb-2">Edit Profile</h2>

                  {/* Profile Photo Upload */}
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                     <label className="block text-sm font-bold text-blue-900 mb-3 flex items-center gap-2">
                        <Camera size={20} />
                        {t('profile.profile_photo')}
                     </label>
                     <div className="flex flex-col sm:flex-row items-center gap-6">
                        {formData.avatar && (
                           <div className="shrink-0">
                              <img src={formData.avatar} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md" />
                           </div>
                        )}
                        <div className="w-full">
                           <div className="bg-white p-4 rounded border border-blue-100 shadow-sm">
                              <Input label="" type="file" accept="image/*" onChange={handlePhotoUpload} className="mb-0 border-none" />
                           </div>
                        </div>
                     </div>
                     <p className="text-sm font-bold text-blue-800 mt-3 flex items-center gap-2">
                        <Shield size={16} /> "{t('profile.photo_help')}"
                     </p>
                  </div>

                  <div className="space-y-4">
                     <h3 className="font-bold text-brand-600">{t('profile.personal_details')}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label={t('profile.full_name')} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <Input label={t('profile.preferred_name')} value={formData.preferredName || ''} onChange={e => setFormData({ ...formData, preferredName: e.target.value })} />
                        <div>
                           <Input label={t('profile.dob')} type="date" value={formData.dob || ''} onChange={e => setFormData({ ...formData, dob: e.target.value })} />
                           {formData.dob && new Date().getFullYear() - new Date(formData.dob).getFullYear() < 18 && (
                              <p className="text-xs text-amber-600 font-bold mt-1 animate-in fade-in bg-amber-50 p-2 rounded border border-amber-200">
                                 {t('onboarding.minor_warning')}
                              </p>
                           )}
                        </div>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label={t('common.phone')} value={formData.phone || ''} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                        <Input label={t('common.email')} value={formData.email || ''} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                     </div>
                     <Input label={t('onboarding.preferred_contact')} id="preferredContactMethod" as="select" value={formData.preferredContactMethod || ''} onChange={e => setFormData({ ...formData, preferredContactMethod: e.target.value as any })}>
                        <option value="">{t('common.select')}</option>
                        <option value="Call">{t('onboarding.contact_call')}</option>
                        <option value="Text">{t('onboarding.contact_text')}</option>
                        <option value="Email">{t('onboarding.contact_email')}</option>
                     </Input>
                     <Input label={t('common.address')} value={formData.address || 'North Plains, OR 97133'} disabled />

                     <h3 className="font-bold text-brand-600 pt-4">{t('profile.demographics_identity')}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label={t('profile.gender')} id="gender" as="select" value={formData.gender || ''} onChange={e => setFormData({ ...formData, gender: e.target.value })}>
                           <option value="">{t('common.select')}</option>
                           <option value="Female">{t('onboarding.female')}</option>
                           <option value="Male">{t('onboarding.male')}</option>
                           <option value="Non-binary">{t('onboarding.non_binary')}</option>
                           <option value="Prefer not to say">{t('onboarding.prefer_not_say')}</option>
                        </Input>

                        <div>
                           <Input label={t('profile.language')} id="preferredLanguage" as="select" value={langSelect} onChange={e => handleLanguageChange(e.target.value)}>
                              <option value="">{t('common.select')}</option>
                              <option value="English">English</option>
                              <option value="Spanish">Spanish</option>
                              <option value="Other">{t('common.other')}</option>
                           </Input>
                           {langSelect === 'Other' && (
                              <div className="animate-in fade-in slide-in-from-top-2">
                                 <Input
                                    label={t('onboarding.specify_language')}
                                    placeholder={t('onboarding.specify_language')}
                                    value={formData.preferredLanguage || ''}
                                    onChange={e => setFormData({ ...formData, preferredLanguage: e.target.value })}
                                 />
                              </div>
                           )}
                        </div>

                        <Input label={t('profile.ethnicity')} id="ethnicity" as="select" value={formData.ethnicity || ''} onChange={e => setFormData({ ...formData, ethnicity: e.target.value as any })}>
                           <option value="">{t('common.select')}</option>
                           <option value="Hispanic/Latino">{t('onboarding.hispanic')}</option>
                           <option value="Not Hispanic/Latino">{t('onboarding.not_hispanic')}</option>
                        </Input>

                        <Input label={t('profile.race')} id="race" as="select" value={formData.race || ''} onChange={e => setFormData({ ...formData, race: e.target.value })}>
                           <option value="">{t('common.select')}</option>
                           <option value="White">{t('onboarding.white')}</option>
                           <option value="Black">{t('onboarding.black')}</option>
                           <option value="Hispanic">{t('onboarding.hispanic')}</option>
                           <option value="Asian">{t('onboarding.asian')}</option>
                           <option value="Native">{t('onboarding.native')}</option>
                           <option value="Pacific">{t('onboarding.pacific')}</option>
                           <option value="Multi">{t('onboarding.multi')}</option>
                           <option value="Other">{t('common.other')}</option>
                        </Input>
                        <Input label={t('profile.veteran_status')} id="veteranStatus" as="select" value={formData.veteranStatus !== undefined ? (formData.veteranStatus ? 'Yes' : 'No') : ''} onChange={e => setFormData({ ...formData, veteranStatus: e.target.value === 'Yes' })}>
                           <option value="">{t('common.select')}</option>
                           <option value="Yes">{t('common.yes')}</option>
                           <option value="No">{t('common.no')}</option>
                        </Input>
                        <Input label={t('profile.marital_status')} id="maritalStatus" as="select" value={formData.maritalStatus || ''} onChange={e => setFormData({ ...formData, maritalStatus: e.target.value })}>
                           <option value="">{t('common.select')}</option>
                           <option value="Single">{t('onboarding.single')}</option>
                           <option value="Married">{t('onboarding.married')}</option>
                           <option value="Widowed">{t('onboarding.widowed')}</option>
                           <option value="Divorced">{t('onboarding.divorced')}</option>
                        </Input>
                     </div>

                     {(user.role === UserRole.CLIENT || user.role === UserRole.CLIENT_VOLUNTEER || formData.role === UserRole.CLIENT_VOLUNTEER) && (
                        <>
                           <h3 className="font-bold text-brand-600 pt-4">{t('profile.household_financial')}</h3>
                           <div className="grid grid-cols-2 gap-4">
                              <Input label={t('profile.household_type')} id="householdType" as="select" value={formData.householdType || ''} onChange={e => setFormData({ ...formData, householdType: e.target.value })}>
                                 <option value="">{t('common.select')}</option>
                                 <option value="Single Adult">{t('onboarding.single_adult')}</option>
                                 <option value="Couple">{t('onboarding.couple')}</option>
                                 <option value="Family with Children">{t('onboarding.family_children')}</option>
                                 <option value="Multi-generational">{t('onboarding.multi_gen')}</option>
                              </Input>
                              <Input label={t('profile.household_size')} type="number" value={formData.householdSize || ''} onChange={e => setFormData({ ...formData, householdSize: parseInt(e.target.value) })} />
                           </div>
                           <Input label={t('profile.income_range')} id="incomeRange" as="select" value={formData.incomeRange || ''} onChange={e => setFormData({ ...formData, incomeRange: e.target.value })}>
                              <option value="">{t('common.select')}</option>
                              <option value="0-30k">{t('onboarding.income_under_30k')}</option>
                              <option value="30k-50k">{t('onboarding.income_30k_50k')}</option>
                              <option value="50k+">{t('onboarding.income_80k_plus')}</option>
                           </Input>

                           <h3 className="font-bold text-brand-600 pt-4">{t('onboarding.step_4_title')}</h3>
                           <Input label={t('profile.disability_status')} id="disabilityStatus" as="select" value={formData.disabilityStatus !== undefined ? (formData.disabilityStatus ? 'Yes' : 'No') : ''} onChange={e => setFormData({ ...formData, disabilityStatus: e.target.value === 'Yes' })}>
                              <option value="">{t('common.select')}</option><option value="Yes">{t('common.yes')}</option><option value="No">{t('common.no')}</option>
                           </Input>
                           {formData.disabilityStatus && (
                              <Input label={t('profile.disability_type')} value={formData.disabilityType || ''} onChange={e => setFormData({ ...formData, disabilityType: e.target.value })} />
                           )}
                        </>
                     )}

                     <h3 className="font-bold text-brand-600 pt-4">{t('profile.emergency_contact')}</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label={t('profile.contact_name')} value={formData.emergencyContact?.name || ''}
                           onChange={e => setFormData({ ...formData, emergencyContact: { ...(formData.emergencyContact || { phone: '', relation: '' }), name: e.target.value } })} />
                        <Input label={t('profile.contact_phone')} value={formData.emergencyContact?.phone || ''}
                           onChange={e => setFormData({ ...formData, emergencyContact: { ...(formData.emergencyContact || { name: '', relation: '' }), phone: e.target.value } })} />
                     </div>
                     <Input label={t('profile.relationship')} placeholder={t('profile.relationship')} value={formData.emergencyContact?.relation || ''}
                        onChange={e => setFormData({ ...formData, emergencyContact: { ...(formData.emergencyContact || { name: '', phone: '' }), relation: e.target.value } })} />

                     {/* HOBBIES FOR EVERYONE */}
                     <h3 className="font-bold text-brand-600 pt-4">{t('profile.hobbies')}</h3>
                     <Input
                        label={t('client.hobbies')}
                        as="textarea"
                        value={formData.hobbies?.join(', ') || ''}
                        onChange={e => setFormData({ ...formData, hobbies: e.target.value.split(', ') })}
                        placeholder={t('profile.hobbies')}
                     />

                     {(user.role === UserRole.CLIENT || user.role === UserRole.CLIENT_VOLUNTEER || formData.role === UserRole.CLIENT_VOLUNTEER) && (
                        <>
                           <h3 className="font-bold text-brand-600 pt-4">{t('profile.household_needs')}</h3>
                           <Input label={t('profile.pets')} value={formData.pets || ''} onChange={e => setFormData({ ...formData, pets: e.target.value })} />
                           <Input label={t('profile.interesting_facts')} as="textarea" value={formData.interestingFacts || ''} onChange={e => setFormData({ ...formData, interestingFacts: e.target.value })} />

                           <h4 className="font-bold text-slate-700 mt-2">{t('profile.functional_needs')}</h4>
                           <div className="grid grid-cols-3 gap-2">
                              <Input label={t('onboarding.hearing_impaired')} id="hearing" as="select" onChange={e => setFormData({ ...formData, accessibility: { ...(formData.accessibility || { vision: 'Unknown', mobility: "" }), hearing: e.target.value } })}>
                                 <option value="Unknown">{t('common.unknown')}</option><option value="No">{t('common.no')}</option><option value="Yes">{t('common.yes')}</option>
                              </Input>
                              <Input label={t('onboarding.vision_impaired')} id="vision" as="select" onChange={e => setFormData({ ...formData, accessibility: { ...(formData.accessibility || { hearing: 'Unknown', mobility: "" }), vision: e.target.value } })}>
                                 <option value="Unknown">{t('common.unknown')}</option><option value="No">{t('common.no')}</option><option value="Yes">{t('common.yes')}</option>
                              </Input>
                              <Input label={t('profile.mobility')} id="mobility" as="select" value={formData.accessibility?.mobility} onChange={e => setFormData({ ...formData, accessibility: { ...(formData.accessibility || { hearing: 'Unknown', vision: 'Unknown' }), mobility: e.target.value } })}>
                                 <option value="">{t('common.none')}</option><option value="Walker">{t('onboarding.walker')}</option><option value="Wheelchair">{t('onboarding.wheelchair')}</option>
                              </Input>
                           </div>
                        </>
                     )}

                     {(user.role === UserRole.VOLUNTEER || user.role === UserRole.CLIENT_VOLUNTEER || formData.role === UserRole.CLIENT_VOLUNTEER) && (
                        <>
                           <h3 className="font-bold text-brand-600 pt-4">{t('profile.volunteer_details')}</h3>
                           <div className="bg-brand-50 p-4 rounded border border-brand-200 mb-4">
                              <label className="flex items-center space-x-3">
                                 <input type="checkbox" className="w-5 h-5 text-brand-600 rounded" checked={formData.isDriver || false} onChange={e => setFormData({ ...formData, isDriver: e.target.checked })} />
                                 <span className="font-bold text-slate-800">{t('profile.driver_willing')}</span>
                              </label>
                           </div>
                        </>
                     )}

                     <h3 className="font-bold text-brand-600 pt-4">{t('settings.notifications')}</h3>
                     <div className="space-y-3 bg-slate-50 p-4 rounded border border-slate-200">
                        <label className="flex items-center space-x-3 cursor-pointer">
                           <input type="checkbox" className="w-4 h-4 text-brand-600 rounded"
                              checked={formData.notificationPreferences?.email ?? true}
                              onChange={e => setFormData({ ...formData, notificationPreferences: { ...(formData.notificationPreferences || { sms: false, calendar: false }), email: e.target.checked } })} />
                           <span className="text-slate-700">{t('settings.email_notif')}</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                           <input type="checkbox" className="w-4 h-4 text-brand-600 rounded"
                              checked={formData.notificationPreferences?.sms ?? false}
                              onChange={e => setFormData({ ...formData, notificationPreferences: { ...(formData.notificationPreferences || { email: true, calendar: false }), sms: e.target.checked } })} />
                           <span className="text-slate-700">{t('settings.sms_notif')}</span>
                        </label>
                        <label className="flex items-center space-x-3 cursor-pointer">
                           <input type="checkbox" className="w-4 h-4 text-brand-600 rounded"
                              checked={formData.notificationPreferences?.calendar ?? false}
                              onChange={e => setFormData({ ...formData, notificationPreferences: { ...(formData.notificationPreferences || { email: true, sms: false }), calendar: e.target.checked } })} />
                           <span className="text-slate-700">{t('settings.calendar_invite')}</span>
                        </label>
                     </div>
                  </div>
               </div>
            )
            }
         </Card >
      </div >
   );
};
