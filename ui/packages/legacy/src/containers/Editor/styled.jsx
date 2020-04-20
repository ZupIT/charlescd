import React from 'react'
import styled, { css } from 'styled-components'
import ExpandButton from 'core/assets/svg/editor-plus-icon.svg'
import VideoButton from 'core/assets/svg/play-button.svg'
import ImageButton from 'core/assets/svg/image-button.svg'
import { EDITOR } from './constants'

const editorMargin = '0px'

const iconDefaultStyle = `
  cursor: pointer;
  width: ${EDITOR.LINE_BUTTON_SIZE}px;
  height: ${EDITOR.LINE_BUTTON_SIZE}px;
  margin-right: 10px;
`

const expandStyle = expand => `
  width: ${EDITOR.LINE_BUTTON_SIZE}px;
  height: ${EDITOR.LINE_BUTTON_SIZE}px;
  transform: scale(0);
   
  ${expand && css`
    transform: scale(1);
    -webkit-transform: scale(1);
    -ms-transform: scale(1);
    transition: transform .35s;
  `}
`

export const StyledLineButtons = styled(
  ({ display, position, expand, ...rest }) => <div {...rest} />,
)`
  visibility: ${({ display }) => display ? 'visible' : 'hidden'};
  position: absolute;
  top: ${({ position }) => position}px;
  left: 0px;
  width: ${EDITOR.LINE_BUTTON_SIZE}px;
  height: ${EDITOR.LINE_BUTTON_SIZE}px;
  background-color: ${({ theme }) => theme.DEFAULT.BODY_BACKGROUND};
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_1};
  
  ${({ expand }) => expand && css`
    display: flex;
    align-items: center;
    width: 300px;
    transition: width .2s;
  `}
`

export const StyledEditorWrapper = styled.div`
  position: relative;
  min-height: 70px;
  margin: ${editorMargin};
`

export const StyledEditor = styled.div`
  width: 600px;
  height: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-sizing: border-box;
  padding-bottom: 50px;
  margin-left: ${EDITOR.LEFT_SIZE}px;

  :focus {
    outline: none;
  }
  
  p {
    min-height: ${EDITOR.LINE_BUTTON_SIZE}px;
    line-height: ${EDITOR.LINE_BUTTON_SIZE}px;
    margin: 0 0 5px;
    font-weight: 300;
  }
  
  .media-wrapper > .media-item {
    border: 2px solid ${({ theme }) => theme.DEFAULT.GRADIENT_END};    
  }
  
  iframe.media-item {
    width: 560px;
    height: 313px;
  }
  
  .media-left {
    display: flex;
    justify-content: flex-start;
  }
  
  .media-right {
    display: flex;
    justify-content: flex-end;
  }
  
  .media-center {
    display: flex;
    justify-content: center;
  }

  .media-full > .media-item {
    width: 100%;
  }
  
  .media-full > iframe.media-item {
    width: 100%;
    height: 600px;
  }
`

export const StyledExpandButton = styled(
  ({ expand, ...rest }) => <ExpandButton {...rest} />,
)`
  ${iconDefaultStyle};

  transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  transition: transform .2s;
   
  ${({ expand }) => expand && css`
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transition: transform .2s;
  `}
`

export const StyledVideoButton = styled(
  ({ expand, ...rest }) => <VideoButton {...rest} />,
)`
  ${iconDefaultStyle};
  ${({ expand }) => expandStyle(expand)};
`

export const StyledImageButton = styled(
  ({ expand, ...rest }) => <ImageButton {...rest} />,
)`
  ${iconDefaultStyle};
  ${({ expand }) => expandStyle(expand)};
`

export const StyledMediaForm = styled(
  ({ top, ...rest }) => <form {...rest} />,
)`
  position: absolute;
  width: 300px;
  left: 30px;
  top: ${({ top }) => top}px;
  height: 18px;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_1};
`

export const StyledMediaInput = styled.input`
  :focus {
    outline: none;
  }

  width: 300px;
  height: 18px;
  border: none;
  border-bottom: 1px solid gray;
  background: ${({ theme }) => theme.DEFAULT.BODY_BACKGROUND};
`

export const StyledMediaToolbar = styled(
  ({ display, position, ...rest }) => <div {...rest} />,
)`
  display: ${({ display }) => display ? 'flex' : 'none'};
  position: absolute;
  width: ${EDITOR.TOOLBAR_WIDTH}px;
  top: ${({ position }) => (position.top - EDITOR.TOOLBAR_HEIGHT)}px;
  left: ${({ position }) => position.left}px;

  background-color: #242424;
  background: -webkit-linear-gradient(top,#242424,rgba(36,36,36,.75));
  background: linear-gradient(to bottom,#242424,rgba(36,36,36,.75));
  border: 1px solid #000;
  border-radius: 5px;
  box-shadow: 0 0 3px #000;
  cursor: pointer;
  z-index: ${({ theme }) => theme.Z_INDEX.OVER_2};
  
  &:after {
    border-color: #242424 transparent transparent;
    top: ${({ position }) => position.top}px;
  }
`

export const StyledMediaToolbarButton = styled.div`
  width: 30px;
  height: ${EDITOR.TOOLBAR_HEIGHT}px;
  line-height: 30px;
  text-align: center;
  background-color: #242424;
  background: -webkit-linear-gradient(top,#242424,rgba(36,36,36,.89));
  background: linear-gradient(to bottom,#242424,rgba(36,36,36,.89));
  border: 0;
  border-right: 1px solid #000;
  border-left: 1px solid rgba(255,255,255,.1);
  box-shadow: 0 2px 2px rgba(0,0,0,.3);
  color: #fff;
`

export const StyledClose = styled.div`
  margin: ${({ margin }) => margin || `0 0 ${editorMargin}`};
  font-weight: 300;
  cursor: pointer;
`

export const StyledActions = {
  Wrapper: StyledLineButtons,
  Expand: StyledExpandButton,
  Video: StyledVideoButton,
  Image: StyledImageButton,
  Form: StyledMediaForm,
  Input: StyledMediaInput,
  Toolbar: StyledMediaToolbar,
  ToolbarButton: StyledMediaToolbarButton,
  Close: StyledClose,
}
