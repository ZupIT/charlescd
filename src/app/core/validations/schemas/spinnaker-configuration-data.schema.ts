import { ValidationSchema } from 'class-validator'

export const SpinnakerConfigurationDataSchema: ValidationSchema = {

    name: 'spinnakerConfigurationDataSchema',

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
        account: [{
            type: 'isNotEmpty'
        }],
        namespace: [{
            type: 'isNotEmpty'
        }]
    }
}
