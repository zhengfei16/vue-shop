/**
 * 接口控制列表
 */

import common from "./common";

let lvsessionid,
    appKey,
    userid,
    sign,
    agent = navigator.userAgent,
    timestamp;

// 本地测试
let isLocal = false;

timestamp = isLocal ? '123456789' : new Date().getTime();
 
let secret;
if(agent.indexOf('fangzhen')!=-1){
    secret='7ac4e884c99fcc5cd303d8b3e8ab3f94';//仿真
}else {
    
    secret='2de70ec7107a7ff37ab87a5ef1107e49';
    
}
sign = isLocal ? '099dfb06801d398aeae73f405f3f9fdf' : md5.createHash(secret+timestamp+secret);


const Host = "https://m.yobab2b.com";
// const Host = "http://10.200.5.140:15718";
// const Host = "http://10.112.3.138:8010";
export default {
     
}