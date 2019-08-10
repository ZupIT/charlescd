import { Controller, Get } from '@nestjs/common'
import { HealthcheckService } from '../services'
import { IReadHealthcheckStatus } from '../interfaces'

@Controller('healthcheck')
export class HealthcheckController {

  constructor(private readonly healthcheckService: HealthcheckService) {}

  @Get()
  public async getHealthcheck(): Promise<IReadHealthcheckStatus> {
    return await this.healthcheckService.getHealthcheckStatus()
  }
}
