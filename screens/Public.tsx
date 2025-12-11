import React, { useState } from 'react';
import { Button, Card, Input, Accordion, Logo } from '../components/UI';
import { UserRole } from '../types';
import { Heart, Users, Calendar, ShieldCheck, ArrowRight, UserPlus, HelpCircle, CheckCircle, Target, HandHeart, Info, Phone, QrCode } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface PublicProps {
  onLogin: (role: UserRole) => void;
  view: 'home' | 'login';
}

export const PublicHome: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const { t } = useTheme();

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <div className="text-center space-y-8 py-10 md:py-20">
        <div className="flex justify-center mb-6">
          <Logo className="h-40 md:h-56 w-auto drop-shadow-sm" />
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold text-brand-700 tracking-tight">
          {t('hero.title_prefix')} <span className="text-brand-600">{t('hero.title_suffix')}</span>
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-slate-600 leading-relaxed">
          <span className="font-bold block text-brand-700 mb-2">{t('hero.subtitle')}</span>
          {t('hero.desc')}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" onClick={() => onNavigate('login')}>{t('btn.get_assistance')}</Button>
          <Button size="lg" variant="dark" onClick={() => onNavigate('login')}>{t('btn.join_volunteer')}</Button>
        </div>
      </div>

      {/* How it Works */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          { icon: Users, title: t('feature.assist'), text: t('feature.assist_text') },
          { icon: ShieldCheck, title: t('feature.safe'), text: t('feature.safe_text') },
          { icon: Heart, title: t('feature.community'), text: t('feature.community_text') },
        ].map((feature, i) => (
          <Card key={i} className="text-center p-8 border-t-4 border-t-brand-500 hover:shadow-md transition-shadow">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-brand-50 rounded-full text-brand-600">
                <feature.icon size={32} />
              </div>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
            <p className="text-slate-600 leading-relaxed">{feature.text}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export const AboutPage: React.FC<{ openContact?: boolean }> = ({ openContact }) => {
  return (
    <div className="max-w-4xl mx-auto py-10 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-700">About NPVN</h1>
        <p className="text-xl text-slate-600">Neighbors Helping Neighbors. Stronger Together.</p>
      </div>

      <Card>
        <div className="space-y-1">
          <Accordion title="Our Mission" defaultOpen={!openContact} icon={<Target size={20} />}>
            <p className="mb-4">
              The North Plains Volunteer Network exists to connect neighbors who want to help with neighbors who need support. Our mission is to build a compassionate, safe, and reliable system of volunteer-powered services that strengthens independence, reduces isolation, and increases wellbeing for everyone in our community.
            </p>
            <p>
              NPVN operates under the North Plains Senior Center (NPSC), aligning closely with its vision of supporting older adults, individuals with disabilities, and families through meaningful engagement, social connection, and practical assistance.
            </p>
          </Accordion>

          <Accordion title="What We Do" icon={<HandHeart size={20} />}>
            <p className="mb-4">
              NPVN provides free, volunteer-driven support to residents of North Plains. Our volunteers offer simple, everyday help that makes a big difference:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4">
              <li>Rides to appointments, church, or errands</li>
              <li>Grocery pickup</li>
              <li>Friendly visits and social connection</li>
              <li>Walk-and-talk companionship</li>
              <li>Light home help (non-technical, non-invasive)</li>
              <li>Seasonal yard tidying</li>
              <li>Help with small tasks like battery changes or lifting items</li>
              <li>Holiday decoration setup/takedown</li>
              <li>Group volunteer events around town</li>
            </ul>
            <p>We focus on practical tasks, connection, and neighborly support—not medical or professional services.</p>
          </Accordion>

          <Accordion title="Why It Matters" icon={<Heart size={20} />}>
            <p className="mb-4">
              North Plains is growing, but our sense of community is what defines us. Many residents, especially older adults, people with disabilities, and those living alone, need small acts of help that keep them:
            </p>
            <ul className="list-disc pl-6 space-y-2 mb-4 font-medium text-slate-700">
              <li>Safe</li>
              <li>Connected</li>
              <li>Independent</li>
              <li>Engaged with their community</li>
            </ul>
            <p>
              At the same time, many neighbors want to give back but don’t know where to start. NPVN creates a simple, safe, trusted system that makes it easy for both sides.
            </p>
          </Accordion>

          <Accordion title="How It Works" icon={<Info size={20} />}>
            <div className="space-y-4">
              <div>
                <h4 className="font-bold text-slate-900">Step 1: Join the Network</h4>
                <p>Clients and volunteers create an account. Volunteers complete profile, training, and background check.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Step 2: Make or Accept a Request</h4>
                <p>Clients submit a request. Volunteers browse and sign up for opportunities.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Step 3: Get Matched</h4>
                <p>The platform connects you. Both receive reminders.</p>
              </div>
              <div>
                <h4 className="font-bold text-slate-900">Step 4: Connect & Support</h4>
                <p>Volunteers complete the visit. Clients confirm completion.</p>
              </div>
            </div>
          </Accordion>

          <Accordion title="Safety & Commitment" icon={<ShieldCheck size={20} />}>
            <p className="mb-4">Safety is at the heart of NPVN. We use:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Background checks for all volunteers</li>
              <li>Required training modules</li>
              <li>Clear boundaries and prohibited tasks</li>
              <li>Incident reporting pathways</li>
              <li>Automated communication logs</li>
              <li>Coordinator oversight for complex situations</li>
            </ul>
          </Accordion>

          <Accordion title="Who We Serve" icon={<Users size={20} />}>
            <p className="mb-4">
              NPVN is designed for all North Plains residents who need simple, non-medical support, especially:
            </p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Older adults</li>
              <li>Individuals living with disabilities</li>
              <li>People recovering from illness or injury</li>
              <li>Isolated neighbors seeking social connection</li>
            </ul>
            <p className="mt-4 italic">There is no income requirement and no cost for services.</p>
          </Accordion>

          <Accordion title="Contact Us" defaultOpen={openContact} id="contact-us-section" icon={<Phone size={20} />}>
            <div className="space-y-6">
              <div className="bg-brand-50 p-6 rounded-lg border border-brand-100">
                <h4 className="font-bold text-brand-900 text-lg mb-3">North Plains Volunteer Network</h4>
                <div className="text-slate-700 space-y-2">
                  <p className="flex items-center gap-2"><strong>Email:</strong> npvolunteernetwork@gmail.com</p>
                  <p className="flex items-center gap-2"><strong>Phone:</strong> 971-712-3845</p>
                </div>
              </div>

              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h4 className="font-bold text-slate-900 text-lg mb-3">North Plains Senior Center</h4>
                <div className="text-slate-700 space-y-2">
                  <p>31450 NW Commercial St</p>
                  <p>North Plains, OR 97133</p>
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <p className="flex items-center gap-2"><strong>Email:</strong> northplainssc@gmail.com</p>
                    <p className="flex items-center gap-2"><strong>Phone:</strong> (503) 647-5666</p>
                  </div>
                </div>
              </div>
            </div>
          </Accordion>
        </div>
      </Card>
    </div>
  );
};

export const DonatePage: React.FC = () => {
  const PAYPAL_LINK = 'https://www.paypal.com/ncp/payment/NYUF3RCCR3ZQS';

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-brand-700">Support Our Mission</h1>
        <p className="text-xl text-slate-600">Your contribution helps us keep neighbors connected.</p>
      </div>

      <Card>
        <div className="text-center py-6 space-y-8">
          <div className="bg-brand-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-brand-600">
            <Heart size={40} />
          </div>
          <p className="text-slate-600 px-4">
            The North Plains Volunteer Network operates under the North Plains Senior Center, a 501(c)(3) non-profit organization.
            All donations are tax-deductible and go directly towards background checks, volunteer training, and program coordination.
          </p>

          {/* Donation Buttons */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
              <Button variant="outline" onClick={() => window.open(PAYPAL_LINK, '_blank')}>$25</Button>
              <Button variant="outline" onClick={() => window.open(PAYPAL_LINK, '_blank')}>$50</Button>
              <Button variant="outline" onClick={() => window.open(PAYPAL_LINK, '_blank')}>$100</Button>
              <Button variant="outline" onClick={() => window.open(PAYPAL_LINK, '_blank')}>Other</Button>
            </div>

            <Button
              size="lg"
              className="w-full max-w-sm font-bold shadow-md hover:shadow-lg transition-all"
              onClick={() => window.open(PAYPAL_LINK, '_blank')}
            >
              Donate via PayPal
            </Button>
          </div>

          {/* QR Code Section */}
          <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 max-w-sm mx-auto mt-6">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center justify-center gap-2">
              <QrCode size={18} /> Scan to Donate
            </h3>
            <div className="bg-white p-2 rounded-lg border border-slate-200 inline-block shadow-sm">
              <img
                src="./qrcode.png"
                alt="PayPal QR Code"
                className="w-48 h-48 object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/200?text=Upload+qrcode.png";
                }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-3">Scan this code with your phone camera</p>
          </div>

          <div className="pt-6 border-t mt-6">
            <p className="font-bold text-slate-800">Prefer to donate by check?</p>
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Make checks payable to:<br />
              <span className="font-medium text-slate-700">North Plains Senior Center</span><br />
              Memo: Volunteer Network<br />
              31450 NW Commercial St<br />
              North Plains, OR 97133
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export const LoginScreen: React.FC<{ onLogin: (r: UserRole) => void; onNavigate: (p: string) => void }> = ({ onLogin, onNavigate }) => {
  return (
    <div className="max-w-md mx-auto py-10">
      <Card title="Sign In to NPVN">
        <div className="space-y-6">
          <p className="text-sm text-slate-600 mb-4">
            Welcome back! Please log in to access your dashboard.
          </p>
          {/* MOCK LOGIN CONTROLS */}
          <div className="bg-amber-50 p-4 rounded text-xs text-amber-800 border border-amber-200 mb-4">
            <strong>Demo Mode:</strong> Select a role to simulate login.
            <div className="grid gap-2 mt-2">
              <button onClick={() => onLogin(UserRole.CLIENT)} className="underline text-left">Log in as Client (Martha)</button>
              <button onClick={() => onLogin(UserRole.VOLUNTEER)} className="underline text-left">Log in as Volunteer (John)</button>
              <button onClick={() => onLogin(UserRole.ADMIN)} className="underline text-left">Log in as Admin (Sarah)</button>
              <button onClick={() => onLogin(UserRole.CLIENT_VOLUNTEER)} className="underline text-left">Log in as Dual User (Client & Volunteer)</button>
            </div>
          </div>

          <Input label="Email Address" type="email" placeholder="name@example.com" />
          <Input label="Password" type="password" />
          <Button className="w-full">Sign In</Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500">New to NPVN?</span>
            </div>
          </div>

          <Button variant="outline" className="w-full" onClick={() => onNavigate('register')}>
            Create a New Account
          </Button>
        </div>
      </Card>
    </div>
  );
};

export const RegisterScreen: React.FC<{ onRegister: (role: UserRole, data: any) => void }> = ({ onRegister }) => {
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep(2);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      {step === 1 && (
        <div className="space-y-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900">Join the Network</h1>
          <p className="text-slate-600 text-lg">How would you like to participate?</p>

          <div className="grid md:grid-cols-3 gap-6">
            <div
              onClick={() => handleRoleSelect(UserRole.CLIENT)}
              className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-brand-500 hover:shadow-lg cursor-pointer transition-all flex flex-col items-center"
            >
              <div className="p-4 bg-brand-50 rounded-full text-brand-600 mb-4">
                <Users size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">I need assistance</h3>
              <p className="text-sm text-slate-500">Sign up as a Client to request rides, visits, and support.</p>
            </div>

            <div
              onClick={() => handleRoleSelect(UserRole.VOLUNTEER)}
              className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-nature-500 hover:shadow-lg cursor-pointer transition-all flex flex-col items-center"
            >
              <div className="p-4 bg-nature-50 rounded-full text-nature-500 mb-4">
                <Heart size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">I want to help</h3>
              <p className="text-sm text-slate-500">Sign up as a Volunteer to browse and accept opportunities.</p>
            </div>

            <div
              onClick={() => handleRoleSelect(UserRole.CLIENT_VOLUNTEER)}
              className="bg-white p-6 rounded-xl border-2 border-slate-200 hover:border-purple-500 hover:shadow-lg cursor-pointer transition-all flex flex-col items-center"
            >
              <div className="p-4 bg-purple-50 rounded-full text-purple-600 mb-4">
                <UserPlus size={32} />
              </div>
              <h3 className="font-bold text-lg mb-2">I want to do both</h3>
              <p className="text-sm text-slate-500">Sign up to both receive help and offer support to neighbors.</p>
            </div>
          </div>
        </div>
      )}

      {step === 2 && selectedRole && (
        <div className="max-w-md mx-auto">
          <Card title={`Create ${selectedRole === UserRole.CLIENT_VOLUNTEER ? 'Dual' : selectedRole === UserRole.CLIENT ? 'Client' : 'Volunteer'} Account`}>
            <div className="space-y-4">
              <Input label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" />
              <Input label="Email Address" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" />
              <Input label="Create Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
              <div className="pt-4">
                <Button className="w-full" onClick={() => onRegister(selectedRole, form)}>Create Account</Button>
                <button onClick={() => setStep(1)} className="w-full mt-4 text-sm text-slate-500 hover:text-slate-800">Back to Role Selection</button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};