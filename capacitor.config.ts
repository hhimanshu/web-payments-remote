import {CapacitorConfig} from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: "com.bonsaiilabs.web_payments_remote",
    appName: "web-payments-remote",
    webDir: 'build',
    bundledWebRuntime: false,
    server: {
        "url": process.env.NODE_ENV === 'development' ? 'http://localhost:3000/' : "https://web-payments-khaki.vercel.app/"
    }
};

export default config;

// todo
// add in-ap purchase on Google Play Store
