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

import React, { forwardRef, Ref } from 'react';
import { Build } from '../../interfaces';
import Card from 'core/components/Card';
// import Dropdown from 'core/components/Dropdown';

interface Props {
  build: Build;
}

const CardBuild = forwardRef(({ build }: Props, ref: Ref<HTMLDivElement>) => {
  // const removeBuild = () => {
  //   removeBy(build.id);
  // };

  // const archiveBuild = () => {
  //   archiveBy(build.id);
  // };

  // const renderAction = () => (
  //   <Dropdown color="light">
  //     <Dropdown.Item
  //       icon="folder"
  //       name="Archive"
  //       onClick={() => archiveBuild()}
  //     />
  //     <Dropdown.Item
  //       icon="delete"
  //       name="Delete"
  //       onClick={() => removeBuild()}
  //     />
  //   </Dropdown>
  // );

  return (
    <Card.Release ref={ref} status={build.status} description={build.tag} />
  );
});

export default CardBuild;
