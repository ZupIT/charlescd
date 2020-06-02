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

import { AbilityBuilder, Ability } from '@casl/ability';
import forEach from 'lodash/forEach';
import { getRoles } from 'core/utils/auth';
import { isRoot } from 'core/utils/auth';

export type Actions = 'read' | 'write';
export type Subjects =
  | 'maintenance'
  | 'deploy'
  | 'circles'
  | 'modules'
  | 'hypothesis';
type AppAbility = Ability<[Actions, Subjects]>;

const actions = ['read', 'write'];
const subjects = ['maintenance', 'deploy', 'circles', 'modules', 'hypothesis'];

const { build } = new AbilityBuilder<AppAbility>();
const ability = build();

const setUserAbilities = () => {
  const { can, rules } = new AbilityBuilder<AppAbility>();

  if (isRoot()) {
    forEach(subjects, subject => {
      forEach(actions, action => {
        const act = action as Actions;
        const sbj = subject as Subjects;

        can(act, sbj);
      });
    });
  } else {
    const roles = getRoles();
    forEach(roles, (role: string) => {
      const [sub, act = 'write'] = role.split('_');
      const subject = sub as Subjects;
      const action = act as Actions;

      can(action, subject);
    });
  }

  ability.update(rules);
};

export { ability, setUserAbilities };
