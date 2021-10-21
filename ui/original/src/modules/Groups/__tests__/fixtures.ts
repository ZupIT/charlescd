export const userGroupPagination = {
  content: [{
    id: '123',
    name: 'group 1',
    users: [{
      id: '123',
      name: 'Charles',
      email: 'charlescd@zup.com.br',
      photoUrl: 'https://charlescd.io',
      createdAt: '2020-01-01 12:00'
    }]
  }],
  page: 0,
  size: 0,
  totalPages: 0,
  last: true
};

export const userGroup = {
  id: '123',
  name: 'group 1',
  author: {
    id: '456',
    name: 'Charles',
    email: 'charlescd@zup.com.br',
    createdAt: '2020-01-01 12:00',
  },
  createdAt: '2020-01-01 12:00',
  users: [{
    id: '123',
    name: 'Charles',
    email: 'charlescd@zup.com.br',
    photoUrl: 'https://charlescd.io',
    createdAt: '2020-01-01 12:00'
  }]
};

export const users = {
  content: [{
    id: '123',
    name: 'Charles',
    email: 'charlescd@zup.com.br',
    photoUrl: 'https://charlescd.io',
    applications: [{
      id: '123',
      name: 'Application 1',
      menbersCount: 1
    }],
    createdAt: '2020-01-01 12:00'
  }],
  page: 0,
  size: 0,
  totalPages: 0,
  last: true
};