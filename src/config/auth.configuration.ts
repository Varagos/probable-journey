export interface AuthEnvironmentVariables {
  jwtSecret: string;
  database: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
  };
}

export default () => ({
  jwtSecret:
    process.env.JWT_SECRET ||
    (() => {
      throw new Error('JWT_SECRET is required');
    })(),
  database: {
    host: process.env.PG_HOST ?? 'localhost',
    port: process.env.PG_PORT ? +process.env.PG_PORT : 5432,
    user: process.env.PG_USER ?? 'user',
    password: process.env.PG_PASSWORD ?? 'postgres',
    database: process.env.PG_DATABASE ?? 'iam',
  },
});
