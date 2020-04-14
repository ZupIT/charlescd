import React, { Fragment, useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ResumeComponent from 'components/Resume'
import { StyledResume } from './styled'

const Resume = (props) => {
  const { name, tags, children, disable, onChange, initial } = props
  const [resume, setResume] = useState(false)

  useEffect(() => {
    setResume(initial)

  }, [initial])

  const handleResume = (tag) => {
    if (!disable) {
      onChange && onChange(resume, tag)
      setResume(!resume)
    }
  }

  return (
    <Fragment>
      <StyledResume.Content disable={disable} display={resume}>
        <ResumeComponent name={name} tags={tags} onClick={handleResume} />
      </StyledResume.Content>
      <StyledResume.Content display={!resume}>
        {children(handleResume)}
      </StyledResume.Content>
    </Fragment>
  )
}

Resume.defaultProps = {
  tags: [],
  onChange: null,
  initial: false,
  disable: false,
}

Resume.propTypes = {
  tags: PropTypes.array,
  onChange: PropTypes.func,
  initial: PropTypes.bool,
  name: PropTypes.string.isRequired,
  children: PropTypes.func.isRequired,
  disable: PropTypes.bool,
}

export default Resume
