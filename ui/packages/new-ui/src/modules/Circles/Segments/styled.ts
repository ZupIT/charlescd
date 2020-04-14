import styled from 'styled-components';
import {
  Input as InputComponent,
  Select as SelectComponent
} from 'core/components/Form';

const Form = styled.form`
  width: 470px;
`;

const Clause = styled.div`
  margin-bottom: 40px;
`;

const Rule = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
`;

const Input = styled(InputComponent)`
  width: 130px;
`;

const Select = styled(SelectComponent)`
  width: 130px;
  margin: 0 40px;
`;

export default {
  Form,
  Clause,
  Rule,
  Input,
  Select
};
