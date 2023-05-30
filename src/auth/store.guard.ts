import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class StoreAuthGuard extends AuthGuard('store') {}
