/*
 * Copyright 2020 ZUP IT SERVICOS EM TECNOLOGIA E INOVACAO SA
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  BaseEntity,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn
} from 'typeorm'
import { ReadModuleDto } from '../dto'
import { ComponentEntity } from '../../components/entity'

@Entity('modules')
export class ModuleEntity extends BaseEntity {

  @PrimaryColumn({
    name: 'id',
    type: 'uuid'
  })
  public id: string

  @OneToMany(
    () => ComponentEntity,
    componentEntity => componentEntity.module,
    { cascade: true, eager: true }
  )
  public components: ComponentEntity[]

  @CreateDateColumn({ name: 'created_at' })
  public createdAt!: Date

  constructor(
    moduleId: string,
    components: ComponentEntity[]
  ) {
    super()
    this.id = moduleId
    this.components = components
  }

  public toReadDto(): ReadModuleDto {
    return new ReadModuleDto(
      this.id,
      this.components.map(component => component.toReadDto()),
      this.createdAt
    )
  }
}
