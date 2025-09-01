import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    firstName: '',
    lastName: '',
    businessName: '',
    authorizedPerson: '',
    phoneNumber: '',
    address: ''
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleRoleChange = (e) => {
    setFormData({
      ...formData,
      role: e.target.value,
      firstName: '',
      lastName: '',
      businessName: '',
      authorizedPerson: '',
      phoneNumber: '',
      address: ''
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    if (formData.password !== formData.confirmPassword) {
      setMessage('Şifreler uyuşmuyor!');
      setMessageType('danger'); 
      return;
    }

    if (!formData.role) {
      setMessage('Lütfen bir kullanıcı rolü seçiniz.');
      setMessageType('danger');
      return;
    }
    
    axios.post('http://localhost:8080/api/auth/register', formData)
      .then(response => {
        setMessage('Kayıt başarılı! Şimdi giriş yapabilirsiniz.');
        setMessageType('success');
        setTimeout(() => navigate('/login'), 2000);
      })
      .catch(error => {
        const errorMessage = error.response?.data || 'Kayıt sırasında bir hata oluştu!';
        console.error('Kayıt Hatası:', errorMessage);
        setMessage(errorMessage);
        setMessageType('danger');
      });
  };

  const renderRoleSpecificFields = () => {
    switch (formData.role) {
      case 'CUSTOMER':
        return (
          <>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Adı</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Soyadı</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Telefon Numarası</label>
              <input type="tel" id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Adres</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="form-control" required />
            </div>
          </>
        );
      case 'BUSINESS':
        return (
          <>
            <div className="mb-3">
              <label htmlFor="businessName" className="form-label">İşletme Adı</label>
              <input type="text" id="businessName" name="businessName" value={formData.businessName} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="firstName" className="form-label">Adı</label>
              <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName" className="form-label">Soyadı</label>
              <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="phoneNumber" className="form-label">Telefon Numarası</label>
              <input type="number" id="phoneNumber" name="phoneNumber" pattern="\d{11}" title="Telefon numarası 11 rakamdan oluşmalıdır"value={formData.phoneNumber} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">Adres</label>
              <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} className="form-control" required />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary-subtle text-primary-emphasis text-center">
              <h3>Kayıt Ol</h3>
            </div>
            <div className="card-body">
              {message && <div className={`alert alert-${messageType}`} role="alert">{message}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">Kullanıcı Rolü</label>
                  <select id="role" name="role" value={formData.role} onChange={handleRoleChange} className="form-select" required>
                    <option value="">Lütfen seçiniz...</option>
                    <option value="CUSTOMER">Müşteri</option>
                    <option value="BUSINESS">İşletme</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">E-posta Adresi</label>
                  <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">Şifre</label>
                  <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Şifre Tekrar</label>
                  <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="form-control" required />
                </div>
                {renderRoleSpecificFields()}
                <button type="submit" className="btn btn-primary bg-primary-subtle text-primary-emphasis w-100 mt-3">Kayıt Ol</button>
              </form>
              <p className="mt-4 text-center text-secondary">
                Zaten bir hesabınız var mı?{' '}
                <a href="/login" className="text-primary fw-bold">
                  Giriş Yap
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
