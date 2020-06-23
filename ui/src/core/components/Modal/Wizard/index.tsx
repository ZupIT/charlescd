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

import React, { useRef, useState, useEffect } from 'react';
import Styled from './styled';
import Text from 'core/components/Text';
import { WizardItems } from './constants';
import map from 'lodash/map';
import indexOf from 'lodash/indexOf';

interface Item {
  icon: string;
  title: string;
  name: string;
  size: string;
  backgroundColor: string;
  subtitle: string;
}

const Wizard = () => {
  const modalRef = useRef<HTMLDivElement>();
  const [itemSelect, setItemSelect] = useState<Item>(WizardItems[0]);
  const [indexOfItemSelect, setIndexOfItemSelect] = useState(0);
  const [localStorageValue, setLocalStorageValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setLocalStorageValue(localStorage.getItem('wizard'));
    if (!localStorageValue) {
      setIsOpen(true);
    } else if (localStorageValue === 'not-first-access') {
      setIsOpen(false);
    }
  }, [localStorage, localStorageValue]);

  useEffect(() => {
    setIndexOfItemSelect(indexOf(WizardItems, itemSelect));
  }, [itemSelect]);

  useEffect(() => {
    setItemSelect(WizardItems[indexOfItemSelect]);
  }, [indexOfItemSelect]);

  const handleButton = () => {
    if (itemSelect.name !== 'metrics-provider') {
      setIndexOfItemSelect(indexOfItemSelect + 1);
    } else {
      setIsOpen(false);
      localStorage.setItem('wizard', 'not-first-access');
    }
  };

  const sideMenu = () => (
    <Styled.SideMenu className="modal-sidemenu">
      <Text.h3 color="light" weight="bold">
        Configure the Workspace
      </Text.h3>
      {map(WizardItems, (item, index) => (
        <Styled.Item.Wrapper
          key={item.name}
          data-testid={`modal-wizard-menu-item-${item.name}`}
          onClick={() => setItemSelect(item)}
        >
          <Styled.Item.Active
            status={
              itemSelect.name === item.name
                ? 'active'
                : index > indexOfItemSelect
                ? 'unread'
                : 'read'
            }
          />
          <Styled.Item.Text
            status={
              itemSelect.name === item.name
                ? 'active'
                : index > indexOfItemSelect
                ? 'unread'
                : 'read'
            }
          >
            {item.title}
          </Styled.Item.Text>
        </Styled.Item.Wrapper>
      ))}
      <Styled.Button
        color="light"
        name="next"
        onClick={() => handleButton()}
        backgroundColor="primary"
        size="small"
      >
        {itemSelect.name === 'metrics-provider' ? "Let's Start" : 'Next'}
      </Styled.Button>
    </Styled.SideMenu>
  );

  const Info = (item: Item) => (
    <Styled.Content.Wrapper
      className="modal-info"
      data-testid={`modal-wizard-info-${item.name}`}
    >
      <Styled.Content.Background backgroundColor={item.backgroundColor}>
        <Styled.Content.Icon name={item.icon} size={item.size} />
      </Styled.Content.Background>
      <Styled.Info>
        <Styled.Content.Title color="light" weight="bold">
          {item.title}
        </Styled.Content.Title>
        <Styled.Content.Subtitle color="light">
          {item.subtitle}
        </Styled.Content.Subtitle>
      </Styled.Info>
    </Styled.Content.Wrapper>
  );

  return (
    <Styled.Wrapper isOpen={isOpen} data-testid="modal-wizard">
      <Styled.Background className="modal-background" />
      <Styled.Dialog className="modal-dialog" ref={modalRef}>
        <Styled.Container className="modal-content">
          {sideMenu()}
          {Info(itemSelect)}
        </Styled.Container>
      </Styled.Dialog>
    </Styled.Wrapper>
  );
};

export default Wizard;
