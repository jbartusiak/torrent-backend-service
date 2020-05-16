import {Eureka} from 'eureka-js-client';

const applicationName = process.env.APPNAME;

const eurekaClient = new Eureka({
    instance: {
        app: 'torrent-backend-service',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 3000,
            '@enabled': true,
        },
        vipAddress: 'jq.test.something.com',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        // eureka server host / port
        host: '192.168.0.254',
        port: 8888,
        servicePath: '/eureka/apps',
    },
});

// eurekaClient.start();

export default eurekaClient;

