import { DB_HOST, DB_PORT, DB_DATABASE, NODE_ENV, DB_USER, DB_PASSWORD } from '@config';

export const dbConnection = {
  url:
    NODE_ENV === 'production'
      ? `mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`
      : `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    authSource: 'admin',
  },
};
