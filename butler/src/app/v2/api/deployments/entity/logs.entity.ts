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
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { DeploymentEntityV2 as DeploymentEntity } from './deployment.entity'
import { Log } from '../interfaces/log.interface'
import { ReadLogsDto } from '../dto/read-logs.dto'

@Entity('v2logs')
export class LogEntity {

    @PrimaryGeneratedColumn('uuid')
    public id!: string
    @Column({ name: 'deployment_id' })
    public deploymentId!: string
    

    @Column({ name: 'logs', type: 'jsonb' })
    public logs!: Log[]

    @JoinColumn({ name: 'deployment_id' })
    @ManyToOne(() => DeploymentEntity)
    public deployment!: DeploymentEntity
    constructor(
      deploymentId: string,
      logs: Log[]
    ) {  
      this.deploymentId = deploymentId
      this.logs = logs
    }

    public toReadDto(): ReadLogsDto {
      return new ReadLogsDto(this.id, this.logs)
    }

    public concatLogs(logsConcat: Log[]): void {
      this.logs = this.logs.concat(logsConcat)
    }
}