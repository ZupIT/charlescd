import React from 'react'
import { Sidebar } from 'components'
import { DASHBOARD_CIRCLES, DASHBOARD_HYPOTHESES, DASHBOARD_MODULES, SETTINGS_PERMISSIONS_GROUPS } from 'core/constants/routes'
import CircleSVG from 'core/assets/svg/circles-white.svg'
import ModuleSVG from 'core/assets/svg/modules.svg'
import MooveSVG from 'core/assets/svg/moove.svg'
import SettingsSVG from 'core/assets/svg/settings.svg'
import Styled from './styled'

const DashboardSidebar = () => (
  <Styled.Wrapper>
    <Sidebar.Item
      icon={<CircleSVG />}
      textId="general.circles"
      to={DASHBOARD_CIRCLES}
    />
    <Sidebar.Item
      icon={<MooveSVG />}
      textId="general.hypotheses"
      to={DASHBOARD_HYPOTHESES}
    />
    <Sidebar.Item
      icon={<ModuleSVG />}
      textId="general.modules"
      to={DASHBOARD_MODULES}
    />
    <Sidebar.Item
      icon={<SettingsSVG />}
      textId="general.settings"
      to={SETTINGS_PERMISSIONS_GROUPS}
    />
  </Styled.Wrapper>
)

export default DashboardSidebar
