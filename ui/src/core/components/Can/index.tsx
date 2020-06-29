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

import React, { ReactElement, cloneElement } from 'react';
import ReactTooltip from 'react-tooltip';
import { createCanBoundTo } from '@casl/react';
import uniqueId from 'lodash/uniqueId';
import omit from 'lodash/omit';
import Text from 'core/components/Text';
import { ability, Actions, Subjects } from 'core/utils/abilities';

interface Props {
  I: Actions;
  a: Subjects;
  passThrough?: boolean;
  isDisabled?: boolean;
  children: ReactElement;
}

const Can = createCanBoundTo(ability);

const Element = ({
  children,
  I,
  a,
  passThrough = false,
  isDisabled = false
}: Props) => {
  const id = uniqueId();
  const renderTooltip = () => (
    <ReactTooltip id={id} place="right" effect="solid">
      <Text.h6 color="dark">Not allowed</Text.h6>
    </ReactTooltip>
  );

  const getChildren = (allowed: boolean): ReactElement => {
    if (!allowed) {
      const child = React.Children.only(children);
      const childProps = omit(child.props, ['onClick', 'href', 'to']);
      const newChildren = React.createElement(child.type, {
        ...childProps,
        isDisabled: !allowed,
        style: {
          cursor: 'default',
          opacity: '0.3',
          transform: 'scale(1)'
        }
      });

      return newChildren;
    }

    return cloneElement(children, {
      isDisabled: !allowed || isDisabled
    });
  };

  return (
    <Can I={I} a={a} passThrough={passThrough}>
      {(allowed: boolean) => (
        <>
          {!allowed && renderTooltip()}
          {cloneElement(getChildren(allowed), {
            'data-tip': true,
            'data-for': id
          })}
        </>
      )}
    </Can>
  );
};

export default Element;
