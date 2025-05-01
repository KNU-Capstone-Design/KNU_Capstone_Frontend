import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import styles from './Home.module.css';
import ProfileForm from '../components/ProfileForm';
import { usersAPI } from '../api/users';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFormOpen, setIsFormOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await usersAPI.getProfile();
                console.log('User Data:', response.data);
                setUserData(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching user data:', err);
                setError(err.message);
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const closeForm = () => setIsFormOpen(false);

    if (loading) {
        return (
            <>
                <Navbar showSubscribe={false} />
                <main className={styles.mainContent}>
                    <div className={styles.container} style={{ 
                        justifyContent: 'center', 
                        flexDirection: 'column', 
                        textAlign: 'center',
                        minHeight: 'calc(100vh - 80px)'
                    }}>
                        <h1>로딩 중...</h1>
                    </div>
                </main>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Navbar showSubscribe={false} />
                <main className={styles.mainContent}>
                    <div className={styles.container} style={{ 
                        justifyContent: 'center', 
                        flexDirection: 'column', 
                        textAlign: 'center',
                        minHeight: 'calc(100vh - 80px)'
                    }}>
                        <h1>에러가 발생했습니다</h1>
                        <p>{error}</p>
                    </div>
                </main>
            </>
        );
    }

    return (
        <>
            <Navbar showSubscribe={false} />
            <main className={styles.mainContent}>
                <div className={styles.container} style={{ 
                    justifyContent: 'center', 
                    flexDirection: 'column', 
                    textAlign: 'center',
                    minHeight: 'calc(100vh - 80px)'
                }}>
                    <h1 className={styles.title}>프로필 설정</h1>
                    <div style={{
                        padding: '20px',
                        backgroundColor: '#f5f5f5',
                        borderRadius: '8px',
                        marginTop: '20px'
                    }}>
                        <pre style={{
                            textAlign: 'left',
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word'
                        }}>
                            {JSON.stringify(userData, null, 2)}
                        </pre>
                    </div>
                    {isFormOpen && <ProfileForm onCancel={closeForm} />}
                </div>
            </main>
        </>
    );
}

export default Profile;