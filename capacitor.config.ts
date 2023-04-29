import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: "com.bonsaiilabs.webpwapayments",
    appName: "PWA Builder In App Purchase",
    webDir: 'build',
    bundledWebRuntime: false,
    server: {
        //"url": process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : "https://web-payments-remote-hhimanshu.vercel.app/"
        "url": process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : "https://web-payments-remote-git-h2-apple-hhimanshu.vercel.app/"
    },
    plugins: {
        CordovaPurchase: {
            version: '13.4.0',
        },
    },
};

export default config;
