const rootUser = {
  id: 'a7c3e4b6-4qe3-4d62-8140-e2d23274d03f',
  name: 'User',
  email: 'user@zup.com.br',
  photoUrl:
    'https://i.pinimg.com/originals/51/f6/fb/51f6fb256629fc755b8870c801092942.png',
  createdAt: '2020-04-30 17:10:52',
  workspaces: [
    {
      id: 'efbf25e0-c4dc-46c5-9fe4-61eb24049ac7',
      name: 'QA Workspace'
    },
    {
      id: 'af15356b-a85d-451b-813a-83953e4b7f56',
      name: 'CharlesCD'
    }
  ],
  isRoot: true
};

const users = {
  content: [
    {
      id: 'c7e6dete-aa7a-4216-be1b-34eacd4c2915',
      name: 'User 1',
      email: 'user.1@zup.com.br',
      photoUrl:
        'https://www.pavilionweb.com/wp-content/uploads/2017/03/man-300x300.png',
      createdAt: '2020-05-07 20:24:46',
      workspaces: [],
      isRoot: true
    },
    {
      id: 'a7c3e4b6-4be3-4d62-8140-e2d23214e03f',
      name: 'User 2',
      email: 'user.2@zup.com.br',
      photoUrl: '',
      createdAt: '2020-04-30 17:10:52',
      workspaces: [],
      isRoot: true
    },
    {
      id: '13ea193b-f9d2-4wed-b1ce-471a7ae871c2',
      name: 'User 3',
      email: 'user.3@zup.com.br',
      photoUrl: '',
      createdAusuariot: '2020-05-19 17:48:47',
      workspaces: [
        { id: 'efbf25e0-c4dc-46c5-9fe4-61eb24049ac7', name: 'New Workspace 1' },
        { id: '034d2225-d7b2-499e-96e2-53cac99ff405', name: 'New Workspace 3' }
      ],
      isRoot: false
    },
    {
      id: '8b81e7a7-33f1-46cb-aedf-73222bf8769f',
      name: 'User 4',
      email: 'user.4@zup.com.br',
      photoUrl: '',
      createdAt: '2020-05-13 21:50:28',
      workspaces: [],
      isRoot: false
    },
    {
      id: 'd3123d52-b59u-4ee9-9f8f-8bf42c00dd45',
      name: 'User 5',
      email: 'user.5@zup.com.br',
      photoUrl: '',
      createdAt: '2020-05-13 18:02:03',
      workspaces: [
        { id: 'd90fd814-5e33-43c6-ba2d-d9d04c5a5ec6', name: 'New Workspace 4' }
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
  name: 'New User',
  email: 'new.user@zup.com.br',
  photoUrl: '',
  password: '123mudar',
  isRoot: true
};

const updateProfile = {
  id: 'a7c3e4b6-4qe3-4d62-8140-e2d23274d03f',
  name: 'Updated User',
  email: 'user.updated@zup.com.br',
  photoUrl: ''
};

const defaultAuthorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTExMjM4MTEsImlhdCI6MTU5MTEyMDIxMSwianRpIjoiMDFkMjE1MTYtNDA5OS00MGNkLTg2ZWQtOWIzOWQwNjdlZjc1IiwiaXNzIjoiaHR0cHM6Ly9jaGFybGVzLmNvbS9hdXRoL3JlYWxtcy9kYXJ3aW4iLCJhdWQiOlsiZGFyd2luLWNsaWVudCIsImFjY291bnQiXSwic3ViIjoiMGVjODFlODEtNGMzZi00ZmRjLWI4ODYtMzM3YTBjMmQyNTUwIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZGFyd2luLWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiJiZWQwYjIzMy1mZTZkLTQ5YzAtOWQ5Mi1iMGI4MWQ2M2Q1M2QiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm9mZmxpbmVfYWNjZXNzIiwidW1hX2F1dGhvcml6YXRpb24iXX0sInJlc291cmNlX2FjY2VzcyI6eyJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJzY29wZSI6InByb2ZpbGUgZW1haWwiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNSb290IjpmYWxzZSwibmFtZSI6Ik10eiIsIndvcmtzcGFjZXMiOlt7ImlkIjoiNjI2N2Q4ZWItMzExYy00OTY0LWE3YWMtYzRjMWNhMTc4NzZhIiwicGVybWlzc2lvbnMiOlsiaHlwb3RoZXNpc193cml0ZSIsIm1vZHVsZXNfcmVhZCIsIm1vZHVsZXNfd3JpdGUiLCJjaXJjbGVzX3JlYWQiLCJtYWludGVuYW5jZV93cml0ZSIsImh5cG90aGVzaXNfcmVhZCIsImNpcmNsZXNfd3JpdGUiLCJkZXBsb3lfd3JpdGUiXX0seyJpZCI6IjIzNjk4NDdjLTk0ZjctNDNjOS04N2MyLTRmMDBjNzMyOTBlNyIsInBlcm1pc3Npb25zIjpbImh5cG90aGVzaXNfd3JpdGUiLCJtb2R1bGVzX3JlYWQiLCJtb2R1bGVzX3dyaXRlIiwiY2lyY2xlc19yZWFkIiwiaHlwb3RoZXNpc19yZWFkIiwiY2lyY2xlc193cml0ZSIsImRlcGxveV93cml0ZSJdfSx7ImlkIjoiYjUzZTA3YTQtOGIwZC00NDlkLTk4NWEtOTcwYTlhMGUwNTc2IiwicGVybWlzc2lvbnMiOlsiaHlwb3RoZXNpc193cml0ZSIsIm1vZHVsZXNfcmVhZCIsIm1vZHVsZXNfd3JpdGUiLCJjaXJjbGVzX3JlYWQiLCJoeXBvdGhlc2lzX3JlYWQiLCJjaXJjbGVzX3dyaXRlIiwiZGVwbG95X3dyaXRlIl19LHsiaWQiOiJhZjE1MzU2Yi1hODVkLTQ1MWItODEzYS04Mzk1M2U0YjdmNTYiLCJwZXJtaXNzaW9ucyI6WyJoeXBvdGhlc2lzX3dyaXRlIiwibW9kdWxlc19yZWFkIiwibW9kdWxlc193cml0ZSIsImNpcmNsZXNfcmVhZCIsIm1haW50ZW5hbmNlX3dyaXRlIiwiaHlwb3RoZXNpc19yZWFkIiwiY2lyY2xlc193cml0ZSIsImRlcGxveV93cml0ZSJdfSx7ImlkIjoiZWZiZjI1ZTAtYzRkYy00NmM1LTlmZTQtNjFlYjI0MDQ5YWM3IiwicGVybWlzc2lvbnMiOlsiaHlwb3RoZXNpc193cml0ZSIsIm1vZHVsZXNfcmVhZCIsIm1vZHVsZXNfd3JpdGUiLCJjaXJjbGVzX3JlYWQiLCJtYWludGVuYW5jZV93cml0ZSIsImh5cG90aGVzaXNfcmVhZCIsImNpcmNsZXNfd3JpdGUiLCJkZXBsb3lfd3JpdGUiXX1dLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJ1c2VyY2hhcmxlc0B6dXAuY29tLmJyIiwiZ2l2ZW5fbmFtZSI6Ik10eiIsImVtYWlsIjoidXNlcmNoYXJsZXNAenVwLmNvbS5iciJ9.RgJtnUHrg-h4C6xeb6KjXmQCxQyXz2QQ0SIJ9Eu1vzM`;

const rootAuthorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE1OTExMjY3MjEsImlhdCI6MTU5MTEyMzEyMSwianRpIjoiMzJkY2VjMGQtZGQ0Yi00YTgxLThkY2EtM2ZjMDljMGNiY2UwIiwiaXNzIjoiaHR0cHM6Ly9jaGFybGVzLmNvbS9hdXRoL3JlYWxtcy9kYXJ3aW4iLCJhdWQiOlsiZGFyd2luLWNsaWVudCIsImFjY291bnQiXSwic3ViIjoiMmU2MjNjMTYtM2UwNy00MDhiLTg4NzAtNDhiOTFkNmZkNjk5IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZGFyd2luLWNsaWVudCIsInNlc3Npb25fc3RhdGUiOiIzNzgxMzgzYS0xZjhhLTRkZDEtYmUwMC1lZjZiYjkwZWMwYTYiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbIioiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbIm1vb3ZlX3JlYWQiLCJjb25maWdfd3JpdGUiLCJhZG1pbiIsImNpcmNsZV9yZWFkIiwiY2lyY2xlX3dyaXRlIiwibW9kdWxlX3JlYWQiLCJidWlsZF9yZWFkIiwiZGVwbG95X3JlYWQiLCJkZXBsb3lfd3JpdGUiLCJidWlsZF93cml0ZSIsIm9mZmxpbmVfYWNjZXNzIiwiY29uZmlnX3JlYWQiLCJtb2R1bGVfd3JpdGUiLCJ1bWFfYXV0aG9yaXphdGlvbiIsIm1vb3ZlX3dyaXRlIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJwcm9maWxlIGVtYWlsIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzUm9vdCI6dHJ1ZSwibmFtZSI6ImRhcndpbmFkbWluIiwid29ya3NwYWNlcyI6W3siaWQiOiJlNmZlYTNkMC1iNWNiLTQ5MjAtOGM2Ny1kM2M2NzgwMTJmNGIiLCJwZXJtaXNzaW9ucyI6WyJtYWludGVuYW5jZV93cml0ZSIsImNpcmNsZXNfd3JpdGUiLCJtb2R1bGVzX3dyaXRlIiwiaHlwb3RoZXNpc19yZWFkIl19LHsiaWQiOiIwYmM5ODY1My05NGRjLTQ5NGEtYmRmZi05ZDE3ZDQxMjdjODYiLCJwZXJtaXNzaW9ucyI6WyJoeXBvdGhlc2lzX3dyaXRlIiwibW9kdWxlc19yZWFkIiwibW9kdWxlc193cml0ZSIsImNpcmNsZXNfcmVhZCIsImh5cG90aGVzaXNfcmVhZCIsImNpcmNsZXNfd3JpdGUiLCJkZXBsb3lfd3JpdGUiXX0seyJpZCI6IjBmMDU0ZDIxLTNmMzgtNDc1ZC05N2U5LTM4Y2M5OWVjMTExOCIsInBlcm1pc3Npb25zIjpbImh5cG90aGVzaXNfd3JpdGUiLCJtb2R1bGVzX3JlYWQiLCJtb2R1bGVzX3dyaXRlIiwiY2lyY2xlc19yZWFkIiwibWFpbnRlbmFuY2Vfd3JpdGUiLCJoeXBvdGhlc2lzX3JlYWQiLCJjaXJjbGVzX3dyaXRlIiwiZGVwbG95X3dyaXRlIl19LHsiaWQiOiI1NTY2NzRhMi0wODBiLTQzNGQtYjE4My04OTRkNTVhNjBmNjAiLCJwZXJtaXNzaW9ucyI6WyJoeXBvdGhlc2lzX3dyaXRlIiwibW9kdWxlc19yZWFkIiwibW9kdWxlc193cml0ZSIsImNpcmNsZXNfcmVhZCIsIm1haW50ZW5hbmNlX3dyaXRlIiwiaHlwb3RoZXNpc19yZWFkIiwiY2lyY2xlc193cml0ZSIsImRlcGxveV93cml0ZSJdfV0sInByZWZlcnJlZF91c2VybmFtZSI6ImRhcndpbmFkbWluQHp1cC5jb20uYnIiLCJnaXZlbl9uYW1lIjoiZGFyd2luYWRtaW4iLCJlbWFpbCI6ImRhcndpbmFkbWluQHp1cC5jb20uYnIifQ._QAMEpQI4W8hv3xcLujrFxswoAtKcOODT8t4xUzN-n0`;

export default {
  rootUser,
  users,
  newUser,
  updateProfile,
  defaultAuthorization,
  rootAuthorization
};
