const crypto = require('crypto');
const hexDigits = '0123456789abcdef'.split('')
let decodeLookup = []
let i = 0
while (i < 10) decodeLookup[0x30 + i] = i++
while (i < 16) decodeLookup[0x61 - 10 + i] = i++

function encode(array) {
  let length = array.length
  let string = ''
  let c, i = 0
  while (i < length) {
    c = array[i++]
    string += hexDigits[(c & 0xF0) >> 4] + hexDigits[c & 0xF]
  }
  return string
}

function decode(string) {
  let sizeof = string.length >> 1
  let length = sizeof << 1
  let array = new Uint8Array(sizeof)
  let n = 0
  let i = 0
  while (i < length) {
    array[n++] = decodeLookup[string.charCodeAt(i++)] << 4 | decodeLookup[string.charCodeAt(i++)]
  }
  return array
}
function HmacSHA256(data, key) {
  let hmac = crypto.createHmac('sha256', key);
  hmac.update(data, 'uft-8')
  let ret = hmac.digest('hex');
  return ret;
}
function SHA1(data) {
  let sha1 = crypto.createHash('sha1');
  sha1.update(data, 'utf8');
  let ret = sha1.digest('hex');
  return ret;
}

/**
 * 生成签名算法
 */
function getSignatureKey(key, reqId, strToSign) {
  let hexDigest = SHA1(strToSign);
  let kSecret = "JSB4" + key;
  let kReqid = HmacSHA256(reqId, kSecret);
  kReqid = decode(kReqid);
  let kSigning = HmacSHA256(hexDigest, kReqid);
  return kSigning;
}
/**
 * 生成签名字符串
 */
function getSignStr(method,url,timestamp,uuid){
  let methodStr = method.toUpperCase()+'\n';
  let urlStr = encodeURIComponent(url).toLowerCase()+'\n';
  let timestampStr = `x-jsb-sdk-req-timestamp:${timestamp}\n`;
  let uuidStr = `x-jsb-sdk-req-uuid:${uuid}\n`;
  return methodStr+urlStr+timestampStr+uuidStr;
}
module.exports = {
  getSignatureKey,
  getSignStr
}