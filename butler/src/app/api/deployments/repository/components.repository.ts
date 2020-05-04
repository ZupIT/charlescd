import {
  EntityRepository,
  Repository
} from 'typeorm'
import { ComponentEntity } from '../../components/entity'

@EntityRepository(ComponentEntity)
export class ComponentRepository extends Repository<ComponentEntity> {

  public async getOneWithRelations(
    componentId: string
  ): Promise<ComponentEntity> {
    return this.findOneOrFail(
      { id: componentId }, { relations: ['module'] }
    )
  }
}
