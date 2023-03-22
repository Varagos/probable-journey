import { Module, DynamicModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import {
  JwtModule,
  JwtModuleAsyncOptions,
  JwtModuleOptions,
} from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { UserWriteRepoPortToken } from '@src/lib/bounded-contexts/iam/authentication/ports/UserWriteRepoPort';
import { MongoModule } from '@src/infra/db/mongo/mongo.module';
import { ConfigService } from '@nestjs/config';
import { AuthEnvironmentVariables } from '@src/config/auth.configuration';
import { UserWritePostgresRepository } from '@src/bounded-contexts/iam/iam/repository/user-write.pg.repository';
import { PostgresModule } from '@src/bitloops/postgres';

// This can be used from other contexts/modules, that don't need to know about the local strategy(users service)
@Module({})
export class JwtAuthModule {
  static register(options: JwtModuleOptions): DynamicModule {
    return {
      module: JwtAuthModule,
      imports: [JwtModule.register(options)],
      providers: [JwtStrategy],
      exports: [JwtModule],
    };
  }

  static registerAsync(options: JwtModuleAsyncOptions): DynamicModule {
    return {
      module: JwtAuthModule,
      imports: [JwtModule.registerAsync(options)],
      providers: [JwtStrategy],
      exports: [JwtModule],
    };
  }
}

@Module({
  imports: [
    PassportModule,
    MongoModule,
    JwtAuthModule.registerAsync({
      useFactory: (
        configService: ConfigService<AuthEnvironmentVariables, true>,
      ) => ({
        secret: configService.get('jwtSecret'),
        signOptions: { expiresIn: '3600s' },
      }),
      inject: [ConfigService],
    }),

    PostgresModule.forRootAsync({
      useFactory: (
        configService: ConfigService<AuthEnvironmentVariables, true>,
      ) => ({
        database: configService.get('database.database', { infer: true }),
        host: configService.get('database.host', { infer: true }),
        port: configService.get('database.port', { infer: true }),
        user: configService.get('database.user', { infer: true }),
        password: configService.get('database.password', { infer: true }),
        max: 20,
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    UsersService,
    { provide: UserWriteRepoPortToken, useClass: UserWritePostgresRepository },
  ],
  exports: [AuthService],
})
export class AuthModule {}
