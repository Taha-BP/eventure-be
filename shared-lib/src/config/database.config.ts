import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { ConfigService } from "@nestjs/config";

export const databaseConfig = (
  configService: ConfigService
): TypeOrmModuleOptions => ({
  type: "postgres" as const,
  host: configService.get<string>("DB_HOST"),
  port: configService.get<number>("DB_PORT"),
  username: configService.get<string>("DB_USERNAME"),
  password: configService.get<string>("DB_PASSWORD"),
  database: configService.get<string>("DB_NAME"),
  entities: [__dirname + "/../entities/*.entity{.ts,.js}"],
  synchronize: true,
  autoLoadEntities: true,
  logging: configService.get<string>("NODE_ENV") !== "production",
});
