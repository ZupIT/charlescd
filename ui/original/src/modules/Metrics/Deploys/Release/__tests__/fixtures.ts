export const releaseComponentsMock = [
  {
    moduleName: 'module a1',
    name: 'component a1',
    version: '1'
  },
  {
    moduleName: 'module a2',
    name: 'component a2',
    version: '2'
  }
]

export const ReleaseContentMock = {
  id: '1',
  deployedAt: '2020-07-12 19:10:26',
  undeployedAt: '2020-07-11 19:10:26',
  authorName: 'Jhon Doe',
  circleName: 'circle 1',
  tag: 'release 1',
  status: 'DEPLOYED',
  deployDuration: 73,
  components: releaseComponentsMock
}

export const ReleaseSummary = {
  deployed: 1,
  deploying: 2,
  failed: 3,
  undeploying: 4,
  notDeployed: 5
}

export const ReleasesMock = {
  summary: ReleaseSummary,
  page: {
    content: [ReleaseContentMock],
    page: 0,
    size: 1,
    last: false,
    totalPages: 1
  }
  
};

export const filter = {
  period: 'ONW_WEEK'
};
