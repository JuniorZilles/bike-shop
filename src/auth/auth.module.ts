import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import AuthController from './auth.controller';
import AuthService from './auth.service';
import ClientModule from '../client/client.module';
import StoreModule from '../store/store.module';
import MechanicModule from '../mechanic/mechanic.module';
import MechanicStrategy from './mechanic.strategy';
import ClientStrategy from './client.strategy';
import StoreStrategy from './store.strategy';
import JwtStrategy from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: process.env.NODE_ENV === 'test' ? ['.env.test'] : ['.env'] }),
    ClientModule,
    StoreModule,
    MechanicModule,
    PassportModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '3600s' }
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, MechanicStrategy, ClientStrategy, StoreStrategy, JwtStrategy]
})
export default class AuthModule {}
