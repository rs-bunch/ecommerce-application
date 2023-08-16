export function validateEmail(emailInput: string): string {
  const email = emailInput.trim(); // Remove leading/trailing whitespace

  if (email === '') {
    return '';
  }

  // Check if email contains '@' symbol
  if (!email.includes('@')) {
    return "Email address must contain '@' symbol.";
  }

  // Split email into local part and domain
  const [localPart, domain] = email.split('@');

  // Check if both local part and domain are non-empty
  if (localPart.length === 0 || domain.length === 0) {
    return 'Email address must contain local part and domain.';
  }

  // Check if domain contains a period
  if (!domain.includes('.')) {
    return 'Email address domain must contain a period.';
  }

  return '';
}
