import { ValidationSchema } from 'class-validator'

export const SpinnakerConfigurationDataSchema: ValidationSchema = {

    name: 'spinnakerConfigurationDataSchema',

    properties: {
        account: [{
            type: 'isNotEmpty'
        }],
        namespace: [{
            type: 'isNotEmpty'
        }]
    }
}
