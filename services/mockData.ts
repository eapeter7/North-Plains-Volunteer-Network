
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
    clientLanguage: 'English',
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
    id: 'r1b',
    clientId: 'c1',
    clientName: 'Martha Stewart',
    clientLanguage: 'English',
    category: RequestCategory.RIDE,
    subcategory: 'Medical Appointment',
    description: 'Round-trip transportation to physical therapy appointment at Tuality Health Center, 335 SE 8th Ave, Hillsboro, OR 97123. Pick up client at 1:30 PM, appointment at 2:00 PM, return client home at 3:00 PM.',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0], // +2 days
    timeWindow: 'Pick up at 1:30 PM, Return at 3:00 PM',
    appointmentTime: '2:00 PM',
    pickupTime: '1:30 PM',
    returnTime: '3:00 PM',
    location: '123 Main St, North Plains, OR 97133',
    pickupAddress: '123 Main St, North Plains, OR 97133',
    destinationAddress: 'Tuality Health Center, 335 SE 8th Ave, Hillsboro, OR 97123',
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
  { id: 'FIRST_STEPS', labelKey: 'badge.first_steps', icon: '👣', color: 'bg-cyan-400', descriptionKey: 'badge.first_steps_desc' },
  { id: '5_HOURS', labelKey: 'badge.helping_hand', icon: '🥉', color: 'bg-amber-600', descriptionKey: 'badge.helping_hand_desc' },
  { id: '10_HOURS', labelKey: 'badge.neighbor_champion', icon: '🥈', color: 'bg-slate-400', descriptionKey: 'badge.neighbor_champion_desc' },
  { id: '25_HOURS', labelKey: 'badge.community_supporter', icon: '🏅', color: 'bg-blue-400', descriptionKey: 'badge.community_supporter_desc' },
  { id: '50_HOURS', labelKey: 'badge.service_leader', icon: '🥇', color: 'bg-yellow-500', descriptionKey: 'badge.service_leader_desc' },
  { id: '75_HOURS', labelKey: 'badge.impact_maker', icon: '🌟', color: 'bg-purple-500', descriptionKey: 'badge.impact_maker_desc' },
  { id: '100_HOURS', labelKey: 'badge.100_hour_milestone', icon: '💯', color: 'bg-emerald-500', descriptionKey: 'badge.100_hour_milestone_desc' },
  { id: '250_HOURS', labelKey: 'badge.250_hour_milestone', icon: '🏆', color: 'bg-rose-500', descriptionKey: 'badge.250_hour_milestone_desc' },
  { id: 'VETERAN_VOLUNTEER', labelKey: 'badge.veteran_volunteer', icon: '🎖️', color: 'bg-purple-700', descriptionKey: 'badge.veteran_volunteer_desc' },

  // Category Specific
  { id: 'COMPANIONSHIP_STAR', labelKey: 'badge.companionship_star', icon: '⭐', color: 'bg-pink-400', descriptionKey: 'badge.companionship_star_desc' },
  { id: 'ERRAND_EXPERT', labelKey: 'badge.errand_expert', icon: '🛒', color: 'bg-green-500', descriptionKey: 'badge.errand_expert_desc' },
  { id: 'RIDE_HERO', labelKey: 'badge.ride_hero', icon: '🚗', color: 'bg-blue-500', descriptionKey: 'badge.ride_hero_desc' },
  { id: 'HOME_HELPER', labelKey: 'badge.home_helper', icon: '🏠', color: 'bg-orange-500', descriptionKey: 'badge.home_helper_desc' },
  { id: 'TECH_BUDDY', labelKey: 'badge.tech_buddy', icon: '💻', color: 'bg-indigo-500', descriptionKey: 'badge.tech_buddy_desc' },

  // Skills & Capabilities
  { id: 'DRIVER', labelKey: 'badge.certified_driver', icon: '🚙', color: 'bg-blue-600', descriptionKey: 'badge.certified_driver_desc' },
  { id: 'SAFE_GUARD', labelKey: 'badge.safe_guard', icon: '🛡️', color: 'bg-red-500', descriptionKey: 'badge.safe_guard_desc' },
  { id: 'MULTILINGUAL', labelKey: 'badge.multilingual', icon: '🌍', color: 'bg-teal-500', descriptionKey: 'badge.multilingual_desc' },
  { id: 'TECH_HELPER', labelKey: 'badge.tech_helper', icon: '⚙️', color: 'bg-slate-600', descriptionKey: 'badge.tech_helper_desc' },

  // Platform
  { id: 'PLATFORM_PRO', labelKey: 'badge.platform_pro', icon: '📱', color: 'bg-slate-600', descriptionKey: 'badge.platform_pro_desc' }
];
