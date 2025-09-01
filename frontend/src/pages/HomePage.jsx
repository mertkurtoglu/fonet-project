import React, { useState, useEffect } from 'react';
import PropertyCard from '../components/PropertyCard';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { propertiesAPI } from '../services/apiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import EmptyState from '../components/common/EmptyState';

const HomePage = () => {
    const [properties, setProperties] = useState([]);
    const { user } = useAuth();
    const { loading, error, execute, clearError } = useApi();

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const data = await execute(propertiesAPI.getAll);
                setProperties(data);
            } catch (err) {
                // Error is handled by useApi hook
            }
        };

        if (user) {
            fetchProperties();
        }
    }, [user, execute]);

    if (loading) {
        return (
            <div className="container mt-5">
                <LoadingSpinner text="İlanlar yükleniyor..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mt-5">
                <ErrorMessage 
                    message={error} 
                    onRetry={() => window.location.reload()}
                    onDismiss={clearError}
                />
            </div>
        );
    }

    return (
        <div className="container mt-2">
            <h1 className="text-center mb-4">Mevcut İlanlar</h1>
            
            {properties.length === 0 ? (
                <EmptyState 
                    title="Henüz İlan Yok"
                    message="Henüz hiç ilan bulunmamaktadır."
                    icon="🏠"
                />
            ) : (
                <div className="row">
                    {properties.map(property => (
                        <div className="col-md-4 mb-4" key={property.id}>
                            <PropertyCard property={property} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HomePage;