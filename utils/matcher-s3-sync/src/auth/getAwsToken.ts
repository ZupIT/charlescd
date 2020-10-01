import { CredentialProviderChain, config } from 'aws-sdk'

const getAwsCredentials = (): void => {
  const authProvider = new CredentialProviderChain()

  authProvider.resolve((err, credentials) => {
    if (err) {
      console.log('Error to get cretentials from web token', err)
    }
    config.credentials = credentials
  })
}

export default getAwsCredentials
