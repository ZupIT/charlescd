const circleID = { "X-Circle-Id": "83cfca63-25a5-4626-a92b-a2efc4b7346a" };

const circles = {
  content: [
    {
      id: "f52eda57-5607-4306-te33-477eg398cc2a",
      name: "Circle 1",
      author: {
        id: "c7e6dete-aa7a-4216-be1b-34eacd4c2915",
        name: "User 1",
        email: "user.1@zup.com.br",
        photoUrl:
          "https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png",
        createdAt: "2020-05-07 20:24:46"
      },
      createdAt: "2019-09-17 17:56:11",
      rules: {
        type: "CLAUSE",
        clauses: [
          {
            type: "RULE",
            content: { key: "username", value: ["empty"], condition: "EQUAL" }
          }
        ],
        logicalOperator: "OR"
      },
      deployment: {
        id: "59d3d99c-7b48-42b2-9746-d14cyh448165",
        deployedAt: "2020-01-29 22:33:56",
        status: "DEPLOYED",
        tag: "deployment-1",
        artifacts: [
          {
            id: "932e362b-3be4s21a3-8420-a19h36ef6b81",
            artifact: "artifact 1",
            version: "artifact-1-version-1",
            componentName: "Module Component 1",
            moduleName: "Module 1"
          }
        ]
      }
    },
    {
      id: "883t35d8-dece-412f-9w25-f37h54e56fa5",
      name: "Circle 2",
      author: {
        id: "a7c3e4b6-4be3-4d62-8140-e2d23214e03f",
        name: "User 2",
        email: "user.2@zup.com.br",
        photoUrl: "",
        createdAt: "2020-04-30 17:10:52"
      },
      createdAt: "2020-01-28 22:21:30",
      rules: {
        type: "CLAUSE",
        clauses: [
          {
            type: "RULE",
            content: { key: "username", value: ["empty"], condition: "EQUAL" }
          }
        ],
        logicalOperator: "OR"
      },
      deployment: {
        id: "9a2ef386-80ed-471d-9607-807dc085122a",
        deployedAt: "2020-01-28 22:43:42",
        status: "DEPLOYED",
        tag: "deployment-2",
        artifacts: [
          {
            id: "89f59qf1-5cea-1c24-ac2f-fe719cdasd8f",
            artifact: "artifact 2",
            version: "artifact-2-version-1",
            createdAt: "2019-10-07 14:47:38",
            componentName: "Module Component 1",
            moduleName: "Module 1"
          },
          {
            id: "12se052f-ur45-421e-bd2d-348c54e4619f",
            artifact: "artifact 3",
            version: "artifact-3-version-1",
            createdAt: "2019-10-07 14:47:38",
            componentName: "Module Component 2",
            moduleName: "Module 2"
          },
          {
            id: "ewt5452f-2bfd-421e-bd2d-6uj554e4619f",
            artifact: "artifact 4",
            version: "artifact-4-version-1",
            createdAt: "2019-10-07 14:47:38",
            componentName: "Module Component 2",
            moduleName: "Module 2"
          },
          {
            id: "ercf052f-2bfd-421e-bd2d-648c54e4619f",
            artifact: "artifact 5",
            version: "artifact-2-version-1",
            createdAt: "2019-10-07 14:47:38",
            componentName: "Module Component 3",
            moduleName: "Module 3"
          }
        ]
      }
    },
    {
      id: "cay5h4a5-6278-45b5-ab15-a53e76tdbc3e",
      name: "Circle 3",
      author: {
        id: "8b81e7a7-33f1-46cb-aedf-73222bf8769f",
        name: "User 4",
        email: "user.4@zup.com.br",
        photoUrl: "",
        createdAt: "2020-05-13 21:50:28"
      },
      createdAt: "2020-01-29 19:44:05",
      rules: {
        type: "CLAUSE",
        clauses: [
          {
            type: "RULE",
            content: { key: "username", value: ["empty"], condition: "EQUAL" }
          }
        ],
        logicalOperator: "OR"
      },
      deployment: null
    }
  ],
  page: 0,
  size: 3,
  totalPages: 1,
  last: true
};

const circle = {
  id: "e3u7ye29-5a3b-4584-becf-238u63fbe276",
  name: "Circle",
  author: {
    id: "a7c3e4b6-4be3-4d62-8140-e2d23214e03f",
    name: "User 2",
    email: "user.2@zup.com.br",
    photoUrl: "",
    createdAt: "2020-04-30 17:10:52"
  },
  createdAt: "2019-12-23 17:38:22",
  rules: {
    type: "CLAUSE",
    clauses: [
      {
        type: "RULE",
        content: {
          key: "username",
          value: ["user.1@zup.com.br"],
          condition: "EQUAL"
        }
      }
    ],
    logicalOperator: "AND"
  },
  deployment: {
    id: "221w2ed9-36b9-42da-a898-9i8u8c1a7f93",
    deployedAt: "2020-01-15 13:09:43",
    status: "DEPLOYED",
    tag: "deployment-3",
    artifacts: [
      {
        id: "etgyd60f-cabb-4dfd-92ce-778u0d1474c3",
        artifact: "artifact 6",
        version: "artifact-6-version-1",
        createdAt: "2020-01-06 21:20:41",
        componentName: "Module Component 3",
        moduleName: "Module 3"
      }
    ]
  }
};

module.exports = {
  circleID,
  circles,
  circle
};
