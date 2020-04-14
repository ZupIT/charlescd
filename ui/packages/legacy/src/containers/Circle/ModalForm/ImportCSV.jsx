import React from 'react'
import PropTypes from 'prop-types'
import { useForm } from 'react-hook-form'
import { Translate, Button, InputFile } from 'components'
import { Input } from 'components/FormV2/Input'
import Styled from './styled'
import ProgessBar from './ProgessBar'

const inputFileName = 'file'
const formID = 'importCSV'
const maxPercent = 100

const ImportCSV = ({ onBack, onSave, uploadProgress, isUploading }) => {
  const { register, handleSubmit } = useForm()

  const handleSave = ({ file, ...rest }) => {
    const data = {
      ...rest,
      [inputFileName]: file[0],
    }
    onSave(data)
  }

  const renderForm = () => (
    <Styled.FormImportCSV
      onSubmit={handleSubmit(handleSave)}
      id={formID}
      isUploading={isUploading}
    >
      <small><Translate id="circle.importCSV.labelInputKey" /></small>
      <Styled.Display margin="10px 0 20px 0" enable>
        <Styled.Prefix>key</Styled.Prefix>
        <Input
          type="text"
          name="keyName"
          autoComplete="off"
          properties={register({ required: true })}
        />
      </Styled.Display>
      <small> <Translate id="circle.importCSV.labelInputFile" /></small>
      <Styled.Display margin="0 0 30px 0" enable>
        <InputFile
          properties={register({ required: true })}
          name={inputFileName}
        />
      </Styled.Display>
    </Styled.FormImportCSV>
  )

  const renderUploadProgress = () => (
    <>
      { isUploading && uploadProgress < maxPercent && (
        <ProgessBar percentage={uploadProgress} />
      )}
      { isUploading && uploadProgress === maxPercent && (
        <p>
          <small><Translate id="circle.importCSV.finalizingImport" /></small>
        </p>
      )}
    </>
  )

  return (
    <Styled.AddReleaseWrapper>
      <Styled.ArrowBack onClick={() => !isUploading && onBack()} />
      <Styled.Title primary text="circle.importCSV.title" />
      <small><Translate id="circle.importCSV.subTitle" /></small>
      <Styled.StepByStepImportCSV />
      { renderForm() }
      { renderUploadProgress() }
      <Button type="submit" margin="0 0 50px 0" disabled={isUploading} form={formID}>
        <Translate id="general.save" />
      </Button>
    </Styled.AddReleaseWrapper>
  )
}

ImportCSV.propTypes = {
  onBack: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  uploadProgress: PropTypes.number.isRequired,
  isUploading: PropTypes.bool.isRequired,
}

export default ImportCSV
