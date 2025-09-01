import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/PropertyCard';

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [properties, setProperties] = useState([]);
    const [profileData, setProfileData] = useState(null);
    const navigate = useNavigate();
    const { user, logout, loading } = useAuth();

    useEffect(() => {
        if (!loading && (!user || !user.token || !user.role || !user.email)) {
            navigate('/login');
        }
    }, [loading, user, navigate]);

    useEffect(() => {
        if (!user) return;
        const fetchProfileData = async () => {
            let endpoint = '';
            if (user.role === 'CUSTOMER') {
                endpoint = `http://localhost:8080/api/customers/${user.id}`;
            } else if (user.role === 'BUSINESS') {
                endpoint = `http://localhost:8080/api/business/${user.id}`;
            } else {
                return;
            }

            try {
                const response = await axios.get(endpoint, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setProfileData(response.data);
            } catch (error) {
                console.error('Profil bilgileri alınırken bir hata oluştu!', error);
                setProfileData({ error: 'Profil bilgileri yüklenemedi.' });
            }
        };

        const fetchProperties = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/properties/my-properties', {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
                setProperties(response.data);
            } catch (error) {
                console.error('İlanlar alınırken bir hata oluştu!', error);
            }
        };

        fetchProfileData();
        if (activeTab === 'ads') {
            fetchProperties();
        }
    }, [activeTab, user]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const renderProfileDetails = () => {
        if (!profileData) {
            return <div className="text-center">Yükleniyor...</div>;
        }
        if (profileData.error) {
            return <div className="alert alert-danger">{profileData.error}</div>;
        }

        return (
            <div className="card-body">
                <h4 className="card-title">Kullanıcı Bilgileri</h4>
                <p className="card-text">
                    <strong>E-posta:</strong> {user.email}
                </p>
                <p className="card-text">
                    <strong>Rol:</strong> {user.role}
                </p>
                <hr />
                {user.role === 'CUSTOMER' ? (
                    <>
                        <h5 className="card-subtitle mb-2 text-muted">Müşteri Bilgileri</h5>
                        <p className="card-text">
                            <strong>Ad:</strong> {profileData.firstName} {profileData.lastName}
                        </p>
                        <p className="card-text">
                            <strong>Telefon:</strong> {profileData.phoneNumber}
                        </p>
                        <p className="card-text">
                            <strong>Adres:</strong> {profileData.address}
                        </p>
                    </>
                ) : (
                    <>
                        <h5 className="card-subtitle mb-2 text-muted">İşletme Bilgileri</h5>
                        <p className="card-text">
                            <strong>İşletme Adı:</strong> {profileData.businessName}
                        </p>
                        <p className="card-text">
                            <strong>Yetkili Adı:</strong> {profileData.firstName} {profileData.lastName}
                        </p>
                        <p className="card-text">
                            <strong>Telefon:</strong> {profileData.phoneNumber}
                        </p>
                        <p className="card-text">
                            <strong>Adres:</strong> {profileData.address}
                        </p>
                    </>
                )}
                <hr />
                <button className="btn btn-danger" onClick={handleLogout}>
                    Çıkış Yap
                </button>
            </div>
        );
    };

    if (loading) return <div className="text-center mt-5">Yükleniyor...</div>;
    if (!user) return null; 

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Profil Sayfası</h2>
            <ul className="nav nav-tabs" id="profileTab" role="tablist">
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                        onClick={() => setActiveTab('profile')}
                        id="profile-tab"
                        type="button"
                        role="tab"
                    >
                        Profil
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button
                        className={`nav-link ${activeTab === 'ads' ? 'active' : ''}`}
                        onClick={() => setActiveTab('ads')}
                        id="ads-tab"
                        type="button"
                        role="tab"
                    >
                        İlanlarım
                    </button>
                </li>
            </ul>
            <div className="tab-content mt-3">
                {activeTab === 'profile' && (
                    <div className="tab-pane fade show active">
                        <div className="card shadow-sm">{renderProfileDetails()}</div>
                    </div>
                )}
                {activeTab === 'ads' && (
                    <div className="container mt-5">
                    {properties.length > 0 ? (
                      <div className="row">
                        {properties.map((property) => (
                          <div className="col-md-4 mb-4" key={property.id}>
                            <PropertyCard property={property} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="alert alert-info text-center">
                        Henüz bir ilanınız bulunmamaktadır.
                      </div>
                    )}
                  </div>
                  
                )}
            </div>
        </div>
    );
};

export default Profile;
