'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

export default function Home() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<{
    message: string;
    isError: boolean;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus({ message: 'Correct! Entering now...', isError: false });
        // Wait 1 second then navigate
        setTimeout(() => {
          router.push('/hero');
        }, 750);
      } else {
        setStatus({ message: 'Incorrect password', isError: true });
      }
    } catch (err) {
      setStatus({ message: 'Failed to connect to server', isError: true });
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.title}>HOUSE OF EUREKA</p>
      <form onSubmit={handleSubmit} className={styles.passwordContainer}>
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.passwordInput}
          placeholder="Password..."
        />
        {status && (
          <div className={status.isError ? styles.error : styles.success}>
            {status.message}
          </div>
        )}
      </form>
    </div>
  )
}