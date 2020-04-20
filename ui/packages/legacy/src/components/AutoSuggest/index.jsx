import React from 'react'
import PropTypes from 'prop-types'
import ReactAutoSuggest from 'react-autosuggest'
import Styled from './styled'

const AutoSuggest = props => (
  <Styled.Wrapper>
    <ReactAutoSuggest
      {...props}
    />
  </Styled.Wrapper>
)

AutoSuggest.propTypes = {
  suggestions: PropTypes.array.isRequired,
  onSuggestionsFetchRequested: PropTypes.func.isRequired,
  onSuggestionsClearRequested: PropTypes.func.isRequired,
  getSuggestionValue: PropTypes.func.isRequired,
  renderSuggestion: PropTypes.func.isRequired,
  inputProps: PropTypes.object.isRequired,
}

export default AutoSuggest
