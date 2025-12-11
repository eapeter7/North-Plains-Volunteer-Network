
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { Card, Button, Input } from '../components/UI';
import { User as UserIcon, Mail, MapPin, Shield, BookOpen, Heart, Briefcase, PlusCircle, Camera } from 'lucide-react';

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
             {user.avatar ? <img src={user.avatar} className="w-full h-full object-cover"/> : <UserIcon size={40} />}
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
                <MapPin size={16} /> {user.address || 'No address set'}
             </p>
          </div>
          <div className="flex flex-col gap-2">
            {!isEditing ? (
              <Button variant="secondary" onClick={() => setIsEditing(true)}>Edit Profile</Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCancel} className="bg-white/10 text-white border-white/40 hover:bg-white/20">Cancel</Button>
                <Button variant="success" onClick={handleSave}>Save Changes</Button>
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
            <Section title="Personal Information" icon={<UserIcon size={20}/>}>
               <Grid>
                  <LabelVal label="Full Name" val={user.name} />
                  <LabelVal label="Preferred Name" val={user.preferredName} />
                  <LabelVal label="Date of Birth" val={user.dob} />
                  <LabelVal label="Phone" val={user.phone} />
                  <LabelVal label="Preferred Contact" val={user.preferredContactMethod} />
               </Grid>
            </Section>
            
            <Section title="Demographics" icon={<BookOpen size={20}/>}>
               <Grid>
                  <LabelVal label="Gender" val={user.gender} />
                  <LabelVal label="Ethnicity" val={user.ethnicity} />
                  <LabelVal label="Race (HUD)" val={user.race} />
                  <LabelVal label="Veteran Status" val={user.veteranStatus ? 'Yes' : 'No'} />
                  <LabelVal label="Language" val={user.preferredLanguage || user.languages?.join(', ')} />
                  <LabelVal label="Marital Status" val={user.maritalStatus} />
               </Grid>
            </Section>

            {(user.role === UserRole.CLIENT || user.role === UserRole.CLIENT_VOLUNTEER) && (
               <Section title="Household & Financial" icon={<Briefcase size={20}/>}>
                  <Grid>
                     <LabelVal label="Household Type" val={user.householdType} />
                     <LabelVal label="Size" val={user.householdSize} />
                     <LabelVal label="Income Range" val={user.incomeRange} />
                     <LabelVal label="Income Sources" val={user.incomeSources?.join(', ')} />
                     <LabelVal label="Non-Cash Benefits" val={user.nonCashBenefits?.join(', ')} />
                  </Grid>
               </Section>
            )}

            <Section title="Emergency Contact" icon={<Shield size={20}/>}>
               <Grid>
                  <LabelVal label="Contact Name" val={user.emergencyContact?.name} />
                  <LabelVal label="Relationship" val={user.emergencyContact?.relation} />
                  <LabelVal label="Contact Phone" val={user.emergencyContact?.phone} />
               </Grid>
            </Section>
            
            <Section title="Interests & Hobbies" icon={<Heart size={20}/>}>
               {/* Unified Hobbies Display */}
               {user.hobbies ? (
                  <div className="flex flex-wrap gap-2">
                     {user.hobbies.map(h => <span key={h} className="px-2 py-1 bg-brand-50 text-brand-700 rounded text-sm">{h}</span>)}
                  </div>
               ) : (
                  <p>{user.interestingFacts || 'No interests listed.'}</p>
               )}
            </Section>

            {(user.role === UserRole.CLIENT || user.role === UserRole.CLIENT_VOLUNTEER) && (
              <Section title="Health & Home" icon={<Heart size={20}/>}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                   <LabelVal label="Pets" val={user.pets} />
                   <LabelVal label="Interesting Facts" val={user.interestingFacts} />
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                   <h4 className="font-bold text-sm mb-2">Accessibility & Disability Status</h4>
                   <div className="grid grid-cols-2 gap-4 mb-2">
                      <LabelVal label="Disability Status" val={user.disabilityStatus ? 'Yes' : 'No'} />
                      <LabelVal label="Affects Independence?" val={user.affectsIndependence ? 'Yes' : 'No'} />
                   </div>
                   <div className="grid grid-cols-3 gap-4 mb-2 border-t border-slate-200 pt-2">
                      <LabelVal label="Mobility" val={user.accessibility?.mobility} />
                      <LabelVal label="Vision" val={user.accessibility?.vision} />
                      <LabelVal label="Hearing" val={user.accessibility?.hearing} />
                   </div>
                   <p className="text-sm text-slate-600 border-t pt-2 mt-2">{user.accessibility?.notes || 'No specific notes.'}</p>
                </div>
              </Section>
            )}

            {(user.role === UserRole.VOLUNTEER || user.role === UserRole.CLIENT_VOLUNTEER) && (
              <Section title="Volunteer Details" icon={<Briefcase size={20}/>}>
                 <Grid>
                    <LabelVal label="Driver Status" val={user.isDriver ? 'Active Driver' : 'Non-Driver'} />
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
                   Profile Photo
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
                   <Shield size={16} /> "This helps volunteers recognize you safely."
                </p>
            </div>
            
            <div className="space-y-4">
               <h3 className="font-bold text-brand-600">Personal Details</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  <Input label="Preferred Name" value={formData.preferredName || ''} onChange={e => setFormData({...formData, preferredName: e.target.value})} />
                  <Input label="Date of Birth" type="date" value={formData.dob || ''} onChange={e => setFormData({...formData, dob: e.target.value})} />
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Phone Number" value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  <Input label="Email" value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} />
               </div>
               <Input label="Preferred Contact Method" as="select" value={formData.preferredContactMethod || ''} onChange={e => setFormData({...formData, preferredContactMethod: e.target.value as any})}>
                  <option value="">Select...</option>
                  <option>Call</option>
                  <option>Text</option>
                  <option>Email</option>
               </Input>
               <Input label="Address" value={formData.address || 'North Plains, OR 97133'} disabled />
               
               <h3 className="font-bold text-brand-600 pt-4">Demographics & Identity</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Gender" as="select" value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value})}>
                     <option value="">Select...</option>
                     <option>Female</option>
                     <option>Male</option>
                     <option>Non-binary</option>
                     <option>Prefer not to say</option>
                  </Input>
                  
                  <div>
                     <Input label="Preferred Language" as="select" value={langSelect} onChange={e => handleLanguageChange(e.target.value)}>
                        <option value="">Select...</option>
                        <option>English</option>
                        <option>Spanish</option>
                        <option>Other</option>
                     </Input>
                     {langSelect === 'Other' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                           <Input 
                              label="Please specify language" 
                              placeholder="Type language..." 
                              value={formData.preferredLanguage || ''} 
                              onChange={e => setFormData({...formData, preferredLanguage: e.target.value})} 
                           />
                        </div>
                     )}
                  </div>

                  <Input label="Ethnicity" as="select" value={formData.ethnicity || ''} onChange={e => setFormData({...formData, ethnicity: e.target.value as any})}>
                     <option value="">Select...</option>
                     <option value="Hispanic/Latino">Hispanic or Latino</option>
                     <option value="Not Hispanic/Latino">Not Hispanic or Latino</option>
                  </Input>

                  <Input label="Race/Ethnicity (HUD)" as="select" value={formData.race || ''} onChange={e => setFormData({...formData, race: e.target.value})}>
                     <option value="">Select...</option>
                     <option value="White">White</option>
                     <option value="Black">Black or African American</option>
                     <option value="Hispanic">Hispanic or Latino</option>
                     <option value="Asian">Asian</option>
                     <option value="Native">American Indian or Alaska Native</option>
                     <option value="Pacific">Native Hawaiian / Pacific Islander</option>
                     <option value="Multi">Multi-Racial</option>
                     <option value="Other">Other</option>
                  </Input>
                  <Input label="Veteran Status" as="select" value={formData.veteranStatus !== undefined ? (formData.veteranStatus ? 'Yes' : 'No') : ''} onChange={e => setFormData({...formData, veteranStatus: e.target.value === 'Yes'})}>
                     <option value="">Select...</option>
                     <option value="Yes">Yes</option>
                     <option value="No">No</option>
                  </Input>
                  <Input label="Marital Status" as="select" value={formData.maritalStatus || ''} onChange={e => setFormData({...formData, maritalStatus: e.target.value})}>
                     <option value="">Select...</option>
                     <option>Single</option>
                     <option>Married</option>
                     <option>Widowed</option>
                     <option>Divorced</option>
                  </Input>
               </div>

               {(user.role === UserRole.CLIENT || user.role === UserRole.CLIENT_VOLUNTEER || formData.role === UserRole.CLIENT_VOLUNTEER) && (
                  <>
                     <h3 className="font-bold text-brand-600 pt-4">Household & Financial</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <Input label="Household Type" as="select" value={formData.householdType || ''} onChange={e => setFormData({...formData, householdType: e.target.value})}>
                           <option value="">Select...</option>
                           <option>Single Adult</option>
                           <option>Couple</option>
                           <option>Family with Children</option>
                           <option>Multi-generational</option>
                        </Input>
                        <Input label="Size" type="number" value={formData.householdSize || ''} onChange={e => setFormData({...formData, householdSize: parseInt(e.target.value)})} />
                     </div>
                     <Input label="Income Range" as="select" value={formData.incomeRange || ''} onChange={e => setFormData({...formData, incomeRange: e.target.value})}>
                        <option value="">Select...</option>
                        <option value="0-30k">Under $30,000</option>
                        <option value="30k-50k">$30,000 - $50,000</option>
                        <option value="50k+">Over $50,000</option>
                     </Input>

                     <h3 className="font-bold text-brand-600 pt-4">Health & Disability</h3>
                     <Input label="Disability Status" as="select" value={formData.disabilityStatus !== undefined ? (formData.disabilityStatus ? 'Yes' : 'No') : ''} onChange={e => setFormData({...formData, disabilityStatus: e.target.value === 'Yes'})}>
                        <option value="">Select...</option><option value="Yes">Yes</option><option value="No">No</option>
                     </Input>
                     {formData.disabilityStatus && (
                         <Input label="Disability Type" value={formData.disabilityType || ''} onChange={e => setFormData({...formData, disabilityType: e.target.value})} />
                     )}
                  </>
               )}

               <h3 className="font-bold text-brand-600 pt-4">Emergency Contact</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input label="Name" value={formData.emergencyContact?.name || ''} 
                         onChange={e => setFormData({...formData, emergencyContact: {...(formData.emergencyContact || {phone: '', relation: ''}), name: e.target.value}})} />
                  <Input label="Phone" value={formData.emergencyContact?.phone || ''} 
                         onChange={e => setFormData({...formData, emergencyContact: {...(formData.emergencyContact || {name: '', relation: ''}), phone: e.target.value}})} />
               </div>
               <Input label="Relationship" placeholder="e.g. Daughter, Neighbor" value={formData.emergencyContact?.relation || ''} 
                      onChange={e => setFormData({...formData, emergencyContact: {...(formData.emergencyContact || {name: '', phone: ''}), relation: e.target.value}})} />
                
               {/* HOBBIES FOR EVERYONE */}
               <h3 className="font-bold text-brand-600 pt-4">Hobbies & Interests</h3>
               <Input 
                    label="Hobbies" 
                    as="textarea" 
                    value={formData.hobbies?.join(', ') || ''} 
                    onChange={e => setFormData({...formData, hobbies: e.target.value.split(', ')})} 
                    placeholder="e.g. Gardening, Chess, Reading, Knitting" 
                />

               {(user.role === UserRole.CLIENT || user.role === UserRole.CLIENT_VOLUNTEER || formData.role === UserRole.CLIENT_VOLUNTEER) && (
                  <>
                    <h3 className="font-bold text-brand-600 pt-4">Household & Needs</h3>
                    <Input label="Pets" value={formData.pets || ''} onChange={e => setFormData({...formData, pets: e.target.value})} />
                    <Input label="Interesting Facts (Optional)" as="textarea" value={formData.interestingFacts || ''} onChange={e => setFormData({...formData, interestingFacts: e.target.value})} />
                    
                    <h4 className="font-bold text-slate-700 mt-2">Functional Needs</h4>
                    <div className="grid grid-cols-3 gap-2">
                       <Input label="Hearing?" as="select" onChange={e => setFormData({...formData, accessibility: {...(formData.accessibility || {vision: 'Unknown', mobility: ""}), hearing: e.target.value}})}>
                          <option value="Unknown">Unknown</option><option value="No">No</option><option value="Yes">Yes</option>
                       </Input>
                       <Input label="Vision?" as="select" onChange={e => setFormData({...formData, accessibility: {...(formData.accessibility || {hearing: 'Unknown', mobility: ""}), vision: e.target.value}})}>
                          <option value="Unknown">Unknown</option><option value="No">No</option><option value="Yes">Yes</option>
                       </Input>
                       <Input label="Mobility" as="select" value={formData.accessibility?.mobility} onChange={e => setFormData({...formData, accessibility: {...(formData.accessibility || {hearing: 'Unknown', vision: 'Unknown'}), mobility: e.target.value}})}>
                          <option value="">None</option><option value="Walker">Walker</option><option value="Wheelchair">Wheelchair</option>
                       </Input>
                    </div>
                  </>
               )}

               {(user.role === UserRole.VOLUNTEER || user.role === UserRole.CLIENT_VOLUNTEER || formData.role === UserRole.CLIENT_VOLUNTEER) && (
                  <>
                     <h3 className="font-bold text-brand-600 pt-4">Volunteer Details</h3>
                     <div className="bg-brand-50 p-4 rounded border border-brand-200 mb-4">
                        <label className="flex items-center space-x-3">
                           <input type="checkbox" className="w-5 h-5 text-brand-600 rounded" checked={formData.isDriver || false} onChange={e => setFormData({...formData, isDriver: e.target.checked})} />
                           <span className="font-bold text-slate-800">I am a licensed driver willing to provide rides</span>
                        </label>
                     </div>
                  </>
               )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
