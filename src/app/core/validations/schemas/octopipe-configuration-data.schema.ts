import { ValidationSchema } from 'class-validator'

export const OctopipeConfigurationDataSchema: ValidationSchema = {

    name: 'octopipeConfigurationDataSchema',

    properties: {
        gitUsername: [{
            type: 'isNotEmpty'
        }],
        gitPassword: [{
            type: 'isNotEmpty'
        }],
        namespace: [{
            type: 'isNotEmpty'
        }]
    }
}
