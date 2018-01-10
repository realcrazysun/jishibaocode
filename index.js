/*
 * @Author: chao.gao 
 * @Date: 2017-12-27 18:26:37 
 * @Last Modified by: chao.gao
 * @Last Modified time: 2018-01-10 11:28:32
 */
const tool = require('./tool');
const request = require('request');
const uuidV1 = require('uuid/v1');

function sendRequest({
        method,
        url,
        AK = '1234',
        SK = '1234567'
    }
    , callback) {
    let uuid = uuidV1();
    let timestamp = Date.parse(new Date()) / 1000;
    let signStr = tool.getSignStr(method, url, timestamp, uuid);
    let signature = tool.getSignatureKey(SK, uuid, signStr);
    let options = {
        method,
        uri: url,
        headers: {
            'x-jsb-sdk-req-timestamp': timestamp,
            'x-jsb-sdk-req-uuid': uuid,
            'Authorization': `Credential=${AK},SignedHeaders=x-jsb-sdk-req-timestamp;x-jsb-sdk-req-uuid,Signature=${signature}`
        }
    }
    request(options, callback)
}

//调用测试
sendRequest({
    method: 'get',
    // url: 'http://120.55.246.87/JSB/rest/sign_test'
    url: 'http://120.55.246.87/JSB/rest/trade/TradesSoldGetRequest?fields=tid,type,status,payment,orders,rx_audit_status',
    AK:'1234567',
    SK:'111'
}, (error, result) => {
    console.log(result.body)
})