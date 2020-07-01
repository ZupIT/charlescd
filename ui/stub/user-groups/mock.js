const userGroups = {
  content: [
    {
      id: 'bf98232d-6784-419b-a737-cc4391430de9',
      name: 'User Group 1',
      author: {
        id: 'c7e6dete-aa7a-4216-be1b-34eacd4c2915',
        name: 'User 1',
        email: 'user.1@zup.com.br',
        photoUrl:
          'https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png',
        createdAt: '2020-05-07 20:24:46'
      },
      createdAt: '2020-04-16T14:09:41.599193',
      users: []
    },
    {
      id: 'e0564c7b-757f-4aaa-93c5-337415a67fc7',
      name: 'User Group 2',
      author: {
        id: 'd3123d52-b59u-4ee9-9f8f-8bf42c00dd45',
        name: 'User 5',
        email: 'user.5@zup.com.br',
        photoUrl: '',
        createdAt: '2020-05-13 18:02:03'
      },
      createdAt: '2020-04-15T20:49:47.048969',
      users: [
        {
          id: '13ea193b-f9d2-4wed-b1ce-471a7ae871c2',
          name: 'User 3',
          email: 'user.3@zup.com.br',
          photoUrl: '',
          createdAt: '2020-05-19 17:48:47'
        },
        {
          id: 'a7c3e4b6-4be3-4d62-8140-e2d23214e03f',
          name: 'User 2',
          email: 'user.2@zup.com.br',
          photoUrl: '',
          createdAt: '2020-04-30 17:10:52'
        }
      ]
    },
    {
      id: 'f0cda81f-a7cb-4036-938d-33cbb959cc4a',
      name: 'User Group 3',
      author: {
        id: '8b81e7a7-33f1-46cb-aedf-73222bf8769f',
        name: 'User 4',
        email: 'user.4@zup.com.br',
        photoUrl: '',
        createdAt: '2020-05-13 21:50:28'
      },
      createdAt: '2020-04-16T01:10:29.123966',
      users: []
    },
    {
      id: 'fad01026-870f-4616-a245-f8a753a9a4d7',
      name: 'User Group 4',
      author: {
        id: 'c7e6dete-aa7a-4216-be1b-34eacd4c2915',
        name: 'User 1',
        email: 'user.1@zup.com.br',
        photoUrl:
          'https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png',
        createdAt: '2020-05-07 20:24:46'
      },
      createdAt: '2020-04-16T13:29:13.880759',
      users: [
        {
          id: 'd3123d52-b59u-4ee9-9f8f-8bf42c00dd45',
          name: 'User 5',
          email: 'user.5@zup.com.br',
          photoUrl: '',
          createdAt: '2020-05-13 18:02:03'
        }
      ]
    }
  ],
  page: 0,
  size: 4,
  totalPages: 1,
  last: true
};

const userGroup = {
  id: 'bf98232d-6784-419b-a737-cc4391430de9',
  name: 'User Group',
  author: {
    id: 'a7c3e4b6-4qe3-4d62-8140-e2d23274d03f',
    name: 'User',
    email: 'user@zup.com.br',
    photoUrl: '',
    createdAt: '2020-04-30 17:10:52'
  },
  createdAt: '2020-04-16T14:09:41.599193',
  users: []
};

const createUserGroup = {
  id: 'bf98232d-6784-419b-a737-cc4391430de9',
  name: 'New User Group',
  author: {
    id: 'a7c3e4b6-4qe3-4d62-8140-e2d23274d03f',
    name: 'User',
    email: 'user@zup.com.br',
    photoUrl: '',
    createdAt: '2020-04-30 17:10:52'
  },
  createdAt: '2020-04-16T14:09:41.599193',
  users: []
};

const updateUserGroup = {
  id: 'bf98232d-6784-419b-a737-cc4391430de9',
  name: 'Update User Group',
  author: {
    id: 'd3123d52-b59u-4ee9-9f8f-8bf42c00dd45',
    name: 'User 5',
    email: 'user.5@zup.com.br',
    photoUrl: '',
    createdAt: '2020-05-13 18:02:03'
  },
  createdAt: '2020-04-16T14:09:41.599193',
  users: []
};

export default {
  userGroups,
  userGroup,
  createUserGroup,
  updateUserGroup
};
