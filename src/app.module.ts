import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import DatabaseModule from './database/database.module';
import UserModule from './users/user.module';
import AuthenticationModule from './authentication/authentication.module'
import CategoryModule from './categories/category.module';
import TransactionModule from './transactions/transaction.module';
import AttachmentModule from './attachments/attachment.module';

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
  }), DatabaseModule, UserModule, AuthenticationModule, CategoryModule, AttachmentModule, TransactionModule],
  controllers: [],
  providers: [],
})
export class AppModule { }