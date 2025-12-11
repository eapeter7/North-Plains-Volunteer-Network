
import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { User, UserRole, Request, OnboardingStep, RequestStatus } from './types';
import { MOCK_USERS, MOCK_REQUESTS } from './services/mockData';
import { PublicHome, LoginScreen, AboutPage, RegisterScreen, DonatePage } from './screens/Public';
import { ClientDashboard, CreateRequestFlow, DualDashboard, ClientResources } from './screens/Client';
import { VolunteerDashboard, VolunteerOnboarding, OpportunityBoard, VolunteerResources, VolunteerHistory, SafetyReportingPage, CommunityResources, DualHistory, VolunteerSettings } from './screens/Volunteer';
import { AdminDashboard } from './screens/Admin';
import { UserProfile } from './screens/Profile';
import { ThemeProvider } from './context/ThemeContext';

const AppContent: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('home');
  const [requests, setRequests] = useState<Request[]>(MOCK_REQUESTS);

  // Simple Router Logic
  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleLogin = (role: UserRole) => {
    const mockUser = Object.values(MOCK_USERS).find(u => u.role === role);
    if (mockUser) {
      setUser(mockUser);
      handleNavigate('dashboard');
    }
  };

  const handleRegister = (role: UserRole, data: any) => {
    // Create a new mock user
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: data.name,
      email: data.email,
      role: role,
      onboardingStep: OnboardingStep.PROFILE, // Needs onboarding
    };
    setUser(newUser);
    handleNavigate('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    handleNavigate('home');
  };

  const handleUpdateUser = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  // --- Client Actions ---
  const handleCreateRequest = (requestData: Partial<Request>) => {
    const newRequest: Request = {
      ...requestData,
      id: `r${Date.now()}`,
      clientId: user?.id || 'unknown',
      clientName: user?.name || 'Unknown',
      status: RequestStatus.PENDING,
      date: requestData.date || new Date().toISOString().split('T')[0],
      category: requestData.category!,
      subcategory: requestData.subcategory || 'General',
      description: requestData.description || '',
      timeWindow: requestData.timeWindow || '',
      location: requestData.location || '',
      geozone: 'North Plains - Central', // Default logic
    };
    setRequests([newRequest, ...requests]);
    handleNavigate('dashboard');
  };

  const handleCompleteSurvey = (reqId: string, data: any) => {
    setRequests(prev => prev.map(r =>
      r.id === reqId
        ? { ...r, clientSurveyCompleted: true, adminNotes: (r.adminNotes ? r.adminNotes + '\n' : '') + `Client Survey: ${data.rating}/5` }
        : r
    ));
  };

  // --- Volunteer Actions ---
  const handleAcceptRequest = (id: string) => {
    setRequests(requests.map(r => {
      if (r.id !== id) return r;

      // Group Event Logic
      if (r.isGroupEvent) {
        const currentEnrolled = r.enrolledVolunteers || [];
        // Prevent double enrollment
        if (user?.id && currentEnrolled.includes(user.id)) return r;

        const newEnrolled = user?.id ? [...currentEnrolled, user.id] : currentEnrolled;
        // Check if now full
        const isFull = newEnrolled.length >= (r.maxVolunteers || 1);

        return {
          ...r,
          enrolledVolunteers: newEnrolled,
          // If full, mark MATCHED (closed). If not, keep PENDING (open).
          status: isFull ? RequestStatus.MATCHED : r.status,
          // Note: volunteerId left undefined for groups to indicate "multi-user"
        };
      }

      // Standard Single Volunteer Logic
      return { ...r, status: RequestStatus.MATCHED, volunteerId: user?.id, volunteerName: user?.name };
    }));
    handleNavigate('dashboard');
  };

  const handleCompleteRequest = (reqId: string, data: any) => {
    const hoursLogged = parseFloat(data.hours) || 0;
    const isHighHours = hoursLogged > 5;

    setRequests(prev => prev.map(r =>
      r.id === reqId
        ? {
          ...r,
          status: RequestStatus.COMPLETED,
          volunteerSurveyCompleted: true,
          adminNotes: isHighHours
            ? (r.adminNotes || '') + `\n[AUTO-FLAG] High Hours: ${hoursLogged}. Verify accuracy.`
            : r.adminNotes,
          alertResolved: isHighHours ? false : r.alertResolved
        }
        : r
    ));
    if (user) {
      setUser({ ...user, totalHours: (user.totalHours || 0) + hoursLogged });
    }
  };

  const handleWithdraw = (reqId: string, reason: string) => {
    setRequests(prev => prev.map(r =>
      r.id === reqId
        ? { ...r, status: RequestStatus.PENDING, volunteerId: undefined, volunteerName: undefined, adminNotes: (r.adminNotes ? r.adminNotes + '\n' : '') + `Withdrawn: ${reason}` }
        : r
    ));
  };

  // --- Admin Actions ---
  const handleUpdateRequest = (reqId: string, updates: Partial<Request>) => {
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, ...updates } : r));
  };

  // Render Logic based on Route & Role
  const renderContent = () => {
    if (currentPage === 'about') return <AboutPage openContact={false} />;
    if (currentPage === 'contact') return <AboutPage openContact={true} />;
    if (user && currentPage === 'profile') return <UserProfile user={user} onUpdate={handleUpdateUser} />;

    if (!user) {
      switch (currentPage) {
        case 'login': return <LoginScreen onLogin={handleLogin} onNavigate={handleNavigate} />;
        case 'register': return <RegisterScreen onRegister={handleRegister} />;
        case 'donate': return <DonatePage />;
        default: return <PublicHome onNavigate={handleNavigate} />;
      }
    }

    if (user.role === UserRole.CLIENT) {
      switch (currentPage) {
        case 'create-request':
          return <CreateRequestFlow onSubmit={handleCreateRequest} onCancel={() => handleNavigate('dashboard')} />;
        case 'resources': return <CommunityResources />;
        case 'report-safety': return <SafetyReportingPage onNavigate={handleNavigate} />;
        case 'client-resources': return <ClientResources />;
        default: return (
          <ClientDashboard
            user={user}
            requests={requests.filter(r => r.clientId === user.id)}
            onCreateRequest={() => handleNavigate('create-request')}
            onUpdateUser={handleUpdateUser}
            onNavigate={handleNavigate}
            onCompleteSurvey={handleCompleteSurvey}
          />
        );
      }
    }

    if (user.role === UserRole.VOLUNTEER) {
      switch (currentPage) {
        case 'opportunities':
          return <OpportunityBoard requests={requests} onAccept={handleAcceptRequest} />;
        case 'history':
          return <VolunteerHistory user={user} requests={requests} />;
        case 'volunteer-resources':
          return <VolunteerResources />;
        case 'report-safety':
          return <SafetyReportingPage onNavigate={handleNavigate} />;
        case 'community-resources':
          return <CommunityResources />;
        case 'settings':
          return <VolunteerSettings />;
        default: return (
          <VolunteerDashboard
            user={user}
            requests={requests}
            onAccept={handleAcceptRequest}
            onNavigate={handleNavigate}
            onUpdateUser={handleUpdateUser}
            onCompleteRequest={handleCompleteRequest}
            onWithdraw={handleWithdraw}
          />
        );
      }
    }

    if (user.role === UserRole.CLIENT_VOLUNTEER) {
      switch (currentPage) {
        case 'create-request':
          return <CreateRequestFlow onSubmit={handleCreateRequest} onCancel={() => handleNavigate('dashboard')} />;
        case 'opportunities':
          return <OpportunityBoard requests={requests} onAccept={handleAcceptRequest} />;
        case 'history':
          return <DualHistory user={user} requests={requests} />;
        case 'volunteer-resources':
          return <VolunteerResources />;
        case 'client-resources':
          return <ClientResources />;
        case 'report-safety':
          return <SafetyReportingPage onNavigate={handleNavigate} />;
        case 'community-resources':
          return <CommunityResources />;
        case 'resources':
          return <CommunityResources />;
        default: return (
          <DualDashboard
            user={user}
            requests={requests}
            actions={{
              onCreateRequest: () => handleNavigate('create-request'),
              onUpdateUser: handleUpdateUser,
              onNavigate: handleNavigate,
              onCompleteSurvey: handleCompleteSurvey,
              onAccept: handleAcceptRequest,
              onCompleteRequest: handleCompleteRequest,
              onWithdraw: handleWithdraw
            }}
          />
        );
      }
    }

    if (user.role === UserRole.ADMIN || user.role === UserRole.COORDINATOR) {
      if (currentPage === 'opportunities') return <OpportunityBoard requests={requests} onAccept={handleAcceptRequest} />;
      return <AdminDashboard requests={requests} onUpdateRequest={handleUpdateRequest} />;
    }

    return <div>Unknown State</div>;
  };

  return (
    <Layout
      user={user}
      onLogout={handleLogout}
      currentPage={currentPage}
      onNavigate={handleNavigate}
    >
      {renderContent()}
    </Layout>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
