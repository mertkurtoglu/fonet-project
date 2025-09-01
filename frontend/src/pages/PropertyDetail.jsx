import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from 'react-select';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';
import { propertiesAPI } from '../services/apiService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { formatCurrency, formatArea } from '../utils/formatters';
import "../styles/PropertyDetail.css";
import { propertyTypeMap, heatingTypeMap, statusTypeMap, numberOfRoomsMap, propertyTypeReverseMap, heatingTypeReverseMap, statusTypeReverseMap } from "../constants/propertyEnums";

const PropertyDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [property, setProperty] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProperty, setEditedProperty] = useState({});
  const { loading, error, execute, clearError } = useApi();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await execute(propertiesAPI.getById, id);
        setProperty(data);
        setEditedProperty(data);
      } catch (err) {
        // Error is handled by useApi hook
      }
    };

    fetchProperty();
  }, [id, execute]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedProperty(property);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProperty({ ...editedProperty, [name]: value });
  };

  const handleSave = async () => {
    try {
      const propertyData = {
        propertyType: propertyTypeReverseMap[editedProperty.propertyType] || editedProperty.propertyType,
        area: parseFloat(editedProperty.area),
        numberOfRooms: editedProperty.numberOfRooms,
        floor: parseInt(editedProperty.floor),
        heatingType: heatingTypeReverseMap[editedProperty.heatingType] || editedProperty.heatingType,
        address: editedProperty.address,
        description: editedProperty.description,
        price: parseFloat(editedProperty.price),
        propertyStatus: statusTypeReverseMap[editedProperty.propertyStatus] || editedProperty.propertyStatus
      };

      await execute(propertiesAPI.update, id, propertyData);
      
      // Update the property state with the edited data
      setProperty(editedProperty);
      setIsEditing(false);
      alert('Emlak başarıyla güncellendi!');
    } catch (error) {
      // Error is handled by useApi hook
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Bu ilanı silmek istediğinizden emin misiniz?');
    if (!confirmDelete) return;

    try {
      await execute(propertiesAPI.delete, id);
      alert('İlan başarıyla silindi!');
      window.history.back();
    } catch (error) {
      // Error is handled by useApi hook
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <LoadingSpinner text="Emlak detayları yükleniyor..." />
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

  if (!property) return null;

  const nextImage = () => {
    if (property.imageUrls && property.imageUrls.length > 0) {
      setCurrentImage((prev) => (prev + 1) % property.imageUrls.length);
    }
  };

  const prevImage = () => {
    if (property.imageUrls && property.imageUrls.length > 0) {
      setCurrentImage((prev) => (prev - 1 + property.imageUrls.length) % property.imageUrls.length);
    }
  };

  return (
    <div className="property-container">
      <div className="property-layout">
        {/* Left Slider */}
        <div className="image-slider">
          {property.imageUrls && property.imageUrls.length > 0 ? (
            <>
              <img
                src={property.imageUrls[currentImage]}
                alt={`Property ${currentImage}`}
                className="property-main-image"
              />
              {property.imageUrls.length > 1 && (
                <div className="slider-buttons">
                  <button className="slider-btn" onClick={prevImage}>
                    &#10094;
                  </button>
                  <button className="slider-btn" onClick={nextImage}>
                    &#10095;
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="no-image">Resim Yok</div>
          )}
        </div>

        {/* Right Details */}
        <div className="property-info">
          {user && (user.id === property.lister.id) && (
            <div className="edit-controls" style={{ marginBottom: '20px', textAlign: 'right' }}>
              {!isEditing ? (
                <>
                <button className="btn btn-outline-primary me-2" onClick={handleEdit}>
                  Düzenle
                </button>
                <button className="btn btn-outline-danger" onClick={handleDelete}>
                  Sil
                </button>
                </>
              ) : (
                <div>
                  <button className="btn btn-success me-2" onClick={handleSave}>
                    Kaydet
                  </button>
                  <button className="btn btn-secondary" onClick={handleCancel}>
                    İptal
                  </button>
                </div>
              )}
            </div>
          )}

          {!isEditing ? (
            // View Mode
            <div>
              <h1 className="property-title">{propertyTypeMap[property.propertyType]}</h1>
              <p className="property-price"><strong>Fiyat:</strong> {formatCurrency(property.price)}</p>
              <p><strong>Durum:</strong> {statusTypeMap[property.propertyStatus]}</p>
              <p><strong>Alan:</strong> {formatArea(property.area)}</p>
              <p><strong>Oda:</strong> {numberOfRoomsMap.find(r => r.value === property.numberOfRooms)?.label || property.numberOfRooms}</p>
              <p><strong>Kat:</strong> {property.floor}</p>
              <p><strong>Isıtma:</strong> {heatingTypeMap[property.heatingType]}</p>
              <p><strong>Adres:</strong> {property.address}</p>
              <p><strong>Açıklama:</strong> {property.description}</p>
            </div>
          ) : (
            // Edit Mode
            <div>
              <div className="mb-3">
                <label className="form-label">Emlak Türü</label>
                <select className="form-select" name="propertyType" 
                        value={editedProperty.propertyType} 
                        onChange={(e) => setEditedProperty({...editedProperty, propertyType: e.target.value})}>
                  {Object.keys(propertyTypeMap).map(key => (
                    <option key={key} value={key}>{propertyTypeMap[key]}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Durum</label>
                <select className="form-select" name="propertyStatus" 
                        value={editedProperty.propertyStatus} 
                        onChange={(e) => setEditedProperty({...editedProperty, propertyStatus: e.target.value})}>
                  {Object.keys(statusTypeMap).map(key => (
                    <option key={key} value={key}>{statusTypeMap[key]}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Alan (m²)</label>
                <input type="number" className="form-control" name="area" 
                       value={editedProperty.area} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Oda Sayısı</label>
                <Select
                  value={numberOfRoomsMap.find(opt => opt.value === editedProperty.numberOfRooms)}
                  onChange={(selected) => setEditedProperty({...editedProperty, numberOfRooms: selected?.value || ''})}
                  options={numberOfRoomsMap}
                  placeholder="Seçiniz..."
                  isClearable
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Kat</label>
                <input type="number" className="form-control" name="floor" 
                       value={editedProperty.floor} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Isıtma Türü</label>
                <select className="form-select" name="heatingType" 
                        value={editedProperty.heatingType} 
                        onChange={(e) => setEditedProperty({...editedProperty, heatingType: e.target.value})}>
                  {Object.keys(heatingTypeMap).map(key => (
                    <option key={key} value={key}>{heatingTypeMap[key]}</option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="form-label">Fiyat</label>
                <input type="number" className="form-control" name="price" 
                       value={editedProperty.price} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Adres</label>
                <input type="text" className="form-control" name="address" 
                       value={editedProperty.address} onChange={handleChange} />
              </div>

              <div className="mb-3">
                <label className="form-label">Açıklama</label>
                <textarea className="form-control" name="description" 
                          value={editedProperty.description} onChange={handleChange} rows="3" />
              </div>
            </div>
          )}

          {property.ownerName && (
            <p className="owner-info"><strong>Mülk Sahibi:</strong> {property.ownerName}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;