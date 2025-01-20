// src/app/components/Footer.tsx
import styles from './footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.border} />
      <div className={styles.title}>
        <p>HOUSE OF EUREKA</p>
      </div>

      <div className={styles.gridContainer}>
        <div>
          <p className={styles.sectionTitle}>CONTACT US</p>
          <a
            href="mailto:thehouseofeureka@gmail.com"
            className={styles.emailLink}
          >
            thehouseofeureka@gmail.com
          </a>
        </div>

        <div>
          <p className={styles.sectionTitle}>SOCIAL MEDIA</p>
          <a
            href="https://instagram.com/thehouseofeureka"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.instagramLink}
          >
            Instagram
          </a>
          <a

            href="https://youtube.com/@houseofeureka"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.youtubeLink}
          >
            YouTube
          </a>
        </div>

        <div>
          <p className={styles.sectionTitle}>SPONSORS</p>
          <p className={styles.sponsorText}>Father Devin</p>
        </div>
      </div>

      <div className={styles.bottomSection}>
        <p>
          Unless otherwise stated, this work is licensed under a{' '}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.licenseLink}
          >
            Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License.
          </a>
        </p>
        <p>© 2025 The House of Eureka</p>
      </div>
    </footer>
  )
}