import styled from 'styled-components';

type LoaderProps = {
  isVisible: boolean;
};

const List = styled.div`
  overflow-y: auto;
  height: 100%;
`;

const Loader = styled.div<LoaderProps>`
  display: ${({ isVisible }) => (isVisible ? 'block' : 'none')};
`;

export default { List, Loader };
