// src/app/home/page.tsx
import Navbar from '../components/Navbar/Navbar'
import Footer from '../components/Footer/Footer'
import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  return (
    <>
      <Navbar />
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
      <Footer />
    </>
  )
}