import { validatePassword } from '../utils/validation/validatePassword';

describe('Testing validatePassword', () => {
  it('Test emty string', () => {
    const password = '';
    expect(validatePassword(password)).toEqual('');
  });
  it('Test at least 8 characters long', () => {
    const password = 'abcdef';
    expect(validatePassword(password)).toEqual('Password must be at least 8 characters long.');
  });
  it('Test at least one uppercase letter', () => {
    const password = 'abcdefgh';
    expect(validatePassword(password)).toEqual(`Password must contain at least one uppercase letter.`);
  });
  it('Test at least one lowercase letter', () => {
    const password = 'ABCDEFGH';
    expect(validatePassword(password)).toEqual(`Password must contain at least one lowercase letter.`);
  });
  it('Test at least one digit', () => {
    const password = 'ABCDefgh';
    expect(validatePassword(password)).toEqual(`Password must contain at least one digit.`);
  });
  it('Test at least one special character', () => {
    const password = 'ABCDefgh123';
    expect(validatePassword(password)).toEqual(`Password must contain at least one special character (!@#$%^&*).`);
  });
  it('Test not contain leading or trailing whitespace', () => {
    const password = ' ABCDefgh123@ ';
    expect(validatePassword(password)).toEqual(`Password must not contain leading or trailing whitespace.`);
  });
  it('Test all is correct', () => {
    const password = 'ABCDefgh123@';
    expect(validatePassword(password)).toEqual(``);
  });
});
