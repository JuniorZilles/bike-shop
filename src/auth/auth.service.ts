import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import MechanicRepository from '../mechanic/repository/implementation/MechanicRepository';
import ClientRepository from '../client/repository/implementation/ClientRepository';
import StoreRepository from '../store/repository/implementation/StoreRepository';
import Store from '../store/entities/store.entity';
import Client from '../client/entities/client.entity';
import Mechanic from '../mechanic/entities/mechanic.entity';
import IAccessToken from '../utils/types/IAccessToken';

@Injectable()
export default class AuthService {
  constructor(
    private mechanicRepository: MechanicRepository,
    private clientRepository: ClientRepository,
    private storeRepository: StoreRepository,
    private jwtService: JwtService
  ) {}

  async getStore(username: string, pass: string): Promise<Store> {
    const store = await this.storeRepository.findOne({ where: { email: username, password: pass } });
    return store;
  }

  async getClient(username: string, pass: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { email: username, password: pass } });
    return client;
  }

  async getMechanic(username: string, pass: string): Promise<Mechanic> {
    const mechanic = await this.mechanicRepository.findOne({ where: { email: username, password: pass } });
    return mechanic;
  }

  async signInStore(store: Store): Promise<IAccessToken> {
    const payload = { sub: store.storeId, username: store.email, type: 'store' };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      expiresIn: 3600
    };
  }

  async signInMechanic(mechanic: Mechanic): Promise<IAccessToken> {
    const payload = { sub: mechanic.mechanicId, username: mechanic.email, type: 'mechanic' };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      expiresIn: 3600
    };
  }

  async signInClient(client: Client): Promise<IAccessToken> {
    const payload = { sub: client.clientId, username: client.email, type: 'client' };
    return {
      accessToken: await this.jwtService.signAsync(payload),
      expiresIn: 3600
    };
  }
}
