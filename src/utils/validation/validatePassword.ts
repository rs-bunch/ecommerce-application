export function validatePassword(passwordInput: string): string {
  const password = passwordInput;

  if (password === '') {
    return '';
  }

  // Check password length
  if (password.length < 8) {
    return 'Password must be at least 8 characters long.';
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }

  // Check for at least one digit
  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one digit.';
  }

  // Check for at least one special character
  if (!/[!@#$%^&*]/.test(password)) {
    return 'Password must contain at least one special character (!@#$%^&*).';
  }

  // Check for leading/trailing whitespace
  if (password !== password.trim()) {
    return 'Password must not contain leading or trailing whitespace.';
  }

  return '';
}
