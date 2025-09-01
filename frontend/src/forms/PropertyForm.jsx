import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { useNavigate } from 'react-router-dom'; // useNavigate hook'unu içeri aktar
import { useAuth } from '../context/AuthContext';
import { propertyTypeReverseMap, heatingTypeReverseMap, statusTypeReverseMap, numberOfRoomsMap } from "../constants/propertyEnums";

const PropertyForm = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); // useNavigate hook'unu kullanıma hazırla
    
    const [property, setProperty] = useState({
        propertyType: '', area: '', numberOfRooms: '', floor: '', heatingType: '',
        address: '', description: '', price: '', propertyStatus: '',
    });
    const [selectedOwner, setSelectedOwner] = useState(null);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);

    useEffect(() => {
        if (user?.role === 'CUSTOMER') {
            setSelectedOwner({
                value: user.id,
                label: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProperty({ ...property, [name]: value });
    };

    const handleFileChange = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const searchCustomers = async (inputValue) => {
        if (!inputValue || inputValue.length < 2) {
            setCustomerOptions([]);
            return;
        }
        setIsLoadingCustomers(true);
        try {
            const token = user?.token;
            if (!token) return;
            let response;
            try {
                response = await axios.get(
                    `http://localhost:8080/api/customers/search?query=${encodeURIComponent(inputValue)}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
            } catch {
                response = await axios.get(`http://localhost:8080/api/customers`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                response.data = response.data.filter(u =>
                    u.email.toLowerCase().includes(inputValue.toLowerCase())
                );
            }
            const options = response.data.map(u => ({
                value: u.id,
                label: `${u.firstName} ${u.lastName}`
            }));
            setCustomerOptions(options);
        } catch (error) {
            console.error(error);
            setCustomerOptions([]);
        } finally {
            setIsLoadingCustomers(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user || !user.token) {
            alert('Lütfen giriş yapın.');
            return;
        }

        if (!selectedOwner) {
            alert('Lütfen bir mülk sahibi seçin.');
            return;
        }

        const formData = new FormData();
        const propertyData = {
            propertyType: propertyTypeReverseMap[property.propertyType],
            area: parseFloat(property.area),
            numberOfRooms: property.numberOfRooms,
            floor: parseInt(property.floor),
            heatingType: heatingTypeReverseMap[property.heatingType],
            address: property.address,
            description: property.description,
            price: parseFloat(property.price),
            propertyStatus: statusTypeReverseMap[property.propertyStatus]
        };

        formData.append('property', new Blob([JSON.stringify(propertyData)], { type: 'application/json' }));
        formData.append('ownerId', String(selectedOwner.value));
        formData.append('listerId', user.id);
        selectedFiles.forEach(file => formData.append('files', file));

        try {
            await axios.post('http://localhost:8080/api/properties', formData, {
                headers: { 'Authorization': `Bearer ${user.token}` }
            });
            alert('Emlak başarıyla kaydedildi!');
            navigate('/'); 
        } catch (error) {
            console.error(error);
            alert('Emlak kaydı sırasında bir hata oluştu.');
        }
    };

    return (
        <div className="container mt-5 card shadow-lg border-0 rounded-4 p-4">
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {/* Left Column */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Emlak Türü</label>
                            <select className="form-select" name="propertyType" value={property.propertyType} onChange={handleChange} required>
                                <option value="">Seçiniz...</option>
                                {Object.keys(propertyTypeReverseMap).map(key => (
                                    <option key={key} value={key}>{key}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Alan (m²)</label>
                            <input type="number" className="form-control" name="area" value={property.area} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Oda Sayısı</label>
                            <Select
                                value={numberOfRoomsMap.find(opt => opt.value === property.numberOfRooms)}
                                onChange={(selected) => setProperty({ ...property, numberOfRooms: selected ? selected.value : '' })}
                                options={numberOfRoomsMap}
                                placeholder="Seçiniz..."
                                required
                                isClearable
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Kat</label>
                            <input type="number" className="form-control" name="floor" value={property.floor} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Fiyat</label>
                            <input type="number" className="form-control" name="price" value={property.price} onChange={handleChange} required />
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="col-md-6">
                        <div className="mb-3">
                            <label className="form-label">Durum</label>
                            <select className="form-select" name="propertyStatus" value={property.propertyStatus} onChange={handleChange} required>
                                <option value="">Seçiniz...</option>
                                {Object.keys(statusTypeReverseMap).map(key => (
                                    <option key={key} value={key}>{key}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Isıtma Türü</label>
                            <select className="form-select" name="heatingType" value={property.heatingType} onChange={handleChange} required>
                                <option value="">Seçiniz...</option>
                                {Object.keys(heatingTypeReverseMap).map(key => (
                                    <option key={key} value={key}>{key}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Adres</label>
                            <input type="text" className="form-control" name="address" value={property.address} onChange={handleChange} required />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Mülk Sahibi</label>
                            <Select
                                value={selectedOwner}
                                onChange={setSelectedOwner}
                                options={customerOptions}
                                placeholder="Müşteri arayın..."
                                isClearable
                                isSearchable
                                noOptionsMessage={() => isLoadingCustomers ? "Aranıyor..." : "Sonuç bulunamadı"}
                                isLoading={isLoadingCustomers}
                                onInputChange={(inputValue, { action }) => { if (action === 'input-change') searchCustomers(inputValue); }}
                                isDisabled={user?.role === 'CUSTOMER'}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Resim Seçin</label>
                            <input type="file" className="form-control" onChange={handleFileChange} multiple />
                        </div>
                    </div>
                </div>
                {/* Bottom Row (Full Width) */}
                <div className="row mt-3">
                    <div className="col-12">
                        <div className="mb-3">
                            <label className="form-label">Açıklama</label>
                            <textarea className="form-control" name="description" value={property.description} onChange={handleChange} rows="3" required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-100">Kaydet</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default PropertyForm;