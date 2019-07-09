import Octokit from "@octokit/rest"

export default (auth, owner, repo, path) => {
  const client = new Octokit({
    auth
  })

  const contents = client.repos.getContents({
    owner,
    repo,
    path
  })
  .then((result) => {
    return result.data
  })
  .catch((err) => {
    console.log(err)
  })
  return contents
}