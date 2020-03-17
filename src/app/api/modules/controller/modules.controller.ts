import {
  Body,
  Controller,
  Get,
  Param,
  Post
} from '@nestjs/common'
import {
  CreateModuleDto,
  ReadModuleDto
} from '../dto'
import { ModulesService } from '../services'
import { CreateModuleUsecase } from '../use-cases'

@Controller('modules')
export class ModulesController {

  constructor(
      private readonly modulesService: ModulesService,
      private readonly createModuleUsecase: CreateModuleUsecase
    ) {}

  @Post()
  public async createModule(
      @Body() createModuleDto: CreateModuleDto
  ): Promise<ReadModuleDto> {

    return await this.createModuleUsecase.execute(createModuleDto)
  }

  @Get()
  public async getModules(): Promise<ReadModuleDto[]> {
    return await this.modulesService.getModules()
  }

  @Get(':id')
  public async getModuleById(@Param('id') id: string): Promise<ReadModuleDto> {
    return await this.modulesService.getModuleById(id)
  }
}
