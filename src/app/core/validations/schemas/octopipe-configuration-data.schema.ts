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
                constraints: [['GITHUB', 'GITLAB']],
                message: '$value is not valid. Supported providers are GITHUB and GITLAB'
            },
            {
                type: 'isNotEmpty'
            }
        ],
        k8sConfig: [{
            type: 'isNotEmpty'
        }],

        namespace: [{
            type: 'isNotEmpty'
        }]
    }
}
