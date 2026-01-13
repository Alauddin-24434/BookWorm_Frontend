import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>403 - Access Denied</h1>
      <p style={styles.message}>
        You do not have the required permissions to view this page.
      </p>
      <Link href="/" style={styles.button}>
        Back to Home
      </Link>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    textAlign: 'center' as const,
    backgroundColor: '#f8f9fa',
    color: '#333',
  },
  title: {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: '#dc3545', // Red color for warning
  },
  message: {
    fontSize: '1.2rem',
    marginBottom: '2rem',
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#0070f3',
    color: 'white',
    borderRadius: '5px',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
};