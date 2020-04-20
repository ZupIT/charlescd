import React from 'react'
import Translate from 'components/Translate'

export const regex = {
  validName: /(?=^\S*$)(?=\b[a-z])(?=[a-zA-Z0-9]*$)/,
  valiUrlFile: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/,
  integer: /(?=\s|^)\d+(?=\s|$)/,
}

export const required = value => value ? undefined : <Translate id="validate.required" />
