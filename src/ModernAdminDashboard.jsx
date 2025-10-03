import React, { useEffect, useState } from 'react';

const AdminDashboard = () => {
    const [ownerFeedbacks, setOwnerFeedbacks] = useState([]);
    const [userFeedbacks, setUserFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    
    // Modal states for viewing details
    const [showModal, setShowModal] = useState(false);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [modalType, setModalType] = useState(''); // 'owner' or 'user'

    useEffect(() => {
        fetchAllFeedbacks();
    }, []);

    const fetchAllFeedbacks = async () => {
        setLoading(true);
        try {
            const [ownerResponse, userResponse] = await Promise.all([
                fetch('https://feedbackform-aab9.onrender.com/api/owner-feedback'),
                fetch('https://feedbackform-aab9.onrender.com/api/user-feedback')
            ]);
            
            const ownerData = await ownerResponse.json();
            const userData = await userResponse.json();
            
            setOwnerFeedbacks(ownerData);
            setUserFeedbacks(userData);
        } catch (error) {
            console.error('Error fetching feedbacks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Enhanced Analytics calculations
    const analytics = {
        totalFeedbacks: ownerFeedbacks.length + userFeedbacks.length,
        ownerCount: ownerFeedbacks.length,
        userCount: userFeedbacks.length,
        avgOwnerRating: ownerFeedbacks.length > 0 
            ? (ownerFeedbacks.reduce((sum, f) => sum + (f.recommendation || 0), 0) / ownerFeedbacks.length).toFixed(1)
            : 0,
        avgUserRating: userFeedbacks.length > 0 
            ? (userFeedbacks.reduce((sum, f) => sum + (f.recommendation || 0), 0) / userFeedbacks.length).toFixed(1)
            : 0,
        completionRate: ownerFeedbacks.length > 0 
            ? ((ownerFeedbacks.filter(f => f.completionTime).length / ownerFeedbacks.length) * 100).toFixed(1)
            : 0,
        
        // New Analytics from Enhanced Fields
        topChallenges: ownerFeedbacks.reduce((acc, f) => {
            if (f.biggestChallenge) {
                acc[f.biggestChallenge] = (acc[f.biggestChallenge] || 0) + 1;
            }
            return acc;
        }, {}),
        
        budgetDistribution: ownerFeedbacks.reduce((acc, f) => {
            if (f.readyToPay) {
                acc[f.readyToPay] = (acc[f.readyToPay] || 0) + 1;
            }
            return acc;
        }, {}),
        
        userPaymentWillingness: userFeedbacks.reduce((acc, f) => {
            const willing = f.willingToPay?.includes('Yes') || f.willingToPay?.includes('Haan');
            acc[willing ? 'willing' : 'not_willing'] = (acc[willing ? 'willing' : 'not_willing'] || 0) + 1;
            return acc;
        }, {}),
        
        urgencyLevels: userFeedbacks.reduce((acc, f) => {
            if (f.urgency) {
                const level = f.urgency.includes('Immediately') || f.urgency.includes('turant') ? 'urgent' : 'normal';
                acc[level] = (acc[level] || 0) + 1;
            }
            return acc;
        }, {}),
        
        languageDistribution: [...ownerFeedbacks, ...userFeedbacks].reduce((acc, f) => {
            if (f.language) {
                acc[f.language] = (acc[f.language] || 0) + 1;
            }
            return acc;
        }, {})
    };

    // Handle viewing detailed feedback
    const handleViewDetails = (feedback, type) => {
        setSelectedFeedback(feedback);
        setModalType(type);
        setShowModal(true);
    };

    // Close modal
    const closeModal = () => {
        setShowModal(false);
        setSelectedFeedback(null);
        setModalType('');
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Inter, system-ui, sans-serif'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    padding: '40px',
                    borderRadius: '20px',
                    textAlign: 'center',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                }}>
                    <div style={{
                        width: '50px',
                        height: '50px',
                        border: '4px solid #667eea',
                        borderTop: '4px solid transparent',
                        borderRadius: '50%',
                        margin: '0 auto 20px',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ color: '#667eea', fontSize: '18px', fontWeight: '500' }}>
                        Loading Analytics...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: 'Inter, system-ui, sans-serif',
            padding: '20px 0'
        }}>
            {/* Header */}
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                padding: '0 20px'
            }}>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    overflow: 'hidden',
                    marginBottom: '20px'
                }}>
                    <div style={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '32px',
                        textAlign: 'center',
                        color: '#fff'
                    }}>
                        <h1 style={{
                            fontSize: '32px',
                            fontWeight: '700',
                            margin: '0 0 8px 0',
                            letterSpacing: '-0.5px'
                        }}>
                            🔧 Admin Dashboard
                        </h1>
                        <p style={{
                            fontSize: '18px',
                            opacity: 0.9,
                            margin: 0,
                            fontWeight: '400'
                        }}>
                            Platform Feedback Analytics & Insights
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <div style={{
                        display: 'flex',
                        background: '#f8faff',
                        borderBottom: '1px solid #e2e8f0'
                    }}>
                        {[
                            { id: 'overview', label: '📊 Overview', icon: '📊' },
                            { id: 'owners', label: '🏢 Owners', icon: '🏢' },
                            { id: 'users', label: '👤 Users', icon: '👤' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    padding: '16px 24px',
                                    border: 'none',
                                    background: activeTab === tab.id ? '#fff' : 'transparent',
                                    color: activeTab === tab.id ? '#667eea' : '#64748b',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s ease',
                                    borderBottom: activeTab === tab.id ? '3px solid #667eea' : '3px solid transparent'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div>
                        {/* Stats Cards */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            <div style={{
                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                padding: '24px',
                                borderRadius: '16px',
                                color: '#fff',
                                boxShadow: '0 10px 25px rgba(16, 185, 129, 0.3)'
                            }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📈</div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>
                                    {analytics.totalFeedbacks}
                                </h3>
                                <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
                                    Total Feedbacks
                                </p>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                padding: '24px',
                                borderRadius: '16px',
                                color: '#fff',
                                boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                            }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏢</div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>
                                    {analytics.ownerCount}
                                </h3>
                                <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
                                    Property Owners
                                </p>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                                padding: '24px',
                                borderRadius: '16px',
                                color: '#fff',
                                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.3)'
                            }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>👤</div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>
                                    {analytics.userCount}
                                </h3>
                                <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
                                    Room Seekers
                                </p>
                            </div>

                            <div style={{
                                background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
                                padding: '24px',
                                borderRadius: '16px',
                                color: '#fff',
                                boxShadow: '0 10px 25px rgba(236, 72, 153, 0.3)'
                            }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⭐</div>
                                <h3 style={{ margin: '0 0 8px 0', fontSize: '32px', fontWeight: '700' }}>
                                    {analytics.avgOwnerRating}/10
                                </h3>
                                <p style={{ margin: 0, opacity: 0.9, fontSize: '16px' }}>
                                    Avg Rating
                                </p>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(20px)',
                            borderRadius: '20px',
                            padding: '32px',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '24px',
                                fontWeight: '600',
                                margin: '0 0 20px 0',
                                color: '#1e293b'
                            }}>
                                📊 Quick Insights
                            </h2>
                            
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                                gap: '20px'
                            }}>
                                <div style={{
                                    padding: '20px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    background: '#f8faff'
                                }}>
                                    <h4 style={{ margin: '0 0 12px 0', color: '#667eea' }}>
                                        Owner Preferences
                                    </h4>
                                    <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>
                                        Most owners struggle with tenant verification and rent collection
                                    </p>
                                </div>
                                
                                <div style={{
                                    padding: '20px',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    background: '#f8faff'
                                }}>
                                    <h4 style={{ margin: '0 0 12px 0', color: '#667eea' }}>
                                        User Demands
                                    </h4>
                                    <p style={{ margin: '0', color: '#64748b', fontSize: '14px' }}>
                                        Users want verified listings and transparent pricing
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Owners Tab */}
                {activeTab === 'owners' && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '32px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            margin: '0 0 20px 0',
                            color: '#1e293b'
                        }}>
                            🏢 Property Owner Feedbacks ({analytics.ownerCount})
                        </h2>

                        {ownerFeedbacks.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: '#64748b'
                            }}>
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>📋</div>
                                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No Owner Feedbacks Yet</h3>
                                <p>Owner feedback submissions will appear here</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8faff' }}>
                                            <th style={modernTableHeader}>Name & Contact</th>
                                            <th style={modernTableHeader}>Location</th>
                                            <th style={modernTableHeader}>Business Details</th>
                                            <th style={modernTableHeader}>Challenge</th>
                                            <th style={modernTableHeader}>Switch Reasons</th>
                                            <th style={modernTableHeader}>Budget</th>
                                            <th style={modernTableHeader}>Rating</th>
                                            <th style={modernTableHeader}>Language</th>
                                            <th style={modernTableHeader}>Date</th>
                                            <th style={modernTableHeader}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {ownerFeedbacks.map((feedback, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={modernTableCell}>
                                                    <div style={{ fontWeight: '500' }}>{feedback.name}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{feedback.email}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{feedback.phone}</div>
                                                </td>
                                                <td style={modernTableCell}>
                                                    {feedback.city}
                                                    {feedback.pincode && (
                                                        <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                            {feedback.pincode}
                                                        </div>
                                                    )}
                                                </td>
                                                <td style={modernTableCell}>
                                                    <div style={{ fontWeight: '500' }}>{feedback.propertyType}</div>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                        {feedback.propertyCount} properties
                                                    </div>
                                                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                                                        Marketing: {feedback.marketingSpend || 'N/A'}
                                                    </div>
                                                </td>
                                                <td style={{ ...modernTableCell, maxWidth: '200px' }}>
                                                    {feedback.biggestChallenge ? (
                                                        <div style={{
                                                            fontSize: '12px',
                                                            background: '#fff7ed',
                                                            padding: '4px 8px',
                                                            borderRadius: '4px',
                                                            color: '#c2410c'
                                                        }}>
                                                            {feedback.biggestChallenge.substring(0, 30)}...
                                                        </div>
                                                    ) : 'N/A'}
                                                </td>
                                                <td style={{ ...modernTableCell, maxWidth: '180px' }}>
                                                    {feedback.switchReasons && Array.isArray(feedback.switchReasons) ? (
                                                        <div style={{ fontSize: '11px' }}>
                                                            {feedback.switchReasons.slice(0, 2).map((reason, idx) => (
                                                                <div key={idx} style={{
                                                                    background: '#f0f9ff',
                                                                    color: '#0369a1',
                                                                    padding: '2px 6px',
                                                                    borderRadius: '4px',
                                                                    margin: '1px 0',
                                                                    fontSize: '10px'
                                                                }}>
                                                                    {reason.substring(0, 25)}
                                                                </div>
                                                            ))}
                                                            {feedback.switchReasons.length > 2 && (
                                                                <div style={{ fontSize: '10px', color: '#64748b' }}>
                                                                    +{feedback.switchReasons.length - 2} more
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : 'N/A'}
                                                </td>
                                                <td style={modernTableCell}>
                                                    <div style={{
                                                        background: '#f0fdf4',
                                                        color: '#166534',
                                                        padding: '6px 10px',
                                                        borderRadius: '6px',
                                                        fontSize: '11px',
                                                        textAlign: 'center'
                                                    }}>
                                                        {feedback.readyToPay || 'N/A'}
                                                    </div>
                                                    <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                                                        Timeline: {feedback.timing || 'N/A'}
                                                    </div>
                                                </td>
                                                <td style={modernTableCell}>
                                                    <span style={{
                                                        background: feedback.recommendation >= 8 ? '#10b981' : 
                                                                   feedback.recommendation >= 6 ? '#f59e0b' : '#ef4444',
                                                        color: 'white',
                                                        padding: '6px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '600'
                                                    }}>
                                                        {feedback.recommendation}/10
                                                    </span>
                                                </td>
                                                <td style={modernTableCell}>
                                                    <span style={{
                                                        background: '#e0e7ff',
                                                        color: '#3730a3',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {feedback.language || 'N/A'}
                                                    </span>
                                                </td>
                                                <td style={modernTableCell}>
                                                    {new Date(feedback.createdAt || feedback.submittedAt).toLocaleDateString()}
                                                </td>
                                                <td style={modernTableCell}>
                                                    <button
                                                        onClick={() => handleViewDetails(feedback, 'owner')}
                                                        style={{
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '8px 16px',
                                                            borderRadius: '6px',
                                                            fontSize: '12px',
                                                            cursor: 'pointer',
                                                            fontWeight: '500',
                                                            transition: 'all 0.2s ease',
                                                            boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.target.style.transform = 'translateY(-1px)';
                                                            e.target.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.transform = 'translateY(0)';
                                                            e.target.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.2)';
                                                        }}
                                                    >
                                                        👁️ View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderRadius: '20px',
                        padding: '32px',
                        boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                    }}>
                        <h2 style={{
                            fontSize: '24px',
                            fontWeight: '600',
                            margin: '0 0 20px 0',
                            color: '#1e293b'
                        }}>
                            👤 Room Seeker Feedbacks ({analytics.userCount})
                        </h2>

                        {userFeedbacks.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '60px 20px',
                                color: '#64748b'
                            }}>
                                <div style={{ fontSize: '64px', marginBottom: '16px' }}>👥</div>
                                <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>No User Feedbacks Yet</h3>
                                <p>User feedback submissions will appear here</p>
                            </div>
                        ) : (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                        <tr style={{ background: '#f8faff' }}>
                                            <th style={modernTableHeader}>Name & Contact</th>
                                            <th style={modernTableHeader}>Profile</th>
                                            <th style={modernTableHeader}>Location</th>
                                            <th style={modernTableHeader}>Current Situation</th>
                                            <th style={modernTableHeader}>Main Problems</th>
                                            <th style={modernTableHeader}>Budget & Payment</th>
                                            <th style={modernTableHeader}>Rating</th>
                                            <th style={modernTableHeader}>Language</th>
                                            <th style={modernTableHeader}>Date</th>
                                            <th style={modernTableHeader}>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {userFeedbacks.map((feedback, index) => (
                                            <tr key={index} style={{ borderBottom: '1px solid #e2e8f0' }}>
                                                <td style={modernTableCell}>
                                                    <div style={{ fontWeight: '500' }}>{feedback.name}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{feedback.email}</div>
                                                    <div style={{ fontSize: '11px', color: '#64748b' }}>{feedback.phone}</div>
                                                </td>
                                                <td style={modernTableCell}>
                                                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                                                        {feedback.occupation}
                                                    </div>
                                                </td>
                                                <td style={modernTableCell}>{feedback.city}</td>
                                                <td style={{ ...modernTableCell, maxWidth: '150px' }}>
                                                    {feedback.currentSituation ? (
                                                        <div style={{
                                                            fontSize: '11px',
                                                            background: '#fffbeb',
                                                            color: '#92400e',
                                                            padding: '4px 6px',
                                                            borderRadius: '4px'
                                                        }}>
                                                            {feedback.currentSituation.substring(0, 25)}...
                                                        </div>
                                                    ) : 'N/A'}
                                                </td>
                                                <td style={{ ...modernTableCell, maxWidth: '180px' }}>
                                                    {feedback.mainProblems && Array.isArray(feedback.mainProblems) ? (
                                                        <div style={{ fontSize: '11px' }}>
                                                            {feedback.mainProblems.slice(0, 2).map((problem, idx) => (
                                                                <div key={idx} style={{
                                                                    background: '#fef2f2',
                                                                    color: '#991b1b',
                                                                    padding: '2px 6px',
                                                                    borderRadius: '4px',
                                                                    margin: '1px 0',
                                                                    fontSize: '10px'
                                                                }}>
                                                                    {problem.substring(0, 20)}
                                                                </div>
                                                            ))}
                                                            {feedback.mainProblems.length > 2 && (
                                                                <div style={{ fontSize: '10px', color: '#64748b' }}>
                                                                    +{feedback.mainProblems.length - 2} more
                                                                </div>
                                                            )}
                                                        </div>
                                                    ) : 'N/A'}
                                                </td>
                                                <td style={modernTableCell}>
                                                    <div style={{
                                                        background: '#ecfdf5',
                                                        color: '#065f46',
                                                        padding: '4px 8px',
                                                        borderRadius: '6px',
                                                        fontSize: '11px',
                                                        textAlign: 'center',
                                                        marginBottom: '4px'
                                                    }}>
                                                        {feedback.budget}
                                                    </div>
                                                    <div style={{
                                                        background: feedback.willingToPay?.includes('Yes') || 
                                                                   feedback.willingToPay?.includes('Haan') ? '#dcfce7' : '#fef3c7',
                                                        color: feedback.willingToPay?.includes('Yes') || 
                                                               feedback.willingToPay?.includes('Haan') ? '#166534' : '#92400e',
                                                        padding: '2px 6px',
                                                        borderRadius: '4px',
                                                        fontSize: '10px',
                                                        textAlign: 'center'
                                                    }}>
                                                        {feedback.willingToPay?.includes('Yes') || 
                                                         feedback.willingToPay?.includes('Haan') ? '💰 Yes' : '🆓 Free'}
                                                    </div>
                                                </td>
                                                <td style={modernTableCell}>
                                                    <span style={{
                                                        background: feedback.recommendation >= 8 ? '#10b981' : 
                                                                   feedback.recommendation >= 6 ? '#f59e0b' : '#ef4444',
                                                        color: 'white',
                                                        padding: '6px 12px',
                                                        borderRadius: '20px',
                                                        fontSize: '12px',
                                                        fontWeight: '600'
                                                    }}>
                                                        {feedback.recommendation}/10
                                                    </span>
                                                </td>
                                                <td style={modernTableCell}>
                                                    <span style={{
                                                        background: '#e0e7ff',
                                                        color: '#3730a3',
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '12px',
                                                        textTransform: 'capitalize'
                                                    }}>
                                                        {feedback.language || 'N/A'}
                                                    </span>
                                                </td>
                                                <td style={modernTableCell}>
                                                    {new Date(feedback.createdAt || feedback.submittedAt).toLocaleDateString()}
                                                </td>
                                                <td style={modernTableCell}>
                                                    <button
                                                        onClick={() => handleViewDetails(feedback, 'user')}
                                                        style={{
                                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                            color: 'white',
                                                            border: 'none',
                                                            padding: '8px 16px',
                                                            borderRadius: '6px',
                                                            fontSize: '12px',
                                                            cursor: 'pointer',
                                                            fontWeight: '500',
                                                            transition: 'all 0.2s ease',
                                                            boxShadow: '0 2px 4px rgba(102, 126, 234, 0.2)'
                                                        }}
                                                        onMouseOver={(e) => {
                                                            e.target.style.transform = 'translateY(-1px)';
                                                            e.target.style.boxShadow = '0 4px 8px rgba(102, 126, 234, 0.3)';
                                                        }}
                                                        onMouseOut={(e) => {
                                                            e.target.style.transform = 'translateY(0)';
                                                            e.target.style.boxShadow = '0 2px 4px rgba(102, 126, 234, 0.2)';
                                                        }}
                                                    >
                                                        👁️ View Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Details Modal */}
            {showModal && selectedFeedback && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000,
                padding: '20px'
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '16px',
                    padding: '32px',
                    maxWidth: '800px',
                    width: '100%',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    position: 'relative',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}>
                    {/* Close Button */}
                    <button
                        onClick={closeModal}
                        style={{
                            position: 'absolute',
                            top: '20px',
                            right: '20px',
                            background: '#f87171',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            fontSize: '20px',
                            cursor: 'pointer',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ✕
                    </button>

                    {/* Modal Content */}
                    <div style={{ marginRight: '60px' }}>
                        {modalType === 'owner' ? (
                            // Owner Details
                            <div>
                                <h2 style={{ 
                                    color: '#1f2937', 
                                    marginBottom: '24px',
                                    fontSize: '24px',
                                    fontWeight: '700'
                                }}>
                                    🏢 Property Owner Details
                                </h2>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                    {/* Personal Info */}
                                    <div style={{ background: '#f8faff', padding: '20px', borderRadius: '12px' }}>
                                        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '18px' }}>📋 Personal Information</h3>
                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            <p><strong>Name:</strong> {selectedFeedback.name || 'N/A'}</p>
                                            <p><strong>Email:</strong> {selectedFeedback.email || 'N/A'}</p>
                                            <p><strong>Phone:</strong> {selectedFeedback.phone || 'N/A'}</p>
                                            <p><strong>City:</strong> {selectedFeedback.city || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Business Info */}
                                    <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '12px' }}>
                                        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '18px' }}>🏠 Business Details</h3>
                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            <p><strong>Property Type:</strong> {selectedFeedback.propertyType || 'N/A'}</p>
                                            <p><strong>Property Count:</strong> {selectedFeedback.propertyCount || 'N/A'}</p>
                                            <p><strong>Marketing Spend:</strong> {selectedFeedback.marketingSpend || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Challenges */}
                                    <div style={{ background: '#fff7ed', padding: '20px', borderRadius: '12px' }}>
                                        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '18px' }}>⚠️ Current Challenges</h3>
                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            <p><strong>Biggest Challenge:</strong> {selectedFeedback.biggestChallenge || 'N/A'}</p>
                                            {selectedFeedback.otherChallenge && (
                                                <p><strong>Other Challenge:</strong> {selectedFeedback.otherChallenge}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Switch Reasons */}
                                    <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '12px' }}>
                                        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '18px' }}>🔄 Switch Reasons</h3>
                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            {selectedFeedback.switchReasons && Array.isArray(selectedFeedback.switchReasons) ? (
                                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                                    {selectedFeedback.switchReasons.map((reason, idx) => (
                                                        <li key={idx} style={{ marginBottom: '8px' }}>{reason}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No switch reasons provided</p>
                                            )}
                                            {selectedFeedback.otherSwitchReason && (
                                                <p style={{ marginTop: '12px' }}><strong>Other Reason:</strong> {selectedFeedback.otherSwitchReason}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Features */}
                                    <div style={{ background: '#fef7ff', padding: '20px', borderRadius: '12px' }}>
                                        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '18px' }}>⭐ Top Features Needed</h3>
                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            {selectedFeedback.topFeatures && Array.isArray(selectedFeedback.topFeatures) ? (
                                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                                    {selectedFeedback.topFeatures.map((feature, idx) => (
                                                        <li key={idx} style={{ marginBottom: '8px' }}>{feature}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No features specified</p>
                                            )}
                                            {selectedFeedback.otherFeature && (
                                                <p style={{ marginTop: '12px' }}><strong>Other Feature:</strong> {selectedFeedback.otherFeature}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Budget & Metrics */}
                                    <div style={{ background: '#ecfdf5', padding: '20px', borderRadius: '12px' }}>
                                        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '18px' }}>💰 Budget & Metrics</h3>
                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            <p><strong>Ready to Pay:</strong> {selectedFeedback.readyToPay || 'N/A'}</p>
                                            <p><strong>Timeline:</strong> {selectedFeedback.timing || 'N/A'}</p>
                                            <p><strong>Recommendation Score:</strong> 
                                                <span style={{
                                                    background: selectedFeedback.recommendation >= 8 ? '#10b981' : 
                                                               selectedFeedback.recommendation >= 6 ? '#f59e0b' : '#ef4444',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    marginLeft: '8px'
                                                }}>
                                                    {selectedFeedback.recommendation || 0}/10
                                                </span>
                                            </p>
                                            <p><strong>Language:</strong> {selectedFeedback.language || 'N/A'}</p>
                                            <p><strong>Form Completion Time:</strong> {selectedFeedback.completionTime ? `${Math.round(selectedFeedback.completionTime)} seconds` : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // User Details
                            <div>
                                <h2 style={{ 
                                    color: '#1f2937', 
                                    marginBottom: '24px',
                                    fontSize: '24px',
                                    fontWeight: '700'
                                }}>
                                    👤 Room Seeker Details
                                </h2>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                                    {/* Personal Info */}
                                    <div style={{ background: '#f8faff', padding: '20px', borderRadius: '12px' }}>
                                        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '18px' }}>📋 Personal Information</h3>
                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            <p><strong>Name:</strong> {selectedFeedback.name || 'N/A'}</p>
                                            <p><strong>Email:</strong> {selectedFeedback.email || 'N/A'}</p>
                                            <p><strong>Phone:</strong> {selectedFeedback.phone || 'N/A'}</p>
                                            <p><strong>City:</strong> {selectedFeedback.city || 'N/A'}</p>
                                            <p><strong>Occupation:</strong> {selectedFeedback.occupation || 'N/A'}</p>
                                        </div>
                                    </div>

                                    {/* Current Situation */}
                                    <div style={{ background: '#fffbeb', padding: '20px', borderRadius: '12px' }}>
                                        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '18px' }}>🏠 Current Housing</h3>
                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            <p><strong>Current Situation:</strong> {selectedFeedback.currentSituation || 'N/A'}</p>
                                            {selectedFeedback.otherCurrentSituation && (
                                                <p><strong>Other Situation:</strong> {selectedFeedback.otherCurrentSituation}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Problems */}
                                    <div style={{ background: '#fef2f2', padding: '20px', borderRadius: '12px' }}>
                                        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '18px' }}>⚠️ Main Problems</h3>
                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            {selectedFeedback.mainProblems && Array.isArray(selectedFeedback.mainProblems) ? (
                                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                                    {selectedFeedback.mainProblems.map((problem, idx) => (
                                                        <li key={idx} style={{ marginBottom: '8px' }}>{problem}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No problems specified</p>
                                            )}
                                            {selectedFeedback.otherMainProblem && (
                                                <p style={{ marginTop: '12px' }}><strong>Other Problem:</strong> {selectedFeedback.otherMainProblem}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Important Features */}
                                    <div style={{ background: '#f0f9ff', padding: '20px', borderRadius: '12px' }}>
                                        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '18px' }}>⭐ Important Features</h3>
                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            {selectedFeedback.importantFeatures && Array.isArray(selectedFeedback.importantFeatures) ? (
                                                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                                    {selectedFeedback.importantFeatures.map((feature, idx) => (
                                                        <li key={idx} style={{ marginBottom: '8px' }}>{feature}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No features specified</p>
                                            )}
                                            {selectedFeedback.otherFeature && (
                                                <p style={{ marginTop: '12px' }}><strong>Other Feature:</strong> {selectedFeedback.otherFeature}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Budget & Metrics */}
                                    <div style={{ background: '#ecfdf5', padding: '20px', borderRadius: '12px' }}>
                                        <h3 style={{ color: '#374151', marginBottom: '16px', fontSize: '18px' }}>💰 Budget & Preferences</h3>
                                        <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                                            <p><strong>Budget Range:</strong> {selectedFeedback.budget || 'N/A'}</p>
                                            <p><strong>Willing to Pay:</strong> 
                                                <span style={{
                                                    background: selectedFeedback.willingToPay?.includes('Yes') || selectedFeedback.willingToPay?.includes('Haan') ? '#dcfce7' : '#fef3c7',
                                                    color: selectedFeedback.willingToPay?.includes('Yes') || selectedFeedback.willingToPay?.includes('Haan') ? '#166534' : '#92400e',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    marginLeft: '8px'
                                                }}>
                                                    {selectedFeedback.willingToPay?.includes('Yes') || selectedFeedback.willingToPay?.includes('Haan') ? '💰 Yes' : '🆓 Free Only'}
                                                </span>
                                            </p>
                                            <p><strong>Urgency:</strong> {selectedFeedback.urgency || 'N/A'}</p>
                                            <p><strong>Recommendation Score:</strong> 
                                                <span style={{
                                                    background: selectedFeedback.recommendation >= 8 ? '#10b981' : 
                                                               selectedFeedback.recommendation >= 6 ? '#f59e0b' : '#ef4444',
                                                    color: 'white',
                                                    padding: '4px 8px',
                                                    borderRadius: '4px',
                                                    marginLeft: '8px'
                                                }}>
                                                    {selectedFeedback.recommendation || 0}/10
                                                </span>
                                            </p>
                                            <p><strong>Language:</strong> {selectedFeedback.language || 'N/A'}</p>
                                            <p><strong>Form Completion Time:</strong> {selectedFeedback.completionTime ? `${Math.round(selectedFeedback.completionTime)} seconds` : 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Submission Info */}
                        <div style={{ 
                            marginTop: '24px', 
                            padding: '16px', 
                            background: '#f3f4f6', 
                            borderRadius: '8px',
                            textAlign: 'center',
                            fontSize: '14px',
                            color: '#6b7280'
                        }}>
                            <p>📅 <strong>Submitted:</strong> {new Date(selectedFeedback.createdAt || selectedFeedback.submittedAt).toLocaleString()}</p>
                            <p>🆔 <strong>ID:</strong> {selectedFeedback._id}</p>
                        </div>
                    </div>
                </div>
            </div>
            )}
        </div>
    );
};

const modernTableHeader = {
    padding: '16px 12px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '2px solid #667eea'
};

const modernTableCell = {
    padding: '16px 12px',
    color: '#4b5563',
    fontSize: '14px',
    verticalAlign: 'top'
};

export default AdminDashboard;