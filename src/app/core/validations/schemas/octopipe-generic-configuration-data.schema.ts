import { ValidationSchema } from 'class-validator'

export const OctopipeGenericConfigurationDataSchema: ValidationSchema = {

    name: 'octopipeGenericConfigurationDataSchema',

    properties: {
        gitProvider: [
            {
                type: 'isIn',
                constraints: [['GITHUB', 'GITLAB']],
                message: '$value is not valid. Supported providers are GITHUB and GITLAB'
            },
            {
                type: 'isNotEmpty'
            }
        ],
        gitToken: [{ type: 'isNotEmpty' }]
    }
}
