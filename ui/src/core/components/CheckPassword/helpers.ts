export const checkPoints = [
  {
    name: 'Uppercase',
    rule: (pass = '') => new RegExp(/[A-Z]/).test(pass)
  },
  {
    name: 'Lowercase',
    rule: (pass = '') => new RegExp(/[a-z]/).test(pass)
  },
  {
    name: 'Numbers',
    rule: (pass = '') => new RegExp(/[0-9]/).test(pass)
  },
  {
    name: 'Special Character',
    rule: (pass = '') => new RegExp(/[!@#$%^&*(),.?":{}|<>]/).test(pass)
  },
  {
    name: '10 characters',
    rule: (pass = '') => pass?.length >= 10
  },
  {
    name: 'Confirm password',
    rule: (pass = '', confirm = '') => pass !== '' && confirm === pass
  }
];
