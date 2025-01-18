// app/register/page.tsx
'use client'
import { useState } from 'react';
import { RosterMember } from '@/lib/kv';
import Navbar from '@/app/components/Navbar/Navbar';
import Footer from '@/app/components/Footer/Footer';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    rank: 'Son', // Default value
    chapters: 'Founding Chapter', // Fixed value
    joinDate: new Date().toLocaleDateString(), // Today's date
    projectGroups: ['House Affiliated'], // Fixed value
    contacts: {
      email: '',
      phone: '',
      instagram: ''
    }
  });

  const generateTags = (formData: any) => {
    const tags = new Set<string>();
    
    // Add rank as tag
    tags.add(formData.rank);
    
    // Add chapter as tag
    tags.add(formData.chapters);
    
    // Add Instagram tag if instagram handle is provided
    if (formData.contacts.instagram) {
      tags.add('Instagram');
    }

    return Array.from(tags);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create the final member object with generated tags
    const memberData: RosterMember = {
      ...formData,
      rank: [formData.rank], // Convert rank to array as per interface
      tags: generateTags(formData),
    };

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData)
      });

      if (response.ok) {
        alert('Registration successful!');
        // Reset form
        setFormData({
          name: '',
          rank: 'Son',
          chapters: 'Founding Chapter',
          joinDate: new Date().toLocaleDateString(),
          projectGroups: ['House Affiliated'],
          contacts: {
            email: '',
            phone: '',
            instagram: ''
          }
        });
      } else {
        alert('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({
                ...formData,
                name: e.target.value
              })}
            />
          </div>

          {/* Rank Selector */}
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="rank">Rank:</label>
            <select
              id="rank"
              value={formData.rank}
              onChange={(e) => setFormData({
                ...formData,
                rank: e.target.value
              })}
            >
              <option value="Son">Son</option>
              <option value="Daughter">Daughter</option>
              <option value="Child">Child</option>
            </select>
          </div>

          {/* Contact Fields */}
          <div style={{ marginBottom: '20px' }}>
            <h3>Contact Information</h3>
            
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                required
                value={formData.contacts.email}
                onChange={(e) => setFormData({
                  ...formData,
                  contacts: {
                    ...formData.contacts,
                    email: e.target.value
                  }
                })}
              />
            </div>

            <div>
              <label htmlFor="phone">Phone:</label>
              <input
                type="tel"
                id="phone"
                required
                value={formData.contacts.phone}
                onChange={(e) => setFormData({
                  ...formData,
                  contacts: {
                    ...formData.contacts,
                    phone: e.target.value
                  }
                })}
              />
            </div>

            <div>
              <label htmlFor="instagram">Instagram:</label>
              <input
                type="text"
                id="instagram"
                value={formData.contacts.instagram}
                onChange={(e) => setFormData({
                  ...formData,
                  contacts: {
                    ...formData.contacts,
                    instagram: e.target.value
                  }
                })}
              />
            </div>
          </div>

          {/* Read-only Fields Display */}
          <div style={{ marginBottom: '20px' }}>
            <p>Chapter: {formData.chapters}</p>
            <p>Join Date: {formData.joinDate}</p>
            <p>Project Groups: {formData.projectGroups.join(', ')}</p>
          </div>

          <button type="submit">Register</button>
        </form>
      </div>
      <Footer />
    </>
  );
}