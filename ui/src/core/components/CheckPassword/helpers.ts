export const checkPoints = [
  {
    name: 'Uppercase',
    rule: (pass = '') => new RegExp(/[A-Z]/).test(pass),
    message: 'must have at least one uppercase character'
  },
  {
    name: 'Lowercase',
    rule: (pass = '') => new RegExp(/[a-z]/).test(pass),
    message: 'must have at least one lowercase character'
  },
  {
    name: 'Numbers',
    rule: (pass = '') => new RegExp(/[0-9]/).test(pass),
    message: 'must have at least one number'
  },
  {
    name: 'Special Character',
    rule: (pass = '') => new RegExp(/[!@#$%^&*(),.?":{}|<>]/).test(pass),
    message: 'must have at least one special character'
  },
  {
    name: '10 characters',
    rule: (pass = '') => pass?.length >= 10,
    message: 'must be at least 10 characters'
  },
  {
    name: 'Confirm password',
    rule: (pass = '', confirm = '') => pass !== '' && confirm === pass,
    message: 'Passwords do not match'
  }
];
