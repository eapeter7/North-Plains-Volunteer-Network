
import { Request, RequestCategory, RequestStatus, User, UserRole, OnboardingStep } from '../types';

export const MOCK_USERS: Record<string, User> = {
  client: {
    id: 'c1',
    name: 'Martha Stewart',
    preferredName: 'Marty',
    email: 'martha@example.com',
    role: UserRole.CLIENT,
    onboardingStep: OnboardingStep.COMPLETE,
    address: '123 Main St, North Plains, OR 97133',
    phone: '555-0101',
    race: 'White',
    incomeRange: '$30k-$50k',
    accessibility: {
      hearing: "No",
      vision: "Yes",
      mobility: "Walker",
      notes: "Use a walker, stairs are difficult."
    },
    pets: "1 Cat named Mittens",
    interestingFacts: "I love gardening.",
    hobbies: ['Gardening', 'Cooking']
  },
  newClient: {
    id: 'c_new',
    name: 'New User',
    email: 'new@example.com',
    role: UserRole.CLIENT,
    onboardingStep: OnboardingStep.PROFILE, // Needs onboarding
  },
  volunteer: {
    id: 'v1',
    name: 'John Doe',
    email: 'john@example.com',
    role: UserRole.VOLUNTEER,
    onboardingStep: OnboardingStep.COMPLETE,
    totalHours: 124,
    backgroundCheckStatus: 'APPROVED',
    badges: ['50_HOURS', 'DRIVER', 'SAFE_GUARD', '100_HOURS'],
    newBadges: ['100_HOURS'], // Triggers the popup on login
    hobbies: ['Chess', 'Hiking'],
    isDriver: true
  },
  newVolunteer: {
    id: 'v_new',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: UserRole.VOLUNTEER,
    onboardingStep: OnboardingStep.BACKGROUND_CHECK, // In progress
    backgroundCheckStatus: 'PENDING'
  },
  testUser: {
    id: 'v_test',
    name: 'Test Volunteer',
    email: 'test@example.com',
    role: UserRole.VOLUNTEER,
    onboardingStep: OnboardingStep.PROFILE, // Start fresh
  },
  dual: {
    id: 'd1',
    name: 'Alex Taylor',
    email: 'alex@example.com',
    role: UserRole.CLIENT_VOLUNTEER,
    onboardingStep: OnboardingStep.COMPLETE,
    address: '456 Oak Ln, North Plains, OR 97133',
    phone: '555-0102',
    race: 'Hispanic',
    incomeRange: '$50k-80k',
    totalHours: 45,
    backgroundCheckStatus: 'APPROVED',
    badges: ['10_HOURS'],
    isDriver: true,
    hobbies: ['Cycling', 'Reading'],
    accessibility: {
      hearing: "No",
      vision: "No",
      mobility: "None"
    }
  },
  admin: {
    id: 'a1',
    name: 'Sarah Coordinator',
    email: 'admin@npvn.org',
    role: UserRole.ADMIN,
    onboardingStep: OnboardingStep.COMPLETE
  }
};

export const MOCK_REQUESTS: Request[] = [
  {
    id: 'r1',
    clientId: 'c1',
    clientName: 'Martha Stewart',
    category: RequestCategory.RIDE,
    subcategory: 'Medical Appointment',
    description: 'Ride to Providence Medical Center for checkup.',
    date: new Date().toISOString().split('T')[0], // Today
    timeWindow: '10:00 AM - 12:00 PM',
    appointmentTime: '10:30 AM',
    pickupTime: '10:00 AM',
    location: 'Providence, Hillsboro',
    geozone: 'North Plains - Central',
    status: RequestStatus.PENDING,
    isRecurring: false
  },
  {
    id: 'r2',
    clientId: 'c1', // Martha
    clientName: 'Martha Stewart',
    category: RequestCategory.HOME_HELP,
    subcategory: 'Yard Work',
    description: 'Need help raking leaves from driveway.',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    timeWindow: 'Flexible',
    location: 'North Plains',
    geozone: 'Glencoe High School Area',
    status: RequestStatus.MATCHED,
    volunteerId: 'v1',
    volunteerName: 'John Doe',
    isRecurring: false
  },
  {
    id: 'r3',
    clientId: 'c1',
    clientName: 'Martha Stewart',
    category: RequestCategory.SHOPPING,
    subcategory: 'Grocery',
    description: 'Weekly grocery run to Safeway.',
    date: '2023-11-10',
    timeWindow: '1:00 PM',
    location: 'Safeway',
    geozone: 'North Plains - Central',
    status: RequestStatus.COMPLETED,
    volunteerId: 'v1',
    volunteerName: 'John Doe',
    clientSurveyCompleted: true,
    volunteerSurveyCompleted: true
  },
  {
    id: 'r4',
    clientId: 'c3',
    clientName: 'Emily White',
    category: RequestCategory.SOCIAL,
    subcategory: 'Friendly Visit',
    description: 'Would love someone to play chess with.',
    date: new Date(Date.now() + 259200000).toISOString().split('T')[0], // +3 days
    timeWindow: '2:00 PM - 4:00 PM',
    location: 'Home',
    geozone: 'Pumpkin Ridge Area',
    status: RequestStatus.PENDING,
    safetyAlert: true,
    adminNotes: 'Coordinator Review: Client mentioned fall risk.'
  },
  // Request that needs survey
  {
    id: 'r5',
    clientId: 'c1',
    clientName: 'Martha Stewart',
    category: RequestCategory.RIDE,
    subcategory: 'Church Service',
    description: 'Ride to Sunday Service',
    date: '2023-10-29',
    timeWindow: '09:00 AM - 11:00 AM',
    location: 'Community Church',
    geozone: 'North Plains - Central',
    status: RequestStatus.COMPLETED, // Completed but no survey
    volunteerId: 'v1',
    volunteerName: 'John Doe',
    clientSurveyCompleted: false, // Triggers client modal
    volunteerSurveyCompleted: false // Triggers volunteer modal
  }
];

export const MOCK_COMM_LOGS = [
  { id: 'cl1', recipientId: 'v1', recipientName: 'John Doe', recipientRole: 'VOLUNTEER', type: 'EMAIL', subject: 'New Match: Ride for Martha', date: '2023-11-20T10:00:00', status: 'DELIVERED', opened: true },
  { id: 'cl2', recipientId: 'c1', recipientName: 'Martha Stewart', recipientRole: 'CLIENT', type: 'SMS', subject: 'Volunteer John confirmed for 10am', date: '2023-11-20T10:05:00', status: 'DELIVERED', opened: true },
  { id: 'cl3', recipientId: 'v2', recipientName: 'Jane Smith', recipientRole: 'VOLUNTEER', type: 'EMAIL', subject: 'Missing Background Check', date: '2023-11-18T09:00:00', status: 'DELIVERED', opened: false },
  { id: 'cl4', recipientId: 'c2', recipientName: 'Robert Black', recipientRole: 'CLIENT', type: 'SMS', subject: 'How was your visit?', date: '2023-11-19T14:00:00', status: 'SENT', opened: false },
  { id: 'cl5', recipientId: 'v1', recipientName: 'John Doe', recipientRole: 'VOLUNTEER', type: 'EMAIL', subject: 'Badge Earned: Store Hero', date: '2023-11-15T16:30:00', status: 'DELIVERED', opened: true },
  { id: 'cl6', recipientId: 'v3', recipientName: 'Bob Wilson', recipientRole: 'VOLUNTEER', type: 'EMAIL', subject: 'Urgent: Ride Needed', date: '2023-11-21T08:00:00', status: 'FAILED', opened: false }, // Bounce
];

export const BADGES = [
  // Milestones
  { id: 'FIRST_STEPS', label: 'First Steps', icon: '👣', color: 'bg-cyan-400', description: 'Completed your first volunteer assignment!' },
  { id: '5_HOURS', label: 'Helping Hand', icon: '🥉', color: 'bg-amber-600', description: 'Served 5 hours of community time.' },
  { id: '10_HOURS', label: 'Neighbor Champion', icon: '🥈', color: 'bg-slate-400', description: 'Reached 10 hours of dedicated service!' },
  { id: '25_HOURS', label: 'Community Supporter', icon: '🏅', color: 'bg-blue-400', description: '25 hours of impact.' },
  { id: '50_HOURS', label: 'Service Leader', icon: '🥇', color: 'bg-yellow-500', description: '50 hours of leadership and service.' },
  { id: '75_HOURS', label: 'Impact Maker', icon: '🌟', color: 'bg-purple-500', description: '75 hours of making a difference.' },
  { id: '100_HOURS', label: '100-Hour Milestone', icon: '💯', color: 'bg-emerald-500', description: 'Reached the centennial mark!' },
  { id: '250_HOURS', label: '250-Hour Milestone', icon: '🏆', color: 'bg-rose-500', description: 'Outstanding dedication.' },
  { id: 'VETERAN_VOLUNTEER', label: 'Veteran Volunteer', icon: '🎖️', color: 'bg-purple-700', description: '1 year of active service to the community.' },

  // Category Specific
  { id: 'COMPANIONSHIP_STAR', label: 'Companionship Star', icon: '⭐', color: 'bg-pink-400', description: '10 companionship visits.' },
  { id: 'ERRAND_EXPERT', label: 'Errand Expert', icon: '🛒', color: 'bg-green-500', description: '10 errands completed.' },
  { id: 'RIDE_HERO', label: 'Ride Hero', icon: '🚗', color: 'bg-blue-500', description: '10 transportation requests completed.' },
  { id: 'HOME_HELPER', label: 'Home Helper', icon: '🏠', color: 'bg-orange-500', description: '10 home support tasks completed.' },
  { id: 'TECH_BUDDY', label: 'Technology Buddy', icon: '💻', color: 'bg-indigo-500', description: '5 tech-help requests completed.' },

  // Skills & Capabilities
  { id: 'DRIVER', label: 'Certified Driver', icon: '🚙', color: 'bg-blue-600', description: 'Verified driver with valid license and insurance.' },
  { id: 'SAFE_GUARD', label: 'Safe Guard', icon: '🛡️', color: 'bg-red-500', description: 'Completed TVF&R safety training.' },
  { id: 'MULTILINGUAL', label: 'Multilingual', icon: '🌍', color: 'bg-teal-500', description: 'Speaks 2 or more languages fluently.' },
  { id: 'TECH_HELPER', label: 'Tech Helper', icon: '⚙️', color: 'bg-slate-600', description: 'Assists seniors with technology and devices.' },

  // Platform
  { id: 'PLATFORM_PRO', label: 'Platform Pro', icon: '📱', color: 'bg-slate-600', description: 'Completed NPVN platform training.' }
];
