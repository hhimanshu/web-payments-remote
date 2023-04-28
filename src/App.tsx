import React from 'react';
import logo from './logo.svg';
import './App.css';
import {Capacitor, Plugins} from '@capacitor/core';

const {CordovaPurchase} = Plugins;

const productId = "pwa_inapp_pro_9_99"

function App() {
    async function getPurchasedProduct(productId: string) {
        try {
            const products = await CordovaPurchase.getProducts([productId]);
            // const product = result.products[0];
            // await CordovaPurchase.purchase(product);
            console.log(`products: ${products.join(';')}`);
        } catch (error) {
            console.error(error);
        }
    }

    if (Capacitor.isNativePlatform()) {
        console.log("fetching products")
        getPurchasedProduct(productId).then(() => console.log("products fetched successfully"))
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
