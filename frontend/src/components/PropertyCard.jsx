import { Link } from 'react-router-dom';
import React from 'react';
import { propertyTypeMap, numberOfRoomsMap, statusTypeMap} from "../constants/propertyEnums";
import { formatCurrency, formatArea, truncateText } from "../utils/formatters";
import '../styles/PropertyCard.css';

const PropertyCard = ({ property }) => {
    const propertyTypeLabel = propertyTypeMap[property.propertyType] || property.propertyType;
    const roomLabel = numberOfRoomsMap.find(r => r.value === property.numberOfRooms)?.label || property.numberOfRooms;

    return (
        <div className="property-card">
            {/* Image */}
            <div className="property-card__image">
                {property.imageUrls && property.imageUrls.length > 0 ? (
                    <img
                        src={property.imageUrls[0]}
                        alt={property.address}
                        className="property-card__image-img"
                    />
                ) : (
                    <div className="property-card__image-placeholder">
                        <span>Resim Yok</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="property-card__content">
                <h5 className="property-card__title">
                    {propertyTypeLabel} - {statusTypeMap[property.propertyStatus]}
                </h5>

                <div className="property-card__details">
                    <p className="property-card__detail">
                        <strong>Alan:</strong> {formatArea(property.area)}
                    </p>
                    <p className="property-card__detail">
                        <strong>Oda:</strong> {roomLabel}
                    </p>
                    <p className="property-card__detail property-card__address">
                        <strong>{truncateText(property.address, 50)}</strong>
                    </p>
                    <p className="property-card__price">
                        <strong>{formatCurrency(property.price)}</strong>
                    </p>
                </div>
                
                <Link to={`/property/${property.id}`} className="btn btn-primary property-card__button">
                    Detayları Gör
                </Link>
            </div>
        </div>
    );
};

export default PropertyCard;
