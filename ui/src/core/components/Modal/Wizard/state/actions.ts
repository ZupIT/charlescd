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

import { ModalWizard } from '../interfaces/ModalWizard';

export enum ACTION_TYPES {
  toogleModalWizard = 'WIZARD/TOOGLE',
  dismissModalWizard = 'WIZARD/DISMISS'
}

interface ToogleModalWizardActionType {
  type: typeof ACTION_TYPES.toogleModalWizard;
  payload: ModalWizard;
}

interface DismissModalWizardActionType {
  type: typeof ACTION_TYPES.dismissModalWizard;
}

export const toogleModalWizard = (
  payload: ModalWizard
): ModalWizardActionTypes => ({
  type: ACTION_TYPES.toogleModalWizard,
  payload
});

export const dismissModalWizard = (): ModalWizardActionTypes => ({
  type: ACTION_TYPES.dismissModalWizard
});

export type ModalWizardActionTypes =
  | ToogleModalWizardActionType
  | DismissModalWizardActionType;
