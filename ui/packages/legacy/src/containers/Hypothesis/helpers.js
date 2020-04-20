import { getRangeWords, removeHtmlTags } from 'core/helpers/regex'

export const shortDescription = description => (
  getRangeWords(removeHtmlTags(description), '...')
)
