const modules = {
  content: [
    {
      id: "4d1cf7a9-d2f5-43b0-852e-e1b583b71c58",
      name: "Module 1",
      gitRepositoryAddress: "git-address-2",
      helmRepository: "helm-repository-1",
      createdAt: "2019-09-13 21:22:05",
      author: {
        id: "c7e6dete-aa7a-4216-be1b-34eacd4c2915",
        name: "User 1",
        email: "user.1@zup.com.br",
        photoUrl:
          "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png"
      },
      components: [
        {
          id: "89f59qf1-5cea-1c24-ac2f-fe719cdasd8f",
          name: "Module Component 1",
          latencyThreshold: "4.2",
          errorThreshold: "0.6"
        }
      ]
    },
    {
      id: "41e218b5-1005-4f7c-9e02-f542we9e03f1",
      name: "Module 2",
      gitRepositoryAddress: "git-address-2",
      helmRepository: "",
      createdAt: "2019-10-08 13:19:03",
      author: {
        id: "8b81e7a7-33f1-46cb-aedf-73222bf8769f",
        name: "User 4",
        email: "user.4@zup.com.br",
        photoUrl: ""
      },
      components: [
        {
          id: "2060a5f6-62bq-056a-8c6a-1bf0a1bf07a5",
          name: "Module Component 2",
          latencyThreshold: "3.2",
          errorThreshold: "0.1"
        }
      ]
    },
    {
      id: "be6ga24r2-9008-4d13-8966-09715ebba8f",
      name: "Module 3",
      gitRepositoryAddress: "git-address-3",
      helmRepository: "helm-repository-2",
      createdAt: "2019-09-30 21:36:56",
      author: {
        id: "d3123d52-b59u-4ee9-9f8f-8bf42c00dd45",
        name: "User 5",
        email: "user.5@zup.com.br",
        photoUrl: ""
      },
      components: [
        {
          id: "6ehwa5f6-62bq-056a-8c6a-1bfiw2bf07a8",
          name: "Module Component 3",
          latencyThreshold: "8.0",
          errorThreshold: "1.1"
        }
      ]
    }
  ],
  page: 0,
  size: 3,
  totalPages: 1,
  last: true
};

const defaultModule = {
  id: "4er318b5-1005-4f7c-9e02-1113be9w03f0",
  name: "Module",
  gitRepositoryAddress: "git addres",
  helmRepository: "",
  createdAt: "2019-10-08 13:19:03",
  author: {
    id: "a7c3e4b6-4qe3-4d62-8140-e2d23274d03f",
    name: "User",
    email: "user@zup.com.br",
    photoUrl: ""
  },
  components: [
    {
      id: "2060a5f6-6fbc-455a-8c6a-1bf0a1bf07a5",
      name: "Module Component",
      latencyThreshold: "2.6",
      errorThreshold: "0.7"
    }
  ]
};

const newModule = {
  name: "New Module",
  authorId: "a7c3e4b6-4qe3-4d62-8140-e2d23274d03f",
  gitRepositoryAddress: "git addres",
  helmRepository: "helm-repository",
  components: [
    {
      name: "New Module Component",
      latencyThreshold: "2.9",
      errorThreshold: "1.3"
    }
  ]
};

const updateModule = {
  name: "Update Module",
  authorId: "a7c31qs6-4qe3-4d62-8140-e2d2327yhe3f",
  gitRepositoryAddress: "update-git-addres",
  helmRepository: "update-helm-repository",
  components: [
    {
      name: "Update Module Component",
      latencyThreshold: "4.1",
      errorThreshold: "5.0"
    }
  ]
};

const newComponent = {
  name: "New Module Component",
  latencyThreshold: "1.9",
  errorThreshold: "1.6"
};

const updateComponent = {
  name: "Update Module Component",
  latencyThreshold: "2.0",
  errorThreshold: "7.3"
};

module.exports = {
  modules,
  defaultModule,
  newModule,
  updateModule,
  newComponent,
  updateComponent
};
