'use client';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
        },
      },
    });
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.brand}>
        <Link href="/">CU MISSION BOARD</Link>
      </div>
      <div className={styles.authLinks}>
        <Link href="/operatives" className={styles.navLink}>MISSION OPERATIVES</Link>
        {isPending ? (
          <span className={styles.loading}>Loading...</span>
        ) : session ? (
          <>
            <span className={styles.userInfo}>[{(session.user as { role?: string }).role}] {session.user.name}</span>
            <button onClick={handleLogout} className={styles.logoutBtn}>LOGOUT</button>
          </>
        ) : (
          <>
            <Link href="/login" className={styles.navLink}>LOGIN</Link>
            <Link href="/register" className={styles.navLink}>REGISTER</Link>
          </>
        )}
      </div>
    </nav>
  );
}
