import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: "com.bonsaiilabs.web_payments_remote",
    appName: "web-payments-remote",
    webDir: 'build',
    bundledWebRuntime: false,
    server: {
        "url": process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : "https://web-payments-remote-five.vercel.app/"
    },
    plugins: {
        CordovaPurchase: {
            version: '13.4.0',
        },
    },
};

export default config;
