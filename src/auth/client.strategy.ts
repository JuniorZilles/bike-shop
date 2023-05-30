import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import AuthService from './auth.service';
import Client from '../client/entities/client.entity';

@Injectable()
export default class ClientStrategy extends PassportStrategy(Strategy, 'client') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Client> {
    const user = await this.authService.getClient(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
