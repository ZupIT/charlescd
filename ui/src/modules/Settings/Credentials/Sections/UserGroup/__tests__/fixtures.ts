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