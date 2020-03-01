import cartStore from './cart';
import productsStore from './products';
import orderStore from './order';
import notifyStore from './notify';

import * as products from '~/api/products';
import * as cart from '~/api/cart';

class RootStore{
    constructor(){
        this.api = {
            products,
            cart
        };

        this.storage = localStorage;

        this.cart = new cartStore(this);
        this.products = new productsStore(this);
        this.order = new orderStore(this);
        this.notify = new notifyStore(this);
    }    
}

export default new RootStore();