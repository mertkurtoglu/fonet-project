import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import ErrorMessage from '../components/common/ErrorMessage';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { validateForm } from '../utils/validators';

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { login } = useAuth();
    const { loading, error, execute, clearError } = useApi();

    const validationRules = {
        email: [
            { type: 'required', message: 'E-posta adresi gereklidir' },
            { type: 'email', message: 'Geçerli bir e-posta adresi giriniz' }
        ],
        password: [
            { type: 'required', message: 'Şifre gereklidir' },
            { type: 'minLength', length: 6, message: 'Şifre en az 6 karakter olmalıdır' }
        ]
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        // Clear field error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate form
        const validationErrors = validateForm(formData, validationRules);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        try {
            await execute(login, formData);
            navigate('/');
        } catch (err) {
            // Error is handled by useApi hook
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card shadow-sm">
                        <div className="card-header bg-primary-subtle text-primary-emphasis text-center">
                            <h3>Giriş Yap</h3>
                        </div>
                        <div className="card-body">
                            {error && (
                                <ErrorMessage 
                                    message={error} 
                                    onDismiss={clearError}
                                />
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">E-posta</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {errors.email && (
                                        <div className="invalid-feedback">{errors.email}</div>
                                    )}
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Şifre</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        disabled={loading}
                                    />
                                    {errors.password && (
                                        <div className="invalid-feedback">{errors.password}</div>
                                    )}
                                </div>
                                
                                <div className="d-grid gap-2">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary"
                                        disabled={loading}
                                    >
                                        {loading ? <LoadingSpinner size="small" text="" /> : 'Giriş Yap'}
                                    </button>
                                </div>
                            </form>
                            
                            <p className="mt-4 text-center text-secondary">
                                Hesabın yok mu?{' '}
                                <Link to="/register" className="text-primary fw-bold">
                                    Kayıt ol
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;
