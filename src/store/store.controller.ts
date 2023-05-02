import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import StoreService from './store.service';
import CreateStoreDto from './dto/create-store.dto';
import UpdateStoreDto from './dto/update-store.dto';

@Controller('store')
export default class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  create(@Body() createStoreDto: CreateStoreDto) {
    return this.storeService.create(createStoreDto);
  }

  @Get()
  findAll() {
    return this.storeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storeService.remove(id);
  }
}
