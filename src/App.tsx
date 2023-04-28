import React, {useEffect} from 'react';
import logo from './logo.svg';
import './App.css';
import {Capacitor, Plugins} from '@capacitor/core';
import 'cordova-plugin-purchase';
const {CdvPurchase} = Plugins;
const {store, ProductType, Platform, LogLevel} = CdvPurchase;

const productId = "pwa_inapp_pro_9_99"

function App() {

    useEffect(() => {
        document.addEventListener("deviceready", () => {
            store.verbosity = LogLevel.DEBUG;

            store.register([
                {
                    type: ProductType.NON_CONSUMABLE,
                    id: productId,
                    platform: Platform.GOOGLE_PLAY,
                },
                {
                    type: ProductType.NON_CONSUMABLE,
                    id: productId,
                    platform: Platform.APPLE_APPSTORE,
                }
            ]);

            store.error((e: any) => {
                console.log('error', e);
            });

            store.when()
                .approved((transaction: { verify: () => any; }) => transaction.verify())
                .verified((receipt: { finish: () => any; }) => receipt.finish())
                .finished((transaction: { products: any[]; }) => console.log('Products owned: ' + transaction.products.map(p => p.id).join(',')))
                //.receiptUpdated(r => updatePurchases(r))
                //.productUpdated(p => updateUI(p));

            store.ready(() => {
                console.log('ready', store.products);
            });

            store.initialize([Platform.GOOGLE_PLAY, Platform.APPLE_APPSTORE])
                .then(() => {
                    console.log('store is ready', store.products);
                    //setPurchasableProducts(store.products.filter(p => p.canPurchase))
                    console.log("fetching products")
                    getPurchasedProduct(productId).then(() => console.log("products fetched successfully"))
                });
        })

    }, [])
    async function getPurchasedProduct(productId: string) {
        try {
            const products = store.products;
            // const product = result.products[0];
            // await CordovaPurchase.purchase(product);
            console.log(`products: ${products.join(';')}`);
        } catch (error) {
            console.error(error);
        }
    }

    console.log(`Native Platform? ${Capacitor.isNativePlatform()}`)
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo"/>
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
            </header>
        </div>
    );
}

export default App;
