import { ValidationSchema } from 'class-validator'

export const SpinnakerConfigurationDataSchema: ValidationSchema = {

    name: 'spinnakerConfigurationDataSchema',

    properties: {
        gitAccount: [{
            type: 'isNotEmpty'
        }],

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
