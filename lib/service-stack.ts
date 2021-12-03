import {Stack} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Topic} from 'aws-cdk-lib/aws-sns';

export class ServiceStack extends Stack {

    constructor(scope: Construct,
                id: string,
                properties: any) {
        super(scope, id, properties);

        new Topic(this, 'cdkv2topic', {
            topicName: 'cdk-v2-test-topic'
        });
    }
}
