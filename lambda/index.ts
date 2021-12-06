import {ResponseUtil} from '@appointmed/appointmed-lambda-common/src/util/ResponseUtil';

exports.test = async (event: any,
                      context: any) => {
    console.log(event);

    return {
        status: 200,
        body: 'Hello world',
        headers: [ResponseUtil.requestIdToHeader(context)]
    };
};
