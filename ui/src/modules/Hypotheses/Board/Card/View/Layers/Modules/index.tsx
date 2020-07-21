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

import React, { useState, useEffect } from 'react';
import map from 'lodash/map';
import ContentIcon from 'core/components/ContentIcon';
import Layer from 'core/components/Layer';
import Text from 'core/components/Text';
import Panel from 'core/components/Panel';
import { Card } from 'modules/Hypotheses/Board/interfaces';
import Modal from './Modal';
import Module from './Module';
import { useModules } from './hooks';
import Styled from './styled';

interface Props {
  card: Card;
  onFinish: Function;
}

const Modules = ({ card, onFinish }: Props) => {
  const { feature } = card;
  const [isOpen, openModal] = useState(false);
  const { getAllModules, loading, allModules } = useModules();

  useEffect(() => {
    if (allModules) openModal(true);
  }, [allModules]);

  const handleClose = () => {
    openModal(false);
    onFinish();
  };

  const renderModules = () =>
    feature?.modules && (
      <Panel.Content>
        {map(feature?.modules, ({ name }) => (
          <Module key={name} name={name} />
        ))}
      </Panel.Content>
    );

  return (
    <Layer>
      <ContentIcon icon="modules">
        <Text.h2 color="light">Modules</Text.h2>
        <Styled.ButtonAdd
          name="plus-circle"
          icon="plus-circle"
          color="dark"
          isLoading={loading}
          onClick={() => getAllModules()}
        >
          Add / Remove module
        </Styled.ButtonAdd>
        {renderModules()}
      </ContentIcon>
      {isOpen && (
        <Modal
          card={card}
          modules={feature?.modules}
          allModules={allModules}
          onClose={() => handleClose()}
        />
      )}
    </Layer>
  );
};

export default Modules;
