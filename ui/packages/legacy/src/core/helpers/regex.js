export const getRangeWords = (str = '', sufix = '', prefix = '') => {
  const [response] = str.trim()
    .match(/([A-Za-z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ, ]{50})|[A-Za-z0-9áàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ, ]+/gi) || ['']

  return `${prefix}${response}${sufix}`
}

export const removeHtmlTags = (str = '') => str.replace(/<(.|\n)*?>/gi, '')

export const removeAccents = (str = '') => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
