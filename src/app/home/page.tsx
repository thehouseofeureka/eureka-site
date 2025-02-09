// src/app/home/page.tsx
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <div className={styles.pageWrapper}>
      <Navbar />
      <main className={styles.mainContent}>
        <div className={styles.imageContainer}>
          <div className={styles.flowerWrapper}>
            <Image
              src="/flower.svg"
              alt="Flower"
              width={200}
              height={200}
              className={styles.flowerClockwise}
            />
            <Image
              src="/flower.svg"
              alt="Flower"
              width={200}
              height={200}
              className={styles.flowerCounterClockwise}
            />
          </div>
        </div>
        <i><p className={styles.mantra}>PURPOSE IS NOT FOUND IN ISOLATION</p></i>
      </main>
      <Footer />
    </div>
  );
}