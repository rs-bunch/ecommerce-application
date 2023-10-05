import { validateEmail } from '../utils/validation/validateEmail';

describe('Testing validateEmail', () => {
  it('Test emty string', () => {
    const email = '';
    expect(validateEmail(email)).toEqual('');
  });
  it('Test NOT start and end witespaces', () => {
    const email = ' email@domain.com ';
    expect(validateEmail(email)).toEqual('Must NOT start and end witespaces');
  });
  it('Test contain `@` symbol', () => {
    const email = 'emaildomain.com';
    expect(validateEmail(email)).toEqual(`Email address must contain '@' symbol.`);
  });
  it('Test contain local part and domain', () => {
    const email = 'email@';
    expect(validateEmail(email)).toEqual(`Email address must contain local part and domain.`);
  });
  it('Test ', () => {
    const email = 'email@domaincom';
    expect(validateEmail(email)).toEqual(`Email address domain must contain a period.`);
  });
  it('Test ', () => {
    const email = 'email@domain!.com';
    expect(validateEmail(email)).toEqual(`Must include a domain name`);
  });
});
