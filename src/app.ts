import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connect, set, disconnect } from "mongoose";
import { NODE_ENV, PORT } from "./core/configuration";
import { databaseConnection } from "./core/database";
import { IRoute } from "./core/interfaces/routes.interface";
import { errorMiddleware } from "./core/middlewares/error.middleware";
import { notFoundMiddleware } from "./core/middlewares/not_found.middleware";

export class App {
  public app: express.Application;
  public env: string;
  public port: string | number;

  constructor(routes: IRoute[]) {
    this.app = express();
    this.env = NODE_ENV!;
    this.port = PORT!;

    this.connectToDatabase();
    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    return this.app.listen(this.port, () => {
      console.log(`🚀 Server is running at: http://localhost:${this.port}`);
    });
  }

  public async closeDatabaseConnection(): Promise<void> {
    // istanbul ignore next
    disconnect().then(() => {});
  }

  private async connectToDatabase() {
    if (this.env === "development") set("debug", true);
    else set("debug", false);

    await connect(databaseConnection.url);
  }
  private initializeMiddlewares() {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes(routes: IRoute[]) {
    routes.forEach((route) => {
      this.app.use("/", route.router);
    });

    this.app.all("*", notFoundMiddleware);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}
