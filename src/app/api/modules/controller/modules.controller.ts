import { Controller, Get, Param } from '@nestjs/common'
import { ReadModuleDto } from '../dto'
import { ModulesService } from '../services'

@Controller('modules')
export class ModulesController {

  constructor(private readonly modulesService: ModulesService) {}

  @Get()
  public async getModules(): Promise<ReadModuleDto[]> {
    return await this.modulesService.getModules()
  }

  @Get(':id')
  public async getModuleById(@Param('id') id: string): Promise<ReadModuleDto> {
    return await this.modulesService.getModuleById(id)
  }
}
