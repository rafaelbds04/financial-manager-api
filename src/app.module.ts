import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import DatabaseModule from './database/database.module';
import UserModule from './users/user.module';
import AuthenticationModule from './authentication/authentication.module'
import CategoryModule from './categories/category.module';
import TransactionModule from './transactions/transaction.module';
import AttachmentModule from './attachments/attachment.module';
import ReceiptModule from './receipt/receipt.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import StatsModule from './stats/stats.module';

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
  ServeStaticModule.forRoot({
    rootPath: join(__dirname, '..', '..', 'uploads'),
    serveRoot: '/uploads'
  }),

  ],
  controllers: [],
  providers: [],
})
export class AppModule { }