/* eslint-disable no-undef */

module.exports =  {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DATABASE_NAME,
  migrationsTableName: 'darwin-deploy-migrations',
  migrations: ['dist/resources/migrations/*.js']
}
