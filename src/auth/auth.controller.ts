import { Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import AuthService from './auth.service';
import Mechanic from '../mechanic/entities/mechanic.entity';
import Store from '../store/entities/store.entity';
import Client from '../client/entities/client.entity';
import ILoginDTO from '../utils/types/ILoginDTO';
import MechanicAuthGuard from './mechanic.guard';
import StoreAuthGuard from './store.guard';
import ClientAuthGuard from './client.guard';

@ApiTags('auth')
@Controller('auth')
export default class AuthController {
  constructor(private authService: AuthService) {}

  @ApiBody({ type: ILoginDTO })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(MechanicAuthGuard)
  @Post('login/mechanic')
  signInMechanic(@Request() req: Record<string, Mechanic>) {
    return this.authService.signInMechanic(req.user);
  }

  @ApiBody({ type: ILoginDTO })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(StoreAuthGuard)
  @Post('login/store')
  signInStore(@Request() req: Record<string, Store>) {
    return this.authService.signInStore(req.user);
  }

  @ApiBody({ type: ILoginDTO })
  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(ClientAuthGuard)
  @Post('login/client')
  signInClient(@Request() req: Record<string, Client>) {
    return this.authService.signInClient(req.user);
  }
}
