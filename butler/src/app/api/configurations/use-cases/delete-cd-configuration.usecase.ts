import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { CdConfigurationsRepository } from '../repository'
import { CdConfigurationEntity } from '../entity'

@Injectable()
export class DeleteCdConfigurationUsecase {

    constructor(
        @InjectRepository(CdConfigurationsRepository)
        private readonly cdConfigurationsRepository: CdConfigurationsRepository
    ) { }

    public async execute(
        cdConfigurationId: string,
        workspaceId: string
    ): Promise<void> {
        const cdConfiguration: CdConfigurationEntity = await this.cdConfigurationsRepository.findDecrypted(cdConfigurationId)

        if (typeof cdConfiguration === 'undefined' || cdConfiguration.workspaceId !== workspaceId) {
            throw new NotFoundException('Cd configuration not found')
        }

        await this.cdConfigurationsRepository.delete(cdConfigurationId)
    }

}
