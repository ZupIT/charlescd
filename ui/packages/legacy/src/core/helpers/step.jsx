import { useState } from 'react'
import reduce from 'lodash/reduce'
import indexOf from 'lodash/indexOf'
import lastIndexOf from 'lodash/lastIndexOf'
import values from 'lodash/values'

const FIRST_ELEMENT = 0
const ONE = 1

function getIndexByName(steps, stepName) {
  const index = indexOf(steps, stepName)

  return index >= FIRST_ELEMENT ? index : FIRST_ELEMENT
}

function mountStep(steps, activeStep) {
  const TARGET_STEP = getIndexByName(steps, activeStep)

  return reduce(steps, (result, value, key) => {
    result[value] = (key <= TARGET_STEP)

    return result
  }, {})
}

function useStep(steps = [], initialStep) {
  const LAST_INDEX = (steps.length - ONE)
  const [step, setStep] = useState(mountStep(steps, initialStep))

  const stepHandler = {
    go: (stepName, force = false) => {
      if (!step[stepName] || force) {
        setStep(mountStep(steps, stepName))
      }
    },
    next: () => {
      const current = lastIndexOf(values(step), true)
      const nextIndex = (LAST_INDEX === current) ? current : (current + ONE)

      setStep(mountStep(steps, steps[nextIndex]))
    },
    prev: () => {
      const current = lastIndexOf(values(step), true)
      const prevIndex = (FIRST_ELEMENT === current) ? current : (current - ONE)

      setStep(mountStep(steps, steps[prevIndex]))
    },
  }

  return {
    step,
    stepHandler,
  }

}

export default useStep
