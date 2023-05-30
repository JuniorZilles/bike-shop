import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import AuthService from './auth.service';
import Mechanic from '../mechanic/entities/mechanic.entity';

@Injectable()
export default class MechanicStrategy extends PassportStrategy(Strategy, 'mechanic') {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Mechanic> {
    const user = await this.authService.getMechanic(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
