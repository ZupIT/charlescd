import styled, { css } from 'styled-components';
import ComponentText from 'core/components/Text';
import { Props } from '.';

const Log = styled.div<Pick<Props, 'type'>>`
  display: flex;
  flex-direction: row;
  width: 231px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  align-items: center;
  padding: 2.5px 8px 2.5px 10px;
  border-radius: 9.5px;
  box-sizing: border-box;

  ${({ theme, type }) =>
    type === 'error' &&
    css`
      color: ${theme.log.error.color};
      background-color: ${theme.log.error.background};
    `}

  ${({ theme, type }) =>
    type === 'warning' &&
    css`
      color: ${theme.log.warning.color};
      background-color: ${theme.log.warning.background};
    `}
`;

const Text = styled(ComponentText.h5)`
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  margin-left: 5px;
`;

const Content = styled.div`
  display: flex;
  flex-direction: row;
`;

export default {
  Log,
  Content,
  Text
};
