// Advanced Validation utilities for feedback forms - Main project standards

/**
 * Validates if a name contains only letters and spaces
 * Min 4 chars, Max 20 chars, No special chars, No numbers
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required' };
  }
  
  const trimmedName = name.trim();
  
  // Check length (minimum 4 characters, maximum 20 characters)
  if (trimmedName.length < 4) {
    return { isValid: false, error: 'Name must be at least 4 characters long' };
  }
  
  if (trimmedName.length > 20) {
    return { isValid: false, error: 'Name must not exceed 20 characters' };
  }
  
  // Only allow letters (a-z, A-Z) and spaces - No special chars, No numbers
  const nameRegex = /^[a-zA-Z\s]+$/;
  if (!nameRegex.test(trimmedName)) {
    // Check for numbers specifically
    if (/\d/.test(trimmedName)) {
      return { isValid: false, error: 'Numbers are not allowed in name' };
    }
    // Check for special characters
    if (/[^a-zA-Z\s]/.test(trimmedName)) {
      return { isValid: false, error: 'Only letters and spaces are allowed' };
    }
  }
  
  // Check for consecutive spaces
  if (/\s{2,}/.test(trimmedName)) {
    return { isValid: false, error: 'Multiple consecutive spaces not allowed' };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Real-time name input filtering (removes invalid chars while typing)
 */
export const filterNameInput = (input) => {
  if (!input) return '';
  
  // Remove numbers and special characters, keep only letters and spaces
  let filtered = input
    .replace(/[^a-zA-Z\s]/g, '') // Remove everything except letters and spaces
    .replace(/^\s+/, '') // Remove leading spaces (prevent space at start)
    .replace(/\s+/g, ' '); // Replace multiple spaces with single space
  
  // Real-time capitalization while typing
  filtered = filtered
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
  
  return filtered;
};

/**
 * Formats name: First letter capital, rest small, after space again capital
 * Example: "ashUtosh kuMAr" → "Ashutosh Kumar"
 */
export const formatName = (name) => {
  if (!name) return '';
  
  return name
    .trim()
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .split(' ')
    .map(word => {
      if (word.length === 0) return '';
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
};

/**
 * Advanced Mobile validation for Indian numbers (10 digits, starts with 6-9)
 */
export const isValidIndianMobile = (mobile) => {
  if (!mobile) return false;
  const cleaned = mobile.replace(/\D/g, '');
  return cleaned.length === 10 && /^[6-9]/.test(cleaned);
};

/**
 * Get mobile validation error with detailed messages
 */
export const getMobileValidationError = (mobile, checkRequired = false) => {
  if (!mobile || !mobile.trim()) {
    return checkRequired ? 'Mobile number is required' : '';
  }
  
  const digits = mobile.replace(/\D/g, '');
  
  if (digits.length === 0) {
    return 'Please enter a valid mobile number';
  }
  
  if (digits.length < 10) {
    return 'Mobile number must be 10 digits';
  }
  
  if (digits.length > 10) {
    return 'Mobile number cannot exceed 10 digits';
  }
  
  if (!/^[6-9]/.test(digits)) {
    return 'Mobile number must start with 6, 7, 8, or 9';
  }
  
  return '';
};

/**
 * Real-time mobile number formatting (removes non-digits, max 10)
 */
export const getNormalizedMobile = (mobile) => {
  if (!mobile) return '';
  
  // Return only digits, max 10
  const digits = mobile.replace(/\D/g, '');
  return digits.slice(0, 10);
};

/**
 * Advanced Email validation with detailed rules
 */
export const isValidEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // Disallow spaces in email
  if (trimmedEmail.includes(' ')) {
    return false;
  }
  
  // Check length constraints (5 to 254 chars as per RFC 5321)
  if (trimmedEmail.length < 5 || trimmedEmail.length > 254) {
    return false;
  }
  
  // Comprehensive email regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return false;
  }
  
  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return false;
  }
  
  // Split email into local and domain parts
  const emailParts = trimmedEmail.split('@');
  if (emailParts.length !== 2) return false;
  
  const [localPart, domainPart] = emailParts;
  
  // Check local part (before @) - max 64 chars
  if (localPart.length === 0 || localPart.length > 64) {
    return false;
  }
  
  // Check domain part (after @) - max 253 chars
  if (domainPart.length === 0 || domainPart.length > 253) {
    return false;
  }
  
  // Check if starts or ends with dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return false;
  }
  
  // Check domain has at least one dot
  if (!domainPart.includes('.')) {
    return false;
  }
  
  return true;
};

/**
 * Get email validation error with detailed messages
 */
export const getEmailValidationError = (email, checkRequired = false) => {
  if (!email || !email.trim()) {
    return checkRequired ? 'Email is required' : '';
  }
  
  const trimmedEmail = email.trim().toLowerCase();
  
  // Disallow spaces in email
  if (trimmedEmail.includes(' ')) {
    return 'Email cannot contain spaces';
  }
  
  // Length validations
  if (trimmedEmail.length < 5) {
    return 'Email is too short (minimum 5 characters)';
  }
  
  if (trimmedEmail.length > 254) {
    return 'Email is too long (maximum 254 characters)';
  }
  
  // Basic format check
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(trimmedEmail)) {
    return 'Please enter a valid email address';
  }
  
  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return 'Consecutive dots are not allowed in email';
  }
  
  const emailParts = trimmedEmail.split('@');
  if (emailParts.length !== 2) {
    return 'Email must contain exactly one @ symbol';
  }
  
  const [localPart, domainPart] = emailParts;
  
  // Check local part constraints
  if (localPart.length > 64) {
    return 'Email local part (before @) is too long';
  }
  
  // Check if starts or ends with dot
  if (localPart.startsWith('.') || localPart.endsWith('.')) {
    return 'Email cannot start or end with a dot';
  }
  
  // Check domain has proper format
  if (!domainPart.includes('.') || domainPart.length < 3) {
    return 'Please enter a valid domain name';
  }
  
  return '';
};

/**
 * Comprehensive validation for form fields with advanced error handling
 */
export const validateFormField = (fieldName, value, fieldType = 'text') => {
  const errors = [];
  
  switch (fieldType) {
    case 'name':
      const nameValidation = validateName(value);
      if (!nameValidation.isValid) {
        errors.push(nameValidation.error);
      }
      break;
      
    case 'email':
      const emailError = getEmailValidationError(value, true);
      if (emailError) {
        errors.push(emailError);
      }
      break;
      
    case 'phone':
      const phoneError = getMobileValidationError(value, true);
      if (phoneError) {
        errors.push(phoneError);
      }
      break;
      
    case 'required':
      if (!value?.trim()) {
        errors.push(`${fieldName} is required`);
      }
      break;
      
    default:
      if (!value?.trim()) {
        errors.push(`${fieldName} is required`);
      }
  }
  
  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

/**
 * Advanced input handler with real-time formatting and validation
 */
export const handleAdvancedInput = (value, fieldType, onChange, setError) => {
  let processedValue = value;
  let errorMessage = '';
  
  switch (fieldType) {
    case 'name':
      // Real-time filtering and formatting
      processedValue = filterNameInput(value);
      const nameValidation = validateName(processedValue);
      if (!nameValidation.isValid && processedValue.length > 0) {
        errorMessage = nameValidation.error;
      }
      break;
      
    case 'phone':
      // Real-time mobile formatting
      processedValue = getNormalizedMobile(value);
      const phoneError = getMobileValidationError(processedValue, false);
      if (phoneError) {
        errorMessage = phoneError;
      }
      break;
      
    case 'email':
      // Email formatting (trim and lowercase)
      processedValue = value.trim().toLowerCase();
      const emailError = getEmailValidationError(processedValue, false);
      if (emailError) {
        errorMessage = emailError;
      }
      break;
      
    default:
      processedValue = value;
      break;
  }
  
  // Update value
  onChange(processedValue);
  
  // Update error
  if (setError) {
    setError(errorMessage);
  }
  
  return { value: processedValue, error: errorMessage };
};