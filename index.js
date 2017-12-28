/*
 * @Author: chao.gao 
 * @Date: 2017-12-27 18:26:37 
 * @Last Modified by: chao.gao
 * @Last Modified time: 2017-12-28 14:08:30
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
    AK:'9a7494a14ab2c74d46499c0f1ac6456e667d10337271c59f835ade95e895087f',
    SK:'7c9e3286c6b6df9a7befcd93e886ec70b5449917d41357ab9109e7ddbfbeedd6'
}, (error, result) => {
    console.log(result.body)
})