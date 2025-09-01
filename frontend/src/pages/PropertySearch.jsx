import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PropertyCard from '../components/PropertyCard';
import Select from 'react-select';
import { useAuth } from '../context/AuthContext';
import { propertyTypeMap, heatingTypeMap, statusTypeMap, numberOfRoomsMap } from "../constants/propertyEnums";

const PropertySearch = () => {
    const { user } = useAuth();
    const token = user?.token;

    const [allProperties, setAllProperties] = useState([]);
    const [searchParams, setSearchParams] = useState({
        propertyType: '',
        propertyStatus: '',
        minPrice: '',
        maxPrice: '',
        minArea: '',
        maxArea: '',
        numberOfRooms: '',
        floor: '',
        heatingType: '',
        address: '',
        sortBy: 'priceAsc'
    });

    const [filteredAndSortedProperties, setFilteredAndSortedProperties] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:8080/api/properties', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            setAllProperties(response.data);
            setLoading(false);
        })
        .catch(error => {
            console.error('There was an error fetching all properties!', error);
            setLoading(false);
        });
    }, [token]);

    useEffect(() => {
        let tempProperties = [...allProperties];

        tempProperties = tempProperties.filter(property => {
            const { propertyType, propertyStatus, minPrice, maxPrice, minArea, maxArea, numberOfRooms, floor, heatingType, address } = searchParams;

            if (minPrice && (property.price < parseFloat(minPrice))) return false;
            if (maxPrice && (property.price > parseFloat(maxPrice))) return false;
            if (minArea && (property.area < parseFloat(minArea))) return false;
            if (maxArea && (property.area > parseFloat(maxArea))) return false;

            if (floor && (property.floor !== parseInt(floor) || isNaN(floor))) return false;

            if (propertyType && property.propertyType !== propertyType) return false;
            if (propertyStatus && property.propertyStatus !== propertyStatus) return false;
            if (heatingType && property.heatingType !== heatingType) return false;
            if (numberOfRooms && property.numberOfRooms !== numberOfRooms) return false;

            if (address) {
                if (property.address === null) return false;
                if (!property.address.toLowerCase().includes(address.toLowerCase())) return false;
            }

            return true;
        });

        if (searchParams.sortBy === 'priceAsc') {
            tempProperties.sort((a, b) => a.price - b.price);
        } else if (searchParams.sortBy === 'priceDesc') {
            tempProperties.sort((a, b) => b.price - a.price);
        }

        setFilteredAndSortedProperties(tempProperties);
    }, [searchParams, allProperties]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newValue = parseFloat(value);
        if (newValue < 0) {
            return;
        }
        setSearchParams({ ...searchParams, [name]: value });
    };

    const handleSortChange = (e) => {
        const { value } = e.target;
        setSearchParams({ ...searchParams, sortBy: value });
    };

    if (loading) {
        return <p className="text-center mt-5">Yükleniyor...</p>;
    }

    return (
        <div className="mt-4 mx-5">
            <div className="row">
                <div className="col-md-2" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                    <form>
                        <div className="mb-3">
                            <label className="form-label">Emlak Durumu</label>
                            <select className="form-select" name="propertyStatus" value={searchParams.propertyStatus} onChange={handleChange}>
                                <option value="">Tümü</option>
                                {Object.keys(statusTypeMap).map(type => (
                                    <option key={type} value={type}>{statusTypeMap[type]}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Emlak Türü</label>
                            <select className="form-select" name="propertyType" value={searchParams.propertyType} onChange={handleChange}>
                                <option value="">Tümü</option>
                                {Object.keys(propertyTypeMap).map(type => (
                                    <option key={type} value={type}>{propertyTypeMap[type.replace(/_/g, ' ')]}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Adres</label>
                            <input type="text" className="form-control" name="address" value={searchParams.address} onChange={handleChange} />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Isıtma Türü</label>
                            <select className="form-select" name="heatingType" value={searchParams.heatingType} onChange={handleChange}>
                                <option value="">Tümü</option>
                                {Object.keys(heatingTypeMap).map(type => (
                                    <option key={type} value={type}>{heatingTypeMap[type]}</option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Oda Sayısı</label>
                            <Select
                                value={numberOfRoomsMap.find(opt => opt.value === searchParams.numberOfRooms)}
                                onChange={(selected) =>
                                    setSearchParams({ ...searchParams, numberOfRooms: selected?.value || '' })
                                }
                                options={numberOfRoomsMap}
                                placeholder="Tümü"
                                isClearable
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Kat</label>
                            <input type="number" className="form-control" name="floor" value={searchParams.floor} onChange={handleChange} min="0" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Min Fiyat</label>
                            <input type="number" className="form-control" name="minPrice" value={searchParams.minPrice} onChange={handleChange} min="0" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Max Fiyat</label>
                            <input type="number" className="form-control" name="maxPrice" value={searchParams.maxPrice} onChange={handleChange} min="0" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Min Alan (m²)</label>
                            <input type="number" className="form-control" name="minArea" value={searchParams.minArea} onChange={handleChange} min="0" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Max Alan (m²)</label>
                            <input type="number" className="form-control" name="maxArea" value={searchParams.maxArea} onChange={handleChange} min="0" />
                        </div>
                    </form>
                </div>

                <div className="col-md-10">
                    <div className="mb-3 text-end">
                        <select
                            className="form-select form-select-sm w-auto d-inline-block"
                            name="sortBy"
                            value={searchParams.sortBy}
                            onChange={handleSortChange}
                        >
                            <option value="priceAsc">Fiyata Göre (En Düşük)</option>
                            <option value="priceDesc">Fiyata Göre (En Yüksek)</option>
                        </select>
                    </div>

                    <hr className="d-md-none" />
                    <div className="row">
                        {filteredAndSortedProperties.length > 0 ? (
                            filteredAndSortedProperties.map(property => (
                                <div className="col-md-6 col-lg-4 mb-4" key={property.id}>
                                    <PropertyCard property={property} />
                                </div>
                            ))
                        ) : (
                            <p className="text-center">Arama sonucunda emlak bulunamadı.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertySearch;