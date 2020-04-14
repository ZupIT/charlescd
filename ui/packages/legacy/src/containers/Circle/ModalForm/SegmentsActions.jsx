import React from 'react'
import PropTypes from 'prop-types'
import { Toggle } from 'components'
import UploadSVG from 'core/assets/svg/upload.svg'
import LayersSVG from 'core/assets/svg/layers.svg'
import { COLORS } from 'core/assets/themes'
import { SEGMENTS_TYPE, MATCHER_TYPE } from './constants'
import Styled from './styled'

const SegmentsActions = ({
  segmentType, onClickCreateManually, onClickImportCSV, matcherType, isEditMode,
}) => (
  <Styled.Display margin="0 0 30px 0" enable>
    {
      (matcherType === MATCHER_TYPE.SIMPLE_KV || !isEditMode) && (
        <Toggle
          name="circle.segment.createManually"
          icon={<LayersSVG color={COLORS.COLOR_WHITE} />}
          color={COLORS.PRIMARY}
          onClick={onClickCreateManually}
          selected={segmentType === SEGMENTS_TYPE.MANUALLY}
        />
      )
    }
    <Toggle
      name="circle.segment.importCSV"
      icon={<UploadSVG />}
      color={COLORS.PRIMARY}
      onClick={onClickImportCSV}
      selected={segmentType === SEGMENTS_TYPE.IMPORT_CSV}
    />
  </Styled.Display>
)

SegmentsActions.defaultProps = {
  segmentType: null,
}

SegmentsActions.propTypes = {
  onClickCreateManually: PropTypes.func.isRequired,
  onClickImportCSV: PropTypes.func.isRequired,
  isEditMode: PropTypes.bool.isRequired,
  matcherType: PropTypes.oneOf([MATCHER_TYPE.REGULAR, MATCHER_TYPE.SIMPLE_KV]).isRequired,
  segmentType: PropTypes.oneOf(
    [SEGMENTS_TYPE.MANUALLY, SEGMENTS_TYPE.IMPORT_CSV],
  ),
}

export default SegmentsActions
