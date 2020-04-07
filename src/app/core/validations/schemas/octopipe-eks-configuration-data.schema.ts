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
        caData: [{ type: 'isNotEmpty' }],
        awsSID: [{ type: 'isNotEmpty' }],
        awsSecret: [{ type: 'isNotEmpty' }],
        awsRegion: [{ type: 'isNotEmpty' }],
        awsClusterName: [{ type: 'isNotEmpty' }],
        gitToken: [{ type: 'isNotEmpty' }],
        namespace: [{ type: 'isNotEmpty' }]
    }
}
