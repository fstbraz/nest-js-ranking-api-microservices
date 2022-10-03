import { Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { ClientProxyRankingAPI } from '../proxyrmq/client-proxy';
import { CreateCategoryDto } from './dtos/create-category.dto';
import { UpdateCategoryDto } from './dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private clientProxyRankingAPI: ClientProxyRankingAPI) {}

  private clientAdminBackend =
    this.clientProxyRankingAPI.getClientProxyAdminBackendInstance();

  createCategory(createCategoryDto: CreateCategoryDto) {
    this.clientAdminBackend.emit('create-category', createCategoryDto);
  }

  async listCategories(_id: string): Promise<any> {
    return await lastValueFrom(
      this.clientAdminBackend.send('list-categories', _id ? _id : ''),
    );
  }

  updateCategory(updateCategoryDto: UpdateCategoryDto, _id: string) {
    this.clientAdminBackend.emit('update-category', {
      id: _id,
      categoria: updateCategoryDto,
    });
  }
}
