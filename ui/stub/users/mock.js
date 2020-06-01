const user = {
  id: "a7c3e4b6-4qe3-4d62-8140-e2d23274d03f",
  name: "User",
  email: "user@zup.com.br",
  photoUrl: "",
  createdAt: "2020-04-30 17:10:52",
  workspaces: [],
  isRoot: false
};

const users = {
  content: [
    {
      id: "c7e6dete-aa7a-4216-be1b-34eacd4c2915",
      name: "User 1",
      email: "user.1@zup.com.br",
      photoUrl:
        "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png",
      createdAt: "2020-05-07 20:24:46",
      workspaces: [],
      isRoot: true
    },
    {
      id: "a7c3e4b6-4be3-4d62-8140-e2d23214e03f",
      name: "User 2",
      email: "user.2@zup.com.br",
      photoUrl: "",
      createdAt: "2020-04-30 17:10:52",
      workspaces: [],
      isRoot: true
    },
    {
      id: "13ea193b-f9d2-4wed-b1ce-471a7ae871c2",
      name: "User 3",
      email: "user.3@zup.com.br",
      photoUrl: "",
      createdAusuariot: "2020-05-19 17:48:47",
      workspaces: [
        { id: "efbf25e0-c4dc-46c5-9fe4-61eb24049ac7", name: "New Workspace 1" },
        { id: "034d2225-d7b2-499e-96e2-53cac99ff405", name: "New Workspace 3" }
      ],
      isRoot: false
    },
    {
      id: "8b81e7a7-33f1-46cb-aedf-73222bf8769f",
      name: "User 4",
      email: "user.4@zup.com.br",
      photoUrl: "",
      createdAt: "2020-05-13 21:50:28",
      workspaces: [],
      isRoot: false
    },
    {
      id: "d3123d52-b59u-4ee9-9f8f-8bf42c00dd45",
      name: "User 5",
      email: "user.5@zup.com.br",
      photoUrl: "",
      createdAt: "2020-05-13 18:02:03",
      workspaces: [
        { id: "d90fd814-5e33-43c6-ba2d-d9d04c5a5ec6", name: "New Workspace 4" }
      ],
      isRoot: false
    }
  ],

  page: 0,
  size: 5,
  totalPages: 1,
  last: true
};

const newUser = {
  name: "New User",
  email: "new.user@zup.com.br",
  photoUrl: "",
  password: "123mudar",
  isRoot: true
};

const updateProfile = {
  id: "a7c3e4b6-4qe3-4d62-8140-e2d23274d03f",
  name: "Updated User",
  email: "user.updated@zup.com.br",
  photoUrl: ""
};

module.exports = {
  user,
  users,
  newUser,
  updateProfile
};
