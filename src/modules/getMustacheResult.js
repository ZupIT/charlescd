import GetAllRepoContent from './getAllRepoContent'
import Mustache from 'mustache'
import map from 'lodash/map'
import yaml from 'js-yaml'

Mustache.escape = function (text) { return text; }

export default async (auth, owner, repo, path, view) => {
  const allTemplates = await GetAllRepoContent(auth, owner, repo, path)
  const compileFiles = map(allTemplates, (template) => {
    const result = Mustache.render(template, view)
    const finalJson = []
    yaml.safeLoadAll(result, (teste) => {
      if (teste) {
        finalJson.push(teste)
      }
    })
    return finalJson.length > 1 ? finalJson : finalJson[0]
  })
  return compileFiles
}