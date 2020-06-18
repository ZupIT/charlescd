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

import React, { useRef, useState } from "react";
import Styled from "./styled";
import Text from "core/components/Text";
import { WizardItems } from "./constants";
import { map } from "lodash";

interface Item {
    icon: string;
    title: string;
    name: string;
    backgroundColor: string;
    subtitle: string
}

const Wizard = () => {
  const modalRef = useRef<HTMLDivElement>();
  const [itemSelect, setItemSelect] = useState<Item>(WizardItems[0]);

  const sideMenu = () => (
    <Styled.SideMenu>
      <Text.h3 color="light" weight="bold">
        Configure the Workspace
      </Text.h3>
      {map(WizardItems, item => (
        <Styled.Item onClick={() => setItemSelect(item)}>
          <Styled.ItemText isActive={true}>{item.title}</Styled.ItemText>
        </Styled.Item>
      ))}
      <Styled.Button
        color="light"
        name="next"
        onClick={() => console.log("next")}
        backgroundColor="primary"
        size="small"
      >
        Next
      </Styled.Button>
    </Styled.SideMenu>
  );

  const Info = (item: Item) => (
      <Styled.Container>
          {item.title}
      </Styled.Container>
  )

  return (
    <Styled.Wrapper>
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
