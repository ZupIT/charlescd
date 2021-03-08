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

import { Injectable, InternalServerErrorException, PipeTransform } from '@nestjs/common'
import { CreateDeploymentRequestDto } from '../dto/create-deployment-request.dto'
import * as openpgp from 'openpgp'
import { AppConstants } from '../../../core/constants'

@Injectable()
export class GitTokenDecryptionPipe implements PipeTransform {

  public async transform(deploymentRequest: CreateDeploymentRequestDto): Promise<CreateDeploymentRequestDto> {
    const encryptedToken = deploymentRequest.git.token
    const decryptedToken = await this.decryptToken(encryptedToken)
    if (decryptedToken) {
      deploymentRequest.git.token = decryptedToken
      return deploymentRequest
    }
    throw new InternalServerErrorException({
      errors: [
        {
          detail: 'unable to decrypt "token"',
          meta: {
            component: 'butler',
            timestamp: Date.now()
          },
          source: {
            pointer: 'git.token'
          },
          status: 500
        }
      ]
    })
  }

  private async decryptToken(pgpToken: string) : Promise<string | undefined> {
    try {
      const decodedToken = Buffer.from(pgpToken, 'base64').toString('utf8')
      const message = await openpgp.readMessage({ armoredMessage: decodedToken })
      const decryptedMessage = await openpgp.decrypt({ message: message, passwords: AppConstants.ENCRYPTION_KEY })
      return decryptedMessage.data
    } catch (error) {
      return
    }
  }
}
