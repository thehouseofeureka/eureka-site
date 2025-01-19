// app/api/register/route.ts
import { getAllRegistrations, registerMember } from '@/lib/kv';
import type { RegistrationFormData } from '@/lib/kv';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const registrationData: RegistrationFormData = await req.json();
    
    // Check if user already exists
    const registrations = await getAllRegistrations();
    const existingUser = registrations.find(r => r.name === registrationData.name);
    
    if (existingUser) {
      return Response.json(
        { error: 'A user with this name already exists' }, 
        { status: 400 }
      );
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(registrationData.password, saltRounds);

    // Replace plain password with hashed password
    const dataToStore = {
      ...registrationData,
      password: hashedPassword
    };

    // Register new member
    const success = await registerMember(dataToStore);
    
    if (success) {
      return Response.json({ success: true });
    } else {
      return Response.json(
        { error: 'Failed to register user' }, 
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Registration error:', error);
    return Response.json(
      { error: 'Failed to process registration' }, 
      { status: 500 }
    );
  }
}