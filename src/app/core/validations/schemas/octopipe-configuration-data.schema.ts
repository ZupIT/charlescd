import { ValidationSchema } from 'class-validator'

export const OctopipeConfigurationDataSchema: ValidationSchema = {

    name: 'octopipeConfigurationDataSchema',

    properties: {
        gitToken: [{
            type: 'isNotEmpty'
        }],
        gitProvider: [
            {
                type: 'isIn',
                constraints: [['github', 'gitlab']],
                message: '$value is not valid. Supported providers are github and gitlab'
            },
            {
                type: 'isNotEmpty'
            }
        ],
        url: [{
            type: 'isNotEmpty'
        }],

        namespace: [{
            type: 'isNotEmpty'
        }]
    }
}
