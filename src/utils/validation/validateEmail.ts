export function validateEmail(emailInput: string): string {
  const email = emailInput;

  if (email === '') {
    return '';
  }

  if (email !== email.trim()) {
    return 'Must NOT start and end witespaces';
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

  if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email)) {
    return 'Must include a domain name';
  }

  return '';
}
