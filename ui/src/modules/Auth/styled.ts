import styled from 'styled-components';
import Icon from 'core/components/Icon';
import TextComponent from 'core/components/Text';
import ButtonComponent from 'core/components/Button';
import { upDown } from 'core/assets/style/animate';

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  background-color: ${({ theme }) => theme.main.background};
  overflow: hidden;
`;

const Container = styled.div`
  position: relative;
  width: 1080px;
  height: 100vh;
  margin: 0 auto;
`;

const Background = styled.div`
  position: absolute;
  left: 580px;
  top: -700px;

  svg {
    path:nth-child(1) {
      animation: ${upDown} 18s infinite alternate;
    }

    path:nth-child(2) {
      animation: ${upDown} 12s infinite alternate;
    }

    path:nth-child(3) {
      animation: ${upDown} 17s infinite alternate;
    }

    path:nth-child(4) {
      animation: ${upDown} 14s infinite alternate;
    }

    path:nth-child(5) {
      animation: ${upDown} 15s infinite alternate;
    }

    path:nth-child(6) {
      animation: ${upDown} 11s infinite alternate;
    }

    path:nth-child(7) {
      animation: ${upDown} 13s infinite alternate;
    }

    path:nth-child(8) {
      animation: ${upDown} 10s infinite alternate;
    }

    path:nth-child(9) {
      animation: ${upDown} 16s infinite alternate;
    }

    path:nth-child(10) {
      animation: ${upDown} 15s infinite alternate;
    }

    path:nth-child(11) {
      animation: ${upDown} 16s infinite alternate;
    }
  }
`;

const Copyright = styled(TextComponent.h5)`
  position: absolute;
  display: flex;
  align-items: center;
  left: 141px;
  bottom: 25px;
`;

const Heart = styled(Icon)`
  margin: 0 5px;
`;

const Zup = styled(Icon)`
  margin: 0 5px;
`;

const Content = styled.div`
  position: absolute;
  margin-top: 251px;
  margin-left: 141px;
`;

const Title = styled(TextComponent.h3)`
  margin: 39px 0 30px;
`;

const Form = styled.form`
  position: relative;
  width: 252px;
`;

const Field = styled.div`
  margin-top: 28px;
`;

const Error = styled(TextComponent.h6)`
  margin-top: 5px;
`;

const Button = styled(ButtonComponent.Default)`
  position: absolute;
  border-radius: 30px;
  margin-top: 28px;
  right: 0;
`;

export default {
  Wrapper,
  Background,
  Container,
  Content,
  Title,
  Form,
  Field,
  Error,
  Button,
  Copyright,
  Heart,
  Zup
};
