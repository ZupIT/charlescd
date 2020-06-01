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

import { keyframes } from 'styled-components';

export const slideInLeft = keyframes`
  from {
    -webkit-transform: translate3d(-100%, 0, 0);
    transform: translate3d(-100%, 0, 0);
    visibility: visible;
  }

  to {
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
  }
`;

export const jiggle = keyframes`
  0% {
    transform: rotate(-1deg);
	}

	50% {
   	transform: rotate(1deg);
	}
`;

export const jiggleRevert = keyframes`
  0% {
    transform: rotate(1deg);
    animation-timing-function: ease-in;
  }

  50% {
    transform: rotate(-1.5deg);
    animation-timing-function: ease-out;
  }
`;

export const slideInRight = keyframes`
  from {
    transform: translate3d(100%, 0, 0);
    visibility: visible;
  }

  to {
    transform: translate3d(0, 0, 0);
  }
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 0.9;
  }
`;

export const slideDown = keyframes`
  0% {
    transform: translate(0, -500px);
  }

  100% {
    transform: translate(0, 0);
  }
`;

export const scaleIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(.5);
  }

  100% {
    opacity: 1;
    transform: scale(1);
  }
`;

export const pulse = keyframes`
	0% {
		transform: scale(1);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
	}

	70% {
		transform: scale(1.2);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}

	100% {
		transform: scale(1);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
`;

export const upDown = keyframes`
  0% {
    transform: translateX(0);
    transform: translateY(0);
  }

  50% {
    transform: translateX(-100px);
    transform: translateY(-150px);
  }

  100% {
    transform: translateX(-800px);
    transform: translateY(-50px);
  }
`;
