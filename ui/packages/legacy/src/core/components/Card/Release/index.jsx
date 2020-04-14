import React, { useState } from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'
import flatMap from 'lodash/flatMap'
import { Badge } from 'components'
import GitSVG from 'core/assets/svg/git.svg'
import Styled from './styled'

const CardRelease = (props) => {
  const { icon, status, action, body, content, footer, onClick } = props
  const [display, toggleDisplay] = useState(false)

  const getBranchByModuleName = name => content?.branches?.find(branch => branch.includes(name))

  const openRepository = (moduleName) => {
    const branchLink = getBranchByModuleName(moduleName)
    window.open(branchLink, '_blank_')
  }

  const renderModule = ({ id, name }) => (
    <Styled.Item
      key={id}
      onClick={() => openRepository(name)}
    >
      <GitSVG /> { name }
    </Styled.Item>
  )

  const renderModules = modules => modules?.map(module => renderModule(module))

  const renderFeatures = () => {
    const modules = flatMap(content, feature => feature.modules)

    return renderModules(uniqBy(modules, module => module.name))
  }

  return (
    <Styled.Card
      status={status}
      header={(
        <Styled.Header
          onClick={() => toggleDisplay(!display)}
          hasAction={action}
        >
          { icon }
          { status && <Badge status={status} /> }
          { action }
        </Styled.Header>
      )}
      body={(
        <Styled.Body onClick={onClick}>
          { body }
          { content && (
            <Styled.Content display={display}>
              { renderFeatures() }
            </Styled.Content>
          )}
        </Styled.Body>
      )}
      footer={(
        <Styled.Footer>
          { footer }
        </Styled.Footer>
      )}
    />
  )
}

CardRelease.propTypes = {
  icon: PropTypes.node.isRequired,
  status: PropTypes.string,
  action: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  content: PropTypes.array,
  body: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  footer: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
}

CardRelease.defaultProps = {
  status: null,
  action: null,
  content: null,
  body: <></>,
  footer: <></>,
}

export default CardRelease
