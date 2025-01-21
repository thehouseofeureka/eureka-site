import { notFound } from 'next/navigation'
import { getMemberRegistration } from '@/lib/kv'
import styles from './page.module.css'
import Navbar from '@/app/components/Navbar/Navbar'
import Footer from '@/app/components/Footer/Footer'

type tParams = Promise<{ slug: string }>;

export default async function UserProfile(props: { params: tParams }) {
  const { slug } = await props.params;

  console.log(slug)

  const nameFromSlug = decodeURIComponent(slug)
    .replace(/_/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const member = await getMemberRegistration(nameFromSlug);

  if (!member) {
    notFound();
  }

  // Helper functions to determine if sections have data
  const hasBasicInfo = Object.values({
    rank: member.rank,
    chapters: member.chapters,
    joinDate: member.joinDate,
    dateOfBirth: member.dateOfBirth,
    gender: member.gender,
    sexualOrientation: member.sexualOrientation,
    placeOfBirth: member.placeOfBirth,
    nationality: member.nationality,
    race: member.race,
    maritalStatus: member.maritalStatus,
    children: member.children !== undefined && member.children !== null ? true : false,
  }).some(value => value);

  const hasContactInfo = Object.values(member.contacts).some(value => value && value.trim() !== '');

  const hasProfessionalBackground = [
    member.educationalBackground,
    member.professionalInformation
  ].some(arr => Array.isArray(arr) && arr.filter(item => item.trim() !== '').length > 0);

  const hasOrganizationsOrGroups = [
    member.projectGroups,
    member.organizations
  ].some(arr => Array.isArray(arr) && arr.filter(item => item.trim() !== '').length > 0);

  const hasCulturalOrAdditionalInfo = [
    member.culturalIdentifiers,
    member.allergies,
    member.additionalInformation
  ].some(item => {
    if (Array.isArray(item)) {
      return item.filter(i => i.trim() !== '').length > 0;
    }
    return item && item.trim() !== '';
  });

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        {/* Profile Picture */}
        <div className={styles.profilePictureContainer}>
          {member.profilePictureUrl && (
            <img
              src={member.profilePictureUrl}
              alt={`${member.name}'s Profile Picture`}
              className={styles.profilePicture}
            />
          )}
        </div>

        <h1 className={styles.name}>{member.name}</h1>

        {/* Resume Link */}
        {member.resumeUrl && (
          <div className={styles.resumeContainer}>
            <a href={member.resumeUrl} target="_blank" rel="noopener noreferrer" className={styles.resumeLink}>
              View Resume
            </a>
          </div>
        )}

        <div className={styles.grid}>
          {/* Basic Information Section */}
          {hasBasicInfo && (
            <div className={styles.section}>
              <h2>Basic Information</h2>
              <div className={styles.content}>
                {member.rank && <p><strong>Rank:</strong> {member.rank}</p>}
                {member.chapters && <p><strong>Chapters:</strong> {member.chapters}</p>}
                {member.joinDate && <p><strong>Join Date:</strong> {member.joinDate}</p>}
                {member.dateOfBirth && <p><strong>Date of Birth:</strong> {member.dateOfBirth}</p>}
                {member.gender && <p><strong>Gender:</strong> {member.gender}</p>}
                {member.sexualOrientation && <p><strong>Sexual Orientation:</strong> {member.sexualOrientation}</p>}
                {member.placeOfBirth && <p><strong>Place of Birth:</strong> {member.placeOfBirth}</p>}
                {member.nationality && <p><strong>Nationality:</strong> {member.nationality}</p>}
                {member.race && <p><strong>Race:</strong> {member.race}</p>}
                {member.maritalStatus && <p><strong>Marital Status:</strong> {member.maritalStatus}</p>}
                {(member.children !== undefined && member.children !== null) && <p><strong>Children:</strong> {member.children}</p>}
              </div>
            </div>
          )}

          {/* Contact Information Section */}
          {hasContactInfo && (
            <div className={styles.section}>
              <h2>Contact Information</h2>
              <div className={styles.content}>
                {['instagram', 'wechat', 'line', 'discord', 'whatsapp', 'linkedin', 'kakaotalk'].map((platform) => {
                  const value = member.contacts[platform as keyof typeof member.contacts];
                  if (!value || value.trim() === '') return null;
                  // Capitalize first letter
                  const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);
                  return (
                    <p key={platform}>
                      <strong>{platformName}:</strong> {value}
                    </p>
                  );
                })}
              </div>
            </div>
          )}

          {/* Professional Background Section */}
          {hasProfessionalBackground && (
            <div className={styles.section}>
              <h2>Professional Background</h2>
              <div className={styles.content}>
                {member.educationalBackground && member.educationalBackground.filter(edu => edu.trim() !== '').length > 0 && (
                  <div>
                    <strong>Educational Background:</strong>
                    <ul>
                      {member.educationalBackground
                        .filter(edu => edu.trim() !== '')
                        .map((edu, i) => (
                          <li key={i}>{edu}</li>
                        ))}
                    </ul>
                  </div>
                )}

                {member.professionalInformation && member.professionalInformation.filter(info => info.trim() !== '').length > 0 && (
                  <div>
                    <strong>Professional Information:</strong>
                    <ul>
                      {member.professionalInformation
                        .filter(info => info.trim() !== '')
                        .map((info, i) => (
                          <li key={i}>{info}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Organization & Project Groups Section */}
          {hasOrganizationsOrGroups && (
            <div className={styles.section}>
              <h2>Organization & Project Groups</h2>
              <div className={styles.content}>
                {member.projectGroups && member.projectGroups.filter(group => group.trim() !== '').length > 0 && (
                  <div>
                    <strong>Project Groups:</strong>
                    <ul>
                      {member.projectGroups
                        .filter(group => group.trim() !== '')
                        .map((group, i) => (
                          <li key={i}>{group}</li>
                        ))}
                    </ul>
                  </div>
                )}

                {member.organizations && member.organizations.filter(org => org.trim() !== '').length > 0 && (
                  <div>
                    <strong>Organizations:</strong>
                    <ul>
                      {member.organizations
                        .filter(org => org.trim() !== '')
                        .map((org, i) => (
                          <li key={i}>{org}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Cultural & Additional Information Section */}
          {hasCulturalOrAdditionalInfo && (
            <div className={styles.section}>
              <h2>Cultural & Additional Information</h2>
              <div className={styles.content}>
                {member.culturalIdentifiers && member.culturalIdentifiers.filter(id => id.trim() !== '').length > 0 && (
                  <div>
                    <strong>Cultural Identifiers:</strong>
                    <ul>
                      {member.culturalIdentifiers
                        .filter(id => id.trim() !== '')
                        .map((identifier, i) => (
                          <li key={i}>{identifier}</li>
                        ))}
                    </ul>
                  </div>
                )}

                {member.allergies && member.allergies.trim() !== '' && (
                  <p><strong>Allergies:</strong> {member.allergies}</p>
                )}

                {member.additionalInformation && member.additionalInformation.trim() !== '' && (
                  <div>
                    <strong>Additional Information:</strong>
                    <p>{member.additionalInformation}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}
