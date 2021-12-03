import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {CodePipeline, CodePipelineSource, ShellStep} from 'aws-cdk-lib/pipelines';
import {Repository} from 'aws-cdk-lib/aws-codecommit';

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
            })
        })
    }
}
