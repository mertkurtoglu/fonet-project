// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation (Turkish format)
export const validatePhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;
  return phoneRegex.test(phoneNumber.replace(/\s/g, ''));
};

// Required field validation
export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

// Minimum length validation
export const validateMinLength = (value, minLength) => {
  return value && value.toString().length >= minLength;
};

// Maximum length validation
export const validateMaxLength = (value, maxLength) => {
  return value && value.toString().length <= maxLength;
};

// Number validation
export const validateNumber = (value) => {
  return !isNaN(value) && isFinite(value);
};

// Price validation
export const validatePrice = (price) => {
  return validateNumber(price) && parseFloat(price) > 0;
};

// Area validation
export const validateArea = (area) => {
  return validateNumber(area) && parseFloat(area) > 0;
};

// Form validation helper
export const validateForm = (formData, validationRules) => {
  const errors = {};
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field];
    const rules = validationRules[field];
    
    rules.forEach(rule => {
      const { type, message, ...params } = rule;
      
      let isValid = true;
      
      switch (type) {
        case 'required':
          isValid = validateRequired(value);
          break;
        case 'email':
          isValid = validateEmail(value);
          break;
        case 'password':
          isValid = validatePassword(value);
          break;
        case 'phone':
          isValid = validatePhoneNumber(value);
          break;
        case 'minLength':
          isValid = validateMinLength(value, params.length);
          break;
        case 'maxLength':
          isValid = validateMaxLength(value, params.length);
          break;
        case 'number':
          isValid = validateNumber(value);
          break;
        case 'price':
          isValid = validatePrice(value);
          break;
        case 'area':
          isValid = validateArea(value);
          break;
        default:
          break;
      }
      
      if (!isValid && !errors[field]) {
        errors[field] = message;
      }
    });
  });
  
  return errors;
};
