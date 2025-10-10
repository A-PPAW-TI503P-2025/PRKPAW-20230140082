import React, { useEffect, useState } from 'react';

const styles = {
    appContainer: {
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #ffffff, #f7f7f7)', 
        padding: '40px 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        fontFamily: "'Helvetica Neue', Arial, sans-serif",
    },
    mainCard: {
        width: '100%',
        maxWidth: '550px',
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)', 
        borderRadius: '8px',
        padding: '30px',
        display: 'flex',
        flexDirection: 'column',
        gap: '25px',
        border: '1px solid #e0e0e0',
    },
    header: {
        textAlign: 'center',
        paddingBottom: '15px',
        borderBottom: '1px solid #e0e0e0',
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#333333',
        margin: 0,
    },
    subtitle: {
        color: '#666666',
        marginTop: '5px',
        fontSize: '15px',
    },
    serverSection: {
        padding: '15px',
        backgroundColor: '#f9f9f9',
        borderRadius: '6px',
        borderLeft: '4px solid #b0b0b0',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
    },
    serverTitle: {
        fontSize: '17px',
        fontWeight: '600',
        color: '#444444', 
        marginBottom: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
    },
    messageBox: {
        padding: '10px',
        backgroundColor: '#ffffff',
        borderRadius: '4px',
        border: '1px solid #cccccc',
        fontFamily: 'monospace',
        fontSize: '15px',
        whiteSpace: 'pre-wrap',
    },
    separator: {
        borderTop: '1px solid #e0e0e0',
        paddingTop: '25px',
    },
    interactiveTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#333333',
        textAlign: 'left',
        marginBottom: '10px',
    },
    helloCard: {
        backgroundColor: '#ffffff',
        padding: '25px',
        borderRadius: '6px',
        border: '1px solid #e0e0e0',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    greetingBase: {
        fontSize: '28px',
        fontWeight: '300',
        color: '#666666',
        marginBottom: '15px',
        minHeight: '35px',
    },
    inputField: {
        width: '100%',
        maxWidth: '300px',
        padding: '10px 15px',
        fontSize: '15px',
        border: '1px solid #cccccc', 
        borderRadius: '6px',
        outline: 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    inputFocus: {
        borderColor: '#4a90e2',
        boxShadow: '0 0 0 3px rgba(74, 144, 226, 0.2)',
    },
    infoText: {
        marginTop: '10px',
        fontSize: '13px',
        color: '#4caf50',
        fontWeight: '500',
    }
};


function App() {
    const [serverMessage, setServerMessage] = useState('Sedang mengambil pesan...');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('http://localhost:5000') 
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setServerMessage(data.message);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                setServerMessage('Gagal terhubung ke server. (Pastikan Node.js berjalan)');
                setLoading(false);
            });
    }, []);

    const getStatusIcon = () => {
        if (loading) return '⏳';
        return serverMessage.startsWith('Gagal') ? '❌' : '✅';
    };

    const messageColor = serverMessage.startsWith('Gagal') ? '#d9534f' : '#3cb371';

    // --- Komponen Tampilan Utama ---
    return (
        <div style={styles.appContainer}>
            <div style={styles.mainCard}>
                
                {/* Header dan Judul */}
                <header style={styles.header}>
                    <h1 style={styles.title}>
                        Integrasi React + Node.js
                    </h1>
                    <p style={styles.subtitle}>Menampilkan data dari backend (Port 5000)</p>
                </header>

                {/* Status Server */}
                <section style={styles.serverSection}>
                    <h2 style={styles.serverTitle}>
                        {getStatusIcon()} Status Koneksi Server:
                    </h2>
                    <div style={styles.messageBox}>
                        {loading ? (
                            <p style={{ color: '#666', fontStyle: 'italic' }}>Memuat data...</p>
                        ) : (
                            <p style={{ color: messageColor, fontWeight: '600' }}>
                                Pesan: "{serverMessage}"
                            </p>
                        )}
                    </div>
                </section>

                {/* Pemisah */}
                <div style={styles.separator}>
                    <h2 style={styles.interactiveTitle}>Fitur Interaktif</h2>
                </div>
                
                {/* Komponen Input Nama */}
                <HelloNama />

            </div>
        </div>
    );
}

function HelloNama() {
    const [name, setName] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    
    const handleNameChange = (e) => {
        const value = e.target.value;
        setName(value.replace(/[^a-zA-Z\s]/g, '')); 
    };

    const nameStyle = {
        fontWeight: '700',
        color: name ? '#333333' : '#aaaaaa', 
        fontSize: name ? '32px' : '28px', 
        transition: 'all 0.3s ease-in-out',
        lineHeight: '1.2',
    };

    const currentInputStyle = isFocused 
        ? { ...styles.inputField, ...styles.inputFocus } 
        : styles.inputField;
    
    return (
        <div style={styles.helloCard}>
            {/* Tampilan Nama */}
            <div style={styles.greetingBase}>
                <h2 style={{ fontSize: '28px', fontWeight: '300', color: '#666666', margin: 0 }}>
                    Hai, <span style={nameStyle}>
                        {name || 'Nama Anda...'}
                    </span>
                </h2>
            </div>

            {/* Input Field */}
            <input
                type="text"
                placeholder="Ketik nama lengkap Anda di sini..."
                value={name}
                onChange={handleNameChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={currentInputStyle}
            />
            
            {/* Info tambahan jika ada nama */}
            {name.trim() && (
                <p style={styles.infoText}>
                    ✅ Nama berhasil ditampilkan secara *real-time*!
                </p>
            )}
        </div>
    );
}

export default App;