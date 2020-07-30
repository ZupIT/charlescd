export const circlesHistory = {
  summary: {
    active: 10,
    inactive: 10
  },
  page: {
    content: [
      {
        id: 'abc-123',
        status: 'ACTIVE',
        name: 'Circle A',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      },
      {
        id: 'abc-1234',
        status: 'ACTIVE',
        name: 'Circle A',
        lastUpdatedAt: '2020-07-12 10:25:38',
        lifeTime: 345465
      }
    ],
    page: 0,
    size: 1,
    isLast: false,
    totalPages: 1
  }
};

export const releaseComponentsMock = [
  {
    moduleName: 'module a1',
    name: 'component a1',
    version: '1.0'
  },
  {
    moduleName: 'module a2',
    name: 'component a2',
    version: '1.0'
  }
]

export const circleReleaseMock = {
  id: '1',
  tag: 'release 1',
  deployedAt: '2020-07-12 19:10:26',
  undeployedAt: '2020-07-11 19:10:26',
  authorName: 'Jhon Doe',
  components: releaseComponentsMock
}

export const circlesReleasesMock = {
  content: [
    circleReleaseMock,
    {...circleReleaseMock, id: '2', tag: 'release 2'}
  ],
  page: 0,
  size: 1,
  last: false,
  totalPages: 1
};
