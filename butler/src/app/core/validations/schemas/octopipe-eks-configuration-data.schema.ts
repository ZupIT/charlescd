import { ValidationSchema } from 'class-validator'

export const OctopipeEKSConfigurationDataSchema: ValidationSchema = {

    name: 'octopipeEKSConfigurationDataSchema',

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
