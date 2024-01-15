import { DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } from "../configuration";

export const databaseConnection = {
  url: `mongodb://${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
