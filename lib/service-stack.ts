import {Stack} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {Runtime} from 'aws-cdk-lib/aws-lambda';

export class ServiceStack extends Stack {

    constructor(scope: Construct,
                id: string,
                properties: any) {
        super(scope, id, properties);

        new NodejsFunction(this, 'TestFunction', {
            runtime: Runtime.NODEJS_14_X,
            memorySize: 1024,
            awsSdkConnectionReuse: true,
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
                // dockerImage: DockerImage.fromRegistry('public.ecr.aws/lambda/nodejs:14-arm64'), //required for Graviton2 Architecture
                commandHooks: {
                    beforeBundling(): string[] {
                        return []
                    },
                    beforeInstall(): string[] {
                        return [
                            // 'npm update -g npm', //<<- this leads to error when building locally
                            'cd ./asset-input/',
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
