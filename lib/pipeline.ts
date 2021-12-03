import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import {Repository} from 'aws-cdk-lib/aws-codecommit';
import {Effect, PolicyStatement} from 'aws-cdk-lib/aws-iam';
import {ServiceStage} from './service-stage';

// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class Pipeline extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const pipeline = new CodePipeline(this, 'Pipeline', {
            pipelineName: 'cdk-v2-service',
            synth: new ShellStep('Synth', {
                input: CodePipelineSource.codeCommit(Repository.fromRepositoryName(this, 'CodeRepository', 'cdk-v2-service'), 'master'),
                installCommands: [
                    'npm i -g npm && npm install -g typescript@4.0.2 && npm install -g tslint@5.5.0 && npm ci'
                ],
                commands: [
                    'npx run lint',
                    'npx run build',
                    'npx cdk synth'
                ]
            }),
            // synthCodeBuildDefaults: {
            //     buildEnvironment: {
            //         computeType: ComputeType.SMALL,
            //         privileged: true,
            //         buildImage: {
            //             imageId: '',
            //             defaultComputeType: ComputeType.SMALL,
            //         }
            //     }
            //     DockerImage.fromRegistry('public.ecr.aws/lambda/nodejs:14-arm64')
            // }
        });

        pipeline.addStage(new ServiceStage(this, 'ServiceStage', {}));

        pipeline.buildPipeline();

        pipeline.pipeline.addToRolePolicy(
            new PolicyStatement({
                sid: 'ssm',
                effect: Effect.ALLOW,
                actions: [
                    'ssm:GetParameter'
                ],
                resources: [
                    `arn:aws:ssm:${this.region}:${this.account}:parameter/*`,
                ]
            })
        );
    }
}
