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

import React, {
  useEffect,
  useRef,
  Ref,
  forwardRef,
  MutableRefObject,
  useImperativeHandle
} from 'react';
import { useForm } from 'react-hook-form';
import Input from 'core/components/Form/Input';
import Styled from './styled';

interface Props {
  onSave: Function;
}

const FakeCard = forwardRef(({ onSave }: Props, ref: Ref<HTMLDivElement>) => {
  const fakeCardRef = useRef<HTMLDivElement>(null) as MutableRefObject<
    HTMLDivElement
  >;
  const { register, handleSubmit } = useForm();
  const inputRef = useRef<HTMLInputElement>();

  useImperativeHandle(ref, () => fakeCardRef.current);

  useEffect(() => {
    inputRef.current.focus();
  }, [inputRef]);

  return (
    <Styled.Card ref={fakeCardRef}>
      <form onSubmit={handleSubmit(data => onSave(data.name))}>
        <Input
          ref={(input: HTMLInputElement) => {
            register(input);
            inputRef.current = input;
          }}
          name="name"
          label="Type a name for the new card"
        />
      </form>
    </Styled.Card>
  );
});

export default FakeCard;
