// app/register/page.tsx
'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { RegistrationFormData } from '@/lib/kv';
import CountrySelect from '@/app/components/CountrySelect/CountrySelect';
import Navbar from '@/app/components/Navbar/Navbar';
import Footer from '@/app/components/Footer/Footer';
import styles from './register.module.css';
import { ChevronDown } from 'lucide-react';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  toggleOpen: () => void;
}

const Accordion: React.FC<AccordionProps> = ({ title, children, isOpen, toggleOpen }) => {
  return (
    <div className={styles.accordionSection}>
      <div className={styles.accordionHeader} onClick={toggleOpen}>
        <h3 className={styles.accordionTitle}>{title}</h3>
        <button
          className={`${styles.accordionButton} ${isOpen ? styles.expanded : ''}`}
          type="button"
          aria-label={isOpen ? "Collapse section" : "Expand section"}
        >
          <ChevronDown size={20} />
        </button>
      </div>
      {isOpen && (
        <div className={styles.accordionContent}>
          {children}
        </div>
      )}
    </div>
  );
};

const RequiredField = () => (
  <span style={{ color: 'red', marginLeft: '3px' }}>*</span>
);

const FieldLabel = ({ htmlFor, label, required }: { htmlFor: string; label: string; required?: boolean }) => (
  <label htmlFor={htmlFor} className={styles.labelText}>
    {label}
    {required && <RequiredField />}
  </label>
);

const uploadFile = async (file: File, fileType: 'profile' | 'resume') => {
  try {
    // Get file extension
    const fileExtension = file.name.split('.').pop() || '';

    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    // Pass the file extension to the upload endpoint
    formData.append('fileExtension', fileExtension);

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Upload failed');
    }

    const result = await response.json();

    // For resume files, make sure the URL includes the extension
    if (fileType === 'resume') {
      // Check if the URL already has an extension, if not add it
      if (!result.secure_url.toLowerCase().endsWith(fileExtension.toLowerCase())) {
        return `${result.secure_url}.${fileExtension}`;
      }
    }

    return result.secure_url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

export default function Register() {
  const router = useRouter();
  const [customGender, setCustomGender] = useState<string>('');
  const [customSexualOrientation, setCustomSexualOrientation] = useState<string>('');

  const [accordionStates, setAccordionStates] = useState<{
    education: boolean;
    professional: boolean;
    organizations: boolean;
    cultural: boolean;
  }>({
    education: true,
    professional: true,
    organizations: true,
    cultural: true
  });

  const [selectedFiles, setSelectedFiles] = useState<{
    profile?: File;
    resume?: File;
  }>({});

  const [previewUrls, setPreviewUrls] = useState<{
    profile?: string;
  }>({});

  const [isUploading, setIsUploading] = useState(false);

  const [formData, setFormData] = useState<RegistrationFormData>({
    name: '',
    password: '',
    rank: 'Son',
    chapters: 'Founding Chapter',
    joinDate: new Date().toLocaleDateString(),
    projectGroups: ['House Affiliated'],
    dateOfBirth: '',
    gender: '',
    sexualOrientation: '',
    placeOfBirth: '',
    nationality: '',
    race: '',
    maritalStatus: '',
    children: 0,
    educationalBackground: [''],
    professionalInformation: [''],
    organizations: [''],
    culturalIdentifiers: [''],
    allergies: '',
    additionalInformation: '',
    profilePictureUrl: '',
    resumeUrl: '',
    contacts: {
      email: '',
      phone: '',
      instagram: '',
      wechat: '',
      line: '',
      discord: '',
      whatsapp: '',
      linkedin: '',
      kakaotalk: ''
    }
  });

  const toggleAccordion = (section: 'education' | 'professional' | 'organizations' | 'cultural'): void => {
    setAccordionStates(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const collapseAllSections = (): void => {
    setAccordionStates({
      education: false,
      professional: false,
      organizations: false,
      cultural: false
    });
  };
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'resume') => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFiles(prev => ({
        ...prev,
        [type]: e.target.files![0]
      }));

      if (type === 'profile') {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            setPreviewUrls(prev => ({
              ...prev,
              profile: e.target!.result as string
            }));
          }
        };
        reader.readAsDataURL(e.target.files[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      let profileUrl = formData.profilePictureUrl;
      let resumeUrl = formData.resumeUrl;

      if (selectedFiles.profile) {
        profileUrl = await uploadFile(selectedFiles.profile, 'profile');
      }
      if (selectedFiles.resume) {
        resumeUrl = await uploadFile(selectedFiles.resume, 'resume');
      }

      const finalFormData = {
        ...formData,
        profilePictureUrl: profileUrl,
        resumeUrl: resumeUrl
      };

      const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalFormData)
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      router.push('/membership/roster');
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration.');
    } finally {
      setIsUploading(false);
    }
  };

  const cleanLinkedInUrl = (url: string): string => {
    if (!url) return '';

    // Remove trailing slash if present
    let cleaned = url.trim().replace(/\/$/, '');

    // If no protocol, add https://
    if (!cleaned.startsWith('http')) {
      cleaned = 'https://' + cleaned;
    }

    // Convert http to https
    cleaned = cleaned.replace(/^http:/, 'https:');

    // If no www, add it and standardize to www.linkedin.com
    if (!cleaned.includes('www.linkedin.com')) {
      cleaned = cleaned.replace(/linkedin\.com/, 'www.linkedin.com');
    }

    // Extract just the username part before any numbers
    const linkedInMatch = cleaned.match(/www\.linkedin\.com\/in\/([a-zA-Z-]+)/i);
    if (linkedInMatch) {
      // Return with just the base username (before any numbers)
      return `https://www.linkedin.com/in/${linkedInMatch[1]}`;
    }

    // If it's just a username, construct the full URL
    if (/^[a-zA-Z-]+$/.test(cleaned)) {
      return `https://www.linkedin.com/in/${cleaned}`;
    }

    return cleaned;
  };

  // Helper function to update contact fields
  const updateContact = (field: keyof typeof formData.contacts, value: string) => {
    let finalValue = value;

    // Apply special cleaning for LinkedIn
    if (field.toLowerCase() === 'linkedin') {
      finalValue = cleanLinkedInUrl(value);
    }

    setFormData(prev => ({
      ...prev,
      contacts: {
        ...prev.contacts,
        [field]: finalValue
      }
    }));
  };

  // Helper function to update array fields
  const updateArray = (field: keyof typeof formData, index: number, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev[field] as string[])];
      newArray[index] = value;
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Basic Information</h2>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <FieldLabel htmlFor="name" label="Full Name" required />
                <input
                  className={styles.input}
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <FieldLabel htmlFor="password" label="Password" required />
                <input
                  className={styles.input}
                  type="password" // Changed from text for security
                  id="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
              <div className={styles.formGroup}>
                <FieldLabel htmlFor="dateOfBirth" label="Date of Birth" required />
                <input
                  className={styles.input}
                  type="date"
                  id="dateOfBirth"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
            </div>
          </section>

          {/* Personal Details Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Personal Details</h2>
            <div className={styles.row}>
              <div className={styles.formGroup}>
                <FieldLabel htmlFor="gender" label="Gender" required />
                <select
                  className={styles.select}
                  id="gender"
                  required
                  value={formData.gender}
                  onChange={(e) => {
                    const selectedGender = e.target.value;
                    if (selectedGender !== 'Other') {
                      setFormData({
                        ...formData,
                        gender: selectedGender,
                        rank: selectedGender === 'Male' ? 'Son' :
                          selectedGender === 'Female' ? 'Daughter' :
                            'Child'
                      });
                    } else {
                      setFormData({
                        ...formData,
                        gender: 'Other',
                        rank: 'Child'
                      });
                    }
                  }}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Other">Other</option>
                </select>
                {formData.gender === 'Other' && (
                  <input
                    className={`${styles.input} ${styles.otherInput}`}
                    type="text"
                    placeholder="Please specify your gender"
                    value={customGender}
                    onChange={(e) => {
                      setCustomGender(e.target.value);
                      setFormData({
                        ...formData,
                        gender: e.target.value,
                        rank: 'Child'
                      });
                    }}
                  />
                )}
              </div>

              <div className={styles.formGroup}>
                <FieldLabel htmlFor="sexualOrientation" label="Sexual Orientation" required />
                <select
                  className={styles.select}
                  id="sexualOrientation"
                  required
                  value={formData.sexualOrientation}
                  onChange={(e) => {
                    const selected = e.target.value;
                    if (selected !== 'Other') {
                      setFormData({ ...formData, sexualOrientation: selected });
                    } else {
                      setFormData({ ...formData, sexualOrientation: 'Other' });
                    }
                  }}
                >
                  <option value="">Select Sexual Orientation</option>
                  <option value="Heterosexual">Heterosexual</option>
                  <option value="Homosexual">Homosexual</option>
                  <option value="Bisexual">Bisexual</option>
                  <option value="Queer">Queer</option>
                  <option value="Other">Other</option>
                </select>
                {formData.sexualOrientation === 'Other' && (
                  <input
                    className={`${styles.input} ${styles.otherInput}`}
                    type="text"
                    placeholder="Please specify your sexual orientation"
                    value={customSexualOrientation}
                    onChange={(e) => {
                      setCustomSexualOrientation(e.target.value);
                      setFormData({
                        ...formData,
                        sexualOrientation: e.target.value
                      });
                    }}
                  />
                )}
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <FieldLabel htmlFor="placeOfBirth" label="Place of Birth (City, Country)" required />
                <input
                  className={styles.input}
                  type="text"
                  id="placeOfBirth"
                  required
                  value={formData.placeOfBirth}
                  onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                />
              </div>

              <div className={styles.formGroup}>
                <FieldLabel htmlFor="nationality" label="Nationality" required />
                <CountrySelect
                  onSelect={(country) => setFormData({ ...formData, nationality: country })}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.formGroup}>
                <FieldLabel htmlFor="race" label="Race" required />
                <select
                  className={styles.select}
                  id="race"
                  required
                  value={formData.race}
                  onChange={(e) => setFormData({ ...formData, race: e.target.value })}
                >
                  <option value="">Select Race</option>
                  <option value="White">White</option>
                  <option value="Black or African American">Black or African American</option>
                  <option value="American Indian or Alaska Native">American Indian or Alaska Native</option>
                  <option value="Asian">Asian</option>
                  <option value="Native Hawaiian or Other Pacific Islander">Native Hawaiian or Other Pacific Islander</option>
                  <option value="Hispanic or Latino">Hispanic or Latino</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <FieldLabel htmlFor="maritalStatus" label="Marital Status" required />
                <select
                  className={styles.select}
                  id="maritalStatus"
                  required
                  value={formData.maritalStatus}
                  onChange={(e) => setFormData({ ...formData, maritalStatus: e.target.value })}
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single Never Married">Single Never Married</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <FieldLabel htmlFor="children" label="Number of Children" required />
                <input
                  className={styles.input}
                  type="number"
                  id="children"
                  required
                  min="0"
                  value={formData.children}
                  onChange={(e) => setFormData({ ...formData, children: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </section>

          {/* Educational Background Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Educational Background</h2>
            <div className={styles.sectionControls}>
              <button
                type="button"
                className={styles.collapseAllButton}
                onClick={collapseAllSections}
              >
                Collapse all
              </button>
            </div>

            <Accordion
              title="Educational Background"
              isOpen={accordionStates.education}
              toggleOpen={() => toggleAccordion('education')}
            >
              {formData.educationalBackground.map((edu, index) => (
                <div key={index} className={styles.arrayField}>
                  <input
                    className={`${styles.input} ${styles.arrayFieldInput}`}
                    type="text"
                    value={edu}
                    onChange={(e) => updateArray('educationalBackground', index, e.target.value)}
                    placeholder="ex. New York University, Bachelors of Science in Computer Science, 2025"
                  />
                  <div className={styles.buttonGroup}>
                    {/* Show remove button if there's more than one field */}
                    {formData.educationalBackground.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            educationalBackground: formData.educationalBackground.filter((_, i) => i !== index)
                          });
                        }}
                      >
                        Remove
                      </button>
                    )}
                    {/* Only show Add More button on the last field */}
                    {index === formData.educationalBackground.length - 1 && (
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => setFormData({
                          ...formData,
                          educationalBackground: [...formData.educationalBackground, '']
                        })}
                      >
                        Add More
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </Accordion>
          </section>

          {/* Contact Information Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Contact Information</h2>
            <div className={styles.contactsGrid}>
              <div className={styles.formGroup}>
                <FieldLabel htmlFor="email" label="Email (Personal)" required />
                <input
                  className={styles.input}
                  type="email"
                  id="email"
                  required
                  value={formData.contacts.email}
                  onChange={(e) => updateContact('email', e.target.value)}
                />
              </div>
              <div className={styles.formGroup}>
                <FieldLabel htmlFor="phone" label="Phone Number" required />
                <input
                  className={styles.input}
                  type="tel"
                  id="phone"
                  required
                  value={formData.contacts.phone}
                  onChange={(e) => updateContact('phone', e.target.value)}
                />
              </div>

              {/* Optional contact fields */}
              {['Instagram', 'WeChat', 'Line', 'Discord', 'WhatsApp', 'LinkedIn', 'KakaoTalk'].map((field) => (
                <div key={field} className={styles.formGroup}>
                  <FieldLabel
                    htmlFor={field}
                    label={field}
                  />
                  <input
                    className={styles.input}
                    type="text"
                    id={field}
                    value={formData.contacts[field.toLowerCase() as keyof typeof formData.contacts]}
                    onChange={(e) => updateContact(field.toLowerCase() as keyof typeof formData.contacts, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Professional & Organizational Information Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Professional & Organizational Information</h2>
            <div className={styles.sectionControls}>
              <button
                type="button"
                className={styles.collapseAllButton}
                onClick={collapseAllSections}
              >
                Collapse All
              </button>
            </div>

            <Accordion
              title="Professional Information"
              isOpen={accordionStates.professional}
              toggleOpen={() => toggleAccordion('professional')}
            >
              <p className={styles.subDescription}>
                If applicable, list your five most recent Job Titles and their respective Companies in the provided format. Sections that are unable to be filled out can be left blank.
              </p>
              {formData.professionalInformation.map((info, index) => (
                <div key={index} className={styles.arrayField}>
                  <input
                    className={`${styles.input} ${styles.arrayFieldInput}`}
                    type="text"
                    value={info}
                    onChange={(e) => updateArray('professionalInformation', index, e.target.value)}
                    placeholder="Professional experience or role"
                  />
                  <div className={styles.buttonGroup}>
                    {formData.professionalInformation.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            professionalInformation: formData.professionalInformation.filter((_, i) => i !== index)
                          });
                        }}
                      >
                        Remove
                      </button>
                    )}
                    {index === formData.professionalInformation.length - 1 && (
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => setFormData({
                          ...formData,
                          professionalInformation: [...formData.professionalInformation, '']
                        })}
                      >
                        Add More
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </Accordion>

            <Accordion
              title="Organizations"
              isOpen={accordionStates.organizations}
              toggleOpen={() => toggleAccordion('organizations')}
            >
              <p className={styles.subDescription}>
                If applicable, list your five most recent Titles and their respective Organizations in the provided format. Sections that are unable to be filled out can be left blank.
              </p>
              {formData.organizations.map((org, index) => (
                <div key={index} className={styles.arrayField}>
                  <input
                    className={`${styles.input} ${styles.arrayFieldInput}`}
                    type="text"
                    value={org}
                    onChange={(e) => updateArray('organizations', index, e.target.value)}
                    placeholder="Organization name"
                  />
                  <div className={styles.buttonGroup}>
                    {formData.organizations.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            organizations: formData.organizations.filter((_, i) => i !== index)
                          });
                        }}
                      >
                        Remove
                      </button>
                    )}
                    {index === formData.organizations.length - 1 && (
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => setFormData({
                          ...formData,
                          organizations: [...formData.organizations, '']
                        })}
                      >
                        Add More
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </Accordion>

            <Accordion
              title="Cultural Identifiers"
              isOpen={accordionStates.cultural}
              toggleOpen={() => toggleAccordion('cultural')}
            >
              <p className={styles.subDescription}>
                Please list any languages spoken, hobbies or interests, religious or cultural affiliation, etc.
              </p>
              {formData.culturalIdentifiers.map((identifier, index) => (
                <div key={index} className={styles.arrayField}>
                  <input
                    className={`${styles.input} ${styles.arrayFieldInput}`}
                    type="text"
                    value={identifier}
                    onChange={(e) => updateArray('culturalIdentifiers', index, e.target.value)}
                    placeholder="Cultural identifier"
                  />
                  <div className={styles.buttonGroup}>
                    {formData.culturalIdentifiers.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => {
                          setFormData({
                            ...formData,
                            culturalIdentifiers: formData.culturalIdentifiers.filter((_, i) => i !== index)
                          });
                        }}
                      >
                        Remove
                      </button>
                    )}
                    {index === formData.culturalIdentifiers.length - 1 && (
                      <button
                        type="button"
                        className={styles.addButton}
                        onClick={() => setFormData({
                          ...formData,
                          culturalIdentifiers: [...formData.culturalIdentifiers, '']
                        })}
                      >
                        Add More
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </Accordion>
          </section>

          {/* Additional Information Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Additional Information</h2>
            <div className={styles.formGroup}>
              <FieldLabel htmlFor="allergies" label="Allergies" />
              <input
                className={styles.input}
                type="text"
                id="allergies"
                value={formData.allergies}
                onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                placeholder="List any allergies"
              />
            </div>
            <div className={styles.formGroup}>
              <FieldLabel htmlFor="additionalInfo" label="Additional Information" />
              <textarea
                className={styles.textarea}
                id="additionalInfo"
                value={formData.additionalInformation}
                onChange={(e) => setFormData({ ...formData, additionalInformation: e.target.value })}
                placeholder="Any additional information you'd like to share"
              />
            </div>
          </section>

          {/* File Upload Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>File Upload</h2>

            {/* Profile Picture Upload */}
            <div className={styles.formGroup}>
              <FieldLabel htmlFor="profilePicture" label="Profile Picture" required />
              <p className={styles.fileDescription}>
                Please submit a full frontal face profile picture
              </p>
              <div className={styles.fileInputWrapper}>
                <input
                  className={styles.fileInput}
                  type="file"
                  id="profilePicture"
                  required
                  accept="image/*"
                  onChange={(e) => handleFileSelect(e, 'profile')}
                />
                {previewUrls.profile && (
                  <div className={styles.previewContainer}>
                    <img
                      src={previewUrls.profile}
                      alt="Profile preview"
                      className={styles.imagePreview}
                    />
                    <div className={styles.fileStatus}>
                      Ready to upload on submission
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resume Upload */}
            <div className={styles.formGroup}>
              <FieldLabel htmlFor="resume" label="Resume" />
              <div className={styles.fileInputWrapper}>
                <input
                  className={styles.fileInput}
                  type="file"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFileSelect(e, 'resume')}
                />
                {selectedFiles.resume && (
                  <div className={styles.fileStatus}>
                    {selectedFiles.resume.name} - Ready to upload on submission
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <button
            type="submit"
            className={styles.submitButton}
            disabled={isUploading}
          >
            {isUploading ? 'Uploading Files & Submitting...' : 'Submit Registration'}
          </button>
        </form>

        <div className={styles.requiredNote}>
          <RequiredField /> Denotes required field
        </div>
      </div>
      <Footer />
    </>
  );
}