const postgresqlOptions = {
  type: 'postgres',
  host: 'localhost',
  port: '5432',
  username: 'darwin',
  password: 'darwin',
  database: 'darwin',
  entities: ['src/**/*.entity.ts'],
  synchronize: true
}

export const databasesConfig = {
  postgresqlOptions
}
