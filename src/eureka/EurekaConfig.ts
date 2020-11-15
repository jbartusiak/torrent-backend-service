import {Eureka} from 'eureka-js-client';

const applicationName = process.env.APPNAME;

const eurekaClient = new Eureka({
    instance: {
        app: 'torrent-backend-service',
        hostName: 'localhost',
        ipAddr: process.env.SERVER_HOST || 'localhost',
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
        host: process.env.SERVER_HOST || 'localhost',
        port: 8888,
        servicePath: '/eureka/apps',
    },
});

// eurekaClient.start();

export default eurekaClient;

