import { Role, UserGroup } from "../interfaces";

export const UserGroups: UserGroup[] = [
  { id: '1', name: 'Maintainer' }
]

export const Roles: Role[] = [
  {
    id: "fake-maintainer",
    name: "Maintainer",
    description: "Can access and edit this workspace's settings. Can deploy. Can also create, edit and delet: circles, modules and hypotheses.",
    permissions: [
      {
        id: "fake-id",
        name: "fake-permission",
        createdAt: "2020-11-16 17:24:55"
      }
    ],
    createdAt: "2020-11-16 17:24:55"
  },
  {
    id: "fake-developer",
    name: "Developer",
    description: "fake-developer.",
    permissions: [
      {
        id: "fake-id",
        name: "fake-permission",
        createdAt: "2020-11-16 17:24:55"
      }
    ],
    createdAt: "2020-11-16 17:24:55"
  },
  {
    id: "fake-reader",
    name: "Reader",
    description: "fake-reader.",
    permissions: [
      {
        id: "fake-id",
        name: "fake-permission",
        createdAt: "2020-11-16 17:24:55"
      }
    ],
    createdAt: "2020-11-16 17:24:55"
  }
]

export const userGroups = [
  {
    id: '1',
    name: 'devx user group',
    users: [
      {
        id: '12',
        name: 'user 1',
        email: 'user1@gmail.com'
      }
    ]
  },
  {
    id: '2',
    name: 'metrics user group',
    users: [
      {
        id: '34',
        name: 'user 2',
        email: 'user2@gmail.com'
      }
    ]
  }
];

export const userGroup = [
  {
    id: '1',
    name: 'devx',
    users: [
      {
        id: '12',
        name: 'user 1',
        email: 'user1@gmail.com'
      }
    ]
  }
];