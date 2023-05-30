import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import AuthService from './auth.service';
import Store from '../store/entities/store.entity';

@Injectable()
export default class StoreStrategy extends PassportStrategy(Strategy, 'store') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Store> {
    const user = await this.authService.getStore(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
