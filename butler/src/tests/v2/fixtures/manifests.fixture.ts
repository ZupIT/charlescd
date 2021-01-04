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

import * as fs from 'fs'
import * as path from 'path'
import * as yaml from 'js-yaml'

import { KubernetesManifest } from '../../../app/v2/core/integrations/interfaces/k8s-manifest.interface'

const basePath = path.join(__dirname, '../../../', 'resources/helm-test-chart')

export const defaultManifests: KubernetesManifest[] = yaml.safeLoadAll(fs.readFileSync(`${basePath}/manifest-default.yaml`, 'utf-8'))