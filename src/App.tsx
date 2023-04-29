import React, {useEffect, useState} from 'react';
import './App.css';
import {Capacitor} from '@capacitor/core';
import 'cordova-plugin-purchase';
import {DisplayPurchasableProduct} from "./store/DisplayPurchasableProduct";
import WebPaymentCard from "./components/WebPaymentCard";
import {DisplayPurchasedProduct} from "./store/DisplayPurchasedProduct";
import Box from "@mui/material/Box";

const androidProductId = "pwa_inapp_pro_9_99"
const appleProductId = "pwa_inapp_pro_0_99"

function App() {
    const [purchasableProducts, setPurchasableProducts] = useState<CdvPurchase.Product[]>([])
    const [productsOwned, setProductsOwned] = useState<Set<CdvPurchase.Product>>()

    const updatePurchases = (receipt: CdvPurchase.Receipt) => {
        let productsOwned = new Set<CdvPurchase.Product>();
        let productIdsOwned = new Set<string>();

        receipt.transactions.forEach(transaction => {
            transaction.products.forEach(trProduct => {
                console.log(`product owned: ${trProduct.id}`);
                const product = window.CdvPurchase.store.get(trProduct.id) as CdvPurchase.Product

                productsOwned.add(product)
                productIdsOwned.add(trProduct.id)
            });

            const productsAvailableToPurchase = purchasableProducts.filter(p => !productIdsOwned.has(p.id))
            setProductsOwned(productsOwned)
            setPurchasableProducts(productsAvailableToPurchase)
        });
    }

    const updateUI = (product: CdvPurchase.Product) => {
        console.log(`- title: ${product.title}`);
        const pricing = product.pricing;
        if (pricing) {
            console.log(`  price: ${pricing.price} ${pricing.currency}`);
        }
    }

    useEffect(() => {
        document.addEventListener("deviceready", () => {
            console.log("device ready event handler")
            if(! window.CdvPurchase || ! window.CdvPurchase.store) {
                console.log(`store object currently not available`)
                return;
            }

            console.log(`store object is available`)
            const {store, ProductType, Platform, LogLevel} = window.CdvPurchase;
            store.verbosity = LogLevel.DEBUG;

            store.register([
                {
                    type: ProductType.NON_CONSUMABLE,
                    id: androidProductId,
                    platform: Platform.GOOGLE_PLAY,
                },
                {
                    type: ProductType.NON_CONSUMABLE,
                    id: appleProductId,
                    platform: Platform.APPLE_APPSTORE,
                }
            ]);

            store.error((e: any) => {
                console.log('error', e);
            });

            store.when()
                .approved((transaction) => transaction.verify())
                .verified((receipt) => receipt.finish())
                .finished((transaction: {
                    products: any[];
                }) => console.log('Products owned: ' + transaction.products.map(p => p.id).join(',')))
                .receiptUpdated(r => updatePurchases(r))
                .productUpdated(p => updateUI(p));

            store.ready(() => {
                console.log('ready', store.products);
            });

            store.initialize([Platform.GOOGLE_PLAY, Platform.APPLE_APPSTORE])
                .then(() => {
                    console.log('all store products', store.products);
                    let purchasableProducts = store.products.filter(p => p.canPurchase);
                    console.log('all purchasable products', purchasableProducts);
                    setPurchasableProducts(purchasableProducts)
                    // getPurchasedProduct(productId).then(() => console.log("products fetched successfully"))
                });
        })

    }, [window.CdvPurchase])

    /*async function getPurchasedProduct(productId: string) {
        try {
            const products = store.products;
            // const product = result.products[0];
            // await CordovaPurchase.purchase(product);
            console.log(`products: ${products.join(';')}`);
        } catch (error) {
            console.error(error);
        }
    }*/

    const placeOrderOnNativeStore = (product: CdvPurchase.Product) => {
        console.log(`placing order for productId=${product.id}`)
        const offer = window.CdvPurchase.store.get(product.id, product.platform)?.getOffer();
        offer?.order()
            .then(result => {
                if (result) {
                    console.log("ERROR. Failed to place order. " + result.code + ": " + result.message);
                    // todo: show a pop-up to where they can submit a form to get contacted by us to collect payment.
                } else {
                    // todo: update db that the user has purchased item
                    console.log(`${product.title} with ${product.id} ordered successfully`);
                }
            })
    }
    console.log(`Native Platform? ${Capacitor.isNativePlatform()}`)

    function showOwnedProducts() {
        return <Box>
            {Array.from(productsOwned!.values()).map(p => {
                return <DisplayPurchasedProduct product={p}/>
            })}
        </Box>;
    }

    function showPurchasableProducts() {
        return <Box>
            {purchasableProducts
                .filter(p => p.canPurchase)
                .map(product => <DisplayPurchasableProduct product={product}
                                                           onClick={placeOrderOnNativeStore}/>)}
        </Box>;
    }

    function showWebPaymentMethod() {
        return <WebPaymentCard onClick={() => console.log("Sending to stripe")}/>;
    }

    return (
        <div className="App">
            <header className="App-header">
                {Capacitor.isNativePlatform() && <Box>
                    {productsOwned && showOwnedProducts()}
                    {purchasableProducts && showPurchasableProducts()}
                </Box>}
                {!Capacitor.isNativePlatform() && showWebPaymentMethod()}
            </header>
        </div>
    )
}

export default App;
