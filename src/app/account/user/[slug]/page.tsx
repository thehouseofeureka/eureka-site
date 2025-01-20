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
          <div className={styles.section}>
            <h2>Basic Information</h2>
            <div className={styles.content}>
              <p><strong>Rank:</strong> {member.rank}</p>
              <p><strong>Chapters:</strong> {member.chapters}</p>
              <p><strong>Join Date:</strong> {member.joinDate}</p>
              <p><strong>Date of Birth:</strong> {member.dateOfBirth}</p>
              <p><strong>Gender:</strong> {member.gender}</p>
              <p><strong>Sexual Orientation:</strong> {member.sexualOrientation}</p>
              <p><strong>Place of Birth:</strong> {member.placeOfBirth}</p>
              <p><strong>Nationality:</strong> {member.nationality}</p>
              <p><strong>Race:</strong> {member.race}</p>
              <p><strong>Marital Status:</strong> {member.maritalStatus}</p>
              <p><strong>Children:</strong> {member.children}</p>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Contact Information</h2>
            <div className={styles.content}>
              {['Instagram', 'WeChat', 'Line', 'Discord', 'WhatsApp', 'LinkedIn', 'KakaoTalk'].map((platform) => {
                const value = member.contacts[platform.toLowerCase() as keyof typeof member.contacts];
                if (!value) return null;
                return (
                  <p key={platform}>
                    <strong>{platform}:</strong> {value}
                  </p>
                );
              })}
            </div>
          </div>

          <div className={styles.section}>
            <h2>Professional Background</h2>
            <div className={styles.content}>
              <div>
                <strong>Educational Background:</strong>
                <ul>
                  {member.educationalBackground.map((edu, i) => (
                    <li key={i}>{edu}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Professional Information:</strong>
                <ul>
                  {member.professionalInformation.map((info, i) => (
                    <li key={i}>{info}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Organization & Project Groups</h2>
            <div className={styles.content}>
              <div>
                <strong>Project Groups:</strong>
                <ul>
                  {member.projectGroups.map((group, i) => (
                    <li key={i}>{group}</li>
                  ))}
                </ul>
              </div>

              <div>
                <strong>Organizations:</strong>
                <ul>
                  {member.organizations.map((org, i) => (
                    <li key={i}>{org}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h2>Cultural & Additional Information</h2>
            <div className={styles.content}>
              <div>
                <strong>Cultural Identifiers:</strong>
                <ul>
                  {member.culturalIdentifiers.map((identifier, i) => (
                    <li key={i}>{identifier}</li>
                  ))}
                </ul>
              </div>

              {member.allergies && (
                <p><strong>Allergies:</strong> {member.allergies}</p>
              )}

              {member.additionalInformation && (
                <div>
                  <strong>Additional Information:</strong>
                  <p>{member.additionalInformation}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}