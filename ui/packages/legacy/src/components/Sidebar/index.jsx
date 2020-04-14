import React from 'react'
import PropTypes from 'prop-types'
import { Translate } from 'components'
import CharlesLogo from 'core/assets/svg/charles.svg'
import ArrowLeft from 'core/assets/svg/arrow-left.svg'
import { INDEX_ROUTE } from 'core/constants/routes'
import Styled from './styled'

const SidebarBack = ({ to, textId }) => (
  <SidebarItem
    to={to}
    textId={textId}
    icon={<ArrowLeft />}
  />
)

SidebarBack.defaultProps = {
  to: '',
  textId: '',
}

SidebarBack.propTypes = {
  to: PropTypes.string,
  textId: PropTypes.string,
}

const Sidebar = ({ children, className, isOpen }) => (
  <Styled.Wrapper className={className} isOpen={isOpen}>
    <Styled.Brand to={INDEX_ROUTE}>
      <CharlesLogo />
    </Styled.Brand>
    {isOpen && <SidebarBack to={INDEX_ROUTE} />}
    {children}
  </Styled.Wrapper>
)

Sidebar.defaultProps = {
  className: '',
  isOpen: false,
}

Sidebar.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  isOpen: PropTypes.bool,
}

const SidebarTooltip = ({ textId }) => (
  <Styled.Tooltip id={textId} place="right" effect="solid">
    <Translate id={textId} />
  </Styled.Tooltip>
)

SidebarTooltip.propTypes = {
  textId: PropTypes.string.isRequired,
}

const SidebarItem = ({ className, icon, textId, to }) => (
  <Styled.Item className={className} to={to}>
    <Styled.ItemIcon data-tip data-for={textId}>
      {icon}
    </Styled.ItemIcon>
    <Styled.ItemText>
      <Translate id={textId} />
    </Styled.ItemText>
    <SidebarTooltip textId={textId} />
  </Styled.Item>
)

SidebarItem.defaultProps = {
  className: '',
}

SidebarItem.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.node.isRequired,
  textId: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
}

Sidebar.Item = SidebarItem

export default Sidebar
