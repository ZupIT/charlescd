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

import React from 'react';
import { useRouter } from 'core/utils/routes';
import Button from 'core/components/Button';
import routes from 'core/constants/routes';
import Placeholder from 'core/components/Placeholder';
import Styled from '../styled';

const Forbidden403 = () => {
  const router = useRouter();

  return (
    <Styled.Error>
      <Placeholder
        title="Error 403."
        subtitle="You don't have permission to access."
        icon="error-403"
      >
        <Button.Rounded
          name="error-403"
          color="dark"
          onClick={() => router.push(routes.workspaces)}
        >
          Go to home
        </Button.Rounded>
      </Placeholder>
    </Styled.Error>
  );
};

export default Forbidden403;
