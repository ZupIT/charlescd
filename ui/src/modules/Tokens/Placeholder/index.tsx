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

import { getProfileByKey } from 'core/utils/profile';
import PlaceholderComponent from 'core/components/Placeholder';

const Placeholder = () => {
  const profileName = getProfileByKey('name');

  return (
    <PlaceholderComponent
      icon="empty-groups"
      title={`Hello, ${profileName}!`}
      description="
        If you need to integrate external systems with Charles,
        consider creating a new access token using the side menu to have access to our API.
      "
    />
  );
};

export default Placeholder;
