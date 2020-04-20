import React from 'react'
import map from 'lodash/map'
import isEmpty from 'lodash/isEmpty'
import filter from 'lodash/filter'
import { TYPES } from 'containers/Moove/constants'
import ReleaseButtonSVG from 'core/assets/svg/release-icon.svg'
import { ButtonExpanded } from 'components'
import ColumnHeader from './ColumnHeader'
import ColumnContent from './ContentColumn'
import DraggableCard from '../Draggables/Card'
import Styled from './styled'


const ReadyToGoColumn = ({ id, name, list, generateReleaseCandidate }) => (
  <Styled.Wrapper>
    <ColumnHeader id={name} list={list} />

    <ColumnContent
      id={id}
      type={name}
    >
      { map(list, (card, i) => <DraggableCard showActions key={i} {...card} index={i} />) }
    </ColumnContent>
    <Styled.ActionContent>
      <ButtonExpanded
        reversed
        icon={<ReleaseButtonSVG />}
        label="moove.button.generateRelease"
        disabled={isEmpty(filter(list, ({ type }) => type === TYPES.FEATURE))}
        onClick={() => generateReleaseCandidate(list)}
      />
    </Styled.ActionContent>
  </Styled.Wrapper>
)

export default ReadyToGoColumn
