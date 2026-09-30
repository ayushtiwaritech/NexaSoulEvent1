'use client';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('MEMBER_1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await authClient.signUp.email({
      email,
      password,
      name,
      // @ts-expect-error (custom field)
      role,
    });

    if (error) {
      setError(error.message || 'Registration failed');
      setLoading(false);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.authBox}>
        <h1 className={styles.title}>REGISTER AGENT</h1>
        {error && <p className={styles.error}>{error}</p>}
        <form onSubmit={handleRegister} className={styles.form}>
          <input 
            type="text" 
            placeholder="Agent Name" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            className={styles.input}
          />
          <input 
            type="email" 
            placeholder="Email ID" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            className={styles.input}
          />
          <input 
            type="password" 
            placeholder="Password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            className={styles.input}
          />
          <select value={role} onChange={(e) => setRole(e.target.value)} className={styles.input}>
            <option value="MEMBER_1">MEMBER_1 (Scout)</option>
            <option value="MEMBER_2">MEMBER_2 (Commander)</option>
          </select>
          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'PROCESSING...' : 'INITIALIZE REGISTRATION'}
          </button>
        </form>
      </div>
    </div>
  );
}
