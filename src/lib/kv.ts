// lib/kv.ts
import { Redis } from '@upstash/redis';
import registrationData from './data.json';

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!
});

export interface RegistrationFormData {
  name: string;
  password: string;
  rank: string;
  chapters: string;
  joinDate: string;
  projectGroups: string[];
  dateOfBirth: string;
  gender: string;
  sexualOrientation: string;
  placeOfBirth: string;
  nationality: string;
  race: string;
  maritalStatus: string;
  children: number;
  educationalBackground: string[];
  professionalInformation: string[];
  organizations: string[];
  culturalIdentifiers: string[];
  allergies: string;
  additionalInformation: string;
  profilePictureUrl: string;
  resumeUrl: string;
  contacts: {
    email: string;
    phone: string;
    instagram: string;
    wechat: string;
    line: string;
    discord: string;
    whatsapp: string;
    linkedin: string;
    kakaotalk: string;
  };
}

export interface RosterMember {
  name: string;
  rank: string[];
  chapters: string;
  joinDate: string;
  projectGroups: string[];
  tags: string[];
  contacts: {
    email: string;
    phone: string;
    instagram: string;
    wechat: string;
    line: string;
    discord: string;
    whatsapp: string;
    linkedin: string;
    kakaotalk: string;
  };
}

// Helper function to convert registration data to roster view
function registrationToRoster(registration: RegistrationFormData): RosterMember {
  const tags = new Set<string>();

  if (registration.gender) tags.add(registration.gender);
  if (registration.nationality) tags.add(registration.nationality);
  if (registration.contacts.instagram) tags.add('Instagram');
  // Add more tag logic as needed

  return {
    name: registration.name,
    rank: [registration.rank],
    chapters: registration.chapters,
    joinDate: registration.joinDate,
    projectGroups: registration.projectGroups,
    tags: Array.from(tags),
    contacts: registration.contacts
  };
}

// Store registration data
export async function registerMember(registration: RegistrationFormData) {
  try {
    // Get current registrations
    const registrations = await getAllRegistrations();

    // Add new registration
    registrations.push(registration);

    // Store updated list
    await redis.set('registration:all', registrations);

    return true;
  } catch (error) {
    console.error('Failed to register member:', error);
    return false;
  }
}

// Get all registration data
export async function getAllRegistrations(): Promise<RegistrationFormData[]> {
  try {
    const registrations = await redis.get<RegistrationFormData[]>('registration:all');
    return registrations || [];
  } catch (error) {
    console.error('Failed to get registrations:', error);
    return [];
  }
}

// Get roster view of all members
export async function getRosterView(): Promise<RosterMember[]> {
  try {
    const registrations = await getAllRegistrations();
    return registrations.map(registrationToRoster);
  } catch (error) {
    console.error('Failed to get roster view:', error);
    return [];
  }
}

// Update member data
export async function updateMember(registration: RegistrationFormData) {
  try {
    const registrations = await getAllRegistrations();
    const index = registrations.findIndex(r => r.name === registration.name);

    if (index !== -1) {
      registrations[index] = registration;
      await redis.set('registration:all', registrations);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to update member:', error);
    return false;
  }
}

export async function initializeDB() {
  try {
    // Optionally check if data already exists
    const existing = await redis.get('registration:all');
    if (existing) {
      console.log('Database already initialized');
      return false;
    }

    await redis.set('registration:all', registrationData);
    console.log('Successfully initialized database');
    return true;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    return false;
  }
}

// Get a single member's full registration data
export async function getMemberRegistration(name: string): Promise<RegistrationFormData | null> {
  try {
    const registrations = await getAllRegistrations();
    const member = registrations.find(r => r.name === name);
    return member || null;
  } catch (error) {
    console.error('Failed to get member registration:', error);
    return null;
  }
}