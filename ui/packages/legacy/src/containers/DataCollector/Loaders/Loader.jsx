import React from 'react'
import { StyledDataCollector } from '../styled'
import LoaderJsonData from './LoaderJsonData'
import LoaderSelect from './LoaderSelect'

const DataCollectorLoader = () => (
  <StyledDataCollector.JsonBoxContainer>
    <LoaderSelect />
    <StyledDataCollector.JsonContainer>
      <StyledDataCollector.SwitchLoadingContainer>
        <LoaderJsonData />
      </StyledDataCollector.SwitchLoadingContainer>
      <StyledDataCollector.ResumeLoadingContainer>
        <LoaderJsonData />
      </StyledDataCollector.ResumeLoadingContainer>
    </StyledDataCollector.JsonContainer>
  </StyledDataCollector.JsonBoxContainer>
)

export default DataCollectorLoader
