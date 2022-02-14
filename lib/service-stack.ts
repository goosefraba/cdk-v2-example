import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Architecture, Runtime } from 'aws-cdk-lib/aws-lambda';

export class ServiceStack extends Stack {

    constructor(scope: Construct,
                id: string,
                properties: any) {
        super(scope, id, properties);

        new NodejsFunction(this, 'TestFunction', {
            runtime: Runtime.NODEJS_14_X,
            memorySize: 1024,
            awsSdkConnectionReuse: true,
            architecture: Architecture.ARM_64,
            bundling: {
                externalModules: [
                    'aws-sdk'
                ],
                nodeModules: [],
                environment: {
                    NPM_TOKEN: properties.npmToken
                },
                forceDockerBundling: false,
                preCompilation: true,
                commandHooks: {
                    beforeBundling(): string[] {
                        return []
                    },
                    beforeInstall(): string[] {
                        return [
                            'cd ./asset-input/',
                            'npm --version',
                            'echo '//registry.npmjs.org/:_authToken=${NPM_TOKEN}' > .npmrc '
                        ];
                    },
                    afterBundling(): string[] {
                        return [];
                    }
                }
            },
            handler: 'test',
            entry: __dirname + '/../lambda/index.ts'
        });
    }
}
