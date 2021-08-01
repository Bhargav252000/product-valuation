import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
// typeorm module
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { AppController } from './app.controller';
import { AppService } from './app.service';

//Modules
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';

// Entity modules
import { User } from './users/users.entity';
import { Report } from './reports/reports.entity';
const cookieSession = require('cookie-session');

// imports for configuration
import { ConfigModule, ConfigService } from '@nestjs/config';

require('dotenv').config();

@Module({
  // configModule is used for .env using nest way
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'sqlite',
          database: config.get<string>('DB_NAME'),
          synchronize: true,
          entities: [User, Report],
        };
      },
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  //! configure is a method that will make the middleware globally available (means for every request it will be applied)
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [`${process.env.SESSION_KEY}`],
        }),
      )
      .forRoutes('*'); // means for every request
  }
}
