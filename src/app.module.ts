import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import DatabaseModule from './database/database.module';
import UserModule from './users/user.module';
import AuthenticationModule from './authentication/authentication.module'
import CategoryModule from './categories/category.module';
import TransactionModule from './transactions/transaction.module';
import AttachmentModule from './attachments/attachment.module';
import ReceiptModule from './receipt/receipt.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import * as path from 'path';
import StatsModule from './stats/stats.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule.forRoot({
    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
      JWT_SECRET: Joi.string().required(),
      JWT_EXPIRES_TIME: Joi.number().required(),
    })
  }), DatabaseModule, UserModule, AuthenticationModule, CategoryModule,
    AttachmentModule, TransactionModule, ReceiptModule, StatsModule,
  ServeStaticModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ([{
      rootPath: path.resolve(__dirname, '../', configService.get('UPLOADS_DEST')),
      serveRoot: '/uploads'
    }])
  }),
  ScheduleModule.forRoot()
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
