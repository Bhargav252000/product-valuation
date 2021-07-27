import { Module } from '@nestjs/common';
// typeorm module
import { TypeOrmModule } from '@nestjs/typeorm';

// Controllers
import { AppController } from './app.controller';
import { AppService } from './app.service';

//Modules
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';

// Entity modules
import { User } from './users/users.entity'
import { Report } from './reports/reports.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Report],
      synchronize: true,
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
