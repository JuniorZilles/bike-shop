import { ConflictException, Injectable } from '@nestjs/common';
import CreateClientDto from './dto/create-client.dto';
import UpdateClientDto from './dto/update-client.dto';
import ClientRepository from './repository/implementation/ClientRepository';

@Injectable()
export default class ClientService {
  constructor(private readonly clientRepository: ClientRepository) {}

  async create(createClientDto: CreateClientDto) {
    const { email } = createClientDto;
    await this.findByEmail(email);
    const client = await this.clientRepository.create(createClientDto);
    return client;
  }

  private async findByEmail(email: string) {
    const response = await this.clientRepository.findOne({ where: { email } });
    if (response) {
      throw new ConflictException('Email already in use');
    }
  }

  findAll() {
    return `This action returns all client`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateClientDto: UpdateClientDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
