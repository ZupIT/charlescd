import React, { useState, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Toggle } from 'components'
import { COLORS } from 'core/assets/themes'
import UploadSVG from 'core/assets/svg/upload.svg'
import Styled from './styled'

const InputFile = React.forwardRef((props, ref) => {
  const { id, properties, name, ...rest } = props
  const [file, setFile] = useState()
  const [inputFileRef, setInputFileRef] = useState()

  const setRef = (_this) => {
    const refValue = ref ? (ref.current = _this) : _this
    setInputFileRef(refValue)
    properties(refValue)
  }

  const handleChange = (event) => {
    const selectedFile = event.target.files[0]
    setFile(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
    inputFileRef.value = ''
  }

  const renderInputFile = () => (
    <Styled.InputWrapper file={file}>
      <label htmlFor={id}>
        <Toggle
          name="circle.importCSV.chooseFile"
          icon={<UploadSVG color={COLORS.COLOR_WHITE} />}
          color={COLORS.PRIMARY}
          onClick={() => null}
        />
      </label>
      <Styled.Input
        {...rest}
        name={name}
        id={id}
        type="file"
        onChange={handleChange}
        ref={setRef}
      />
    </Styled.InputWrapper>
  )

  const renderResume = () => (
    <Styled.ResumeWrapper file={file}>
      <Styled.ResumeComponent name="File name" tags={[file?.name]} />
      <Styled.TrashIcon onClick={removeFile} />
    </Styled.ResumeWrapper>
  )

  return (
    <Fragment>
      { renderResume() }
      { renderInputFile() }
    </Fragment>
  )
})

InputFile.defaultProps = {
  id: 'file-upload',
}

InputFile.propTypes = {
  id: PropTypes.string,
  properties: PropTypes.func.isRequired,
}

export default InputFile
