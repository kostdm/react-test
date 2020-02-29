import {observable, computed, action} from 'mobx';


export default class{
    constructor(rootStore){
        this.rootStore = rootStore;
        this.api = this.rootStore.api.cart;
        this.storage = this.rootStore.storage;
        this.token = this.storage.getItem('cartToken');
    }

    @observable products = [];
    
    @observable process = {};

    @action addToProcess(id) {
        this.process[id] = true; 
    }

    @action removeFromProcess(id) {
        delete this.process[id];
    }

    @computed get productsDetailed(){
        return this.products.map((pr) => {
            let product = this.rootStore.products.getById(pr.id);
            return {...product, cnt: pr.cnt};
        });
    }

    @computed get inCart(){
        return (id) => this.products.some((product) => product.id === id);
    }

    @computed get cartCnt(){
        return this.products.length;
    }

    @computed get total(){
        return this.productsDetailed.reduce((t, pr) => {
            return t + pr.price * pr.cnt;
        }, 0);
    }

    @action load(){
        this.api.load(this.token).then((data) => {
            this.products = data.cart;
            
            if(data.needUpdate){
                this.token = data.token;
                this.storage.setItem('cartToken', this.token);
            }
        });
    }

    @action add(id){
        if (!(this.inCart(id) || id in this.process)) {
            this.addToProcess(id);
            this.api.add(this.token, id)
            .then((res) => {
                if(res){
                    this.products.push({id, cnt: 1});
                }
            })
            .finally(() => {
                this.removeFromProcess(id);
            });
        }
    }

    @action change(id, cnt){
        if (this.inCart(id) || !(id in this.process) ) {
            let index = this.products.findIndex((pr) => pr.id === id);

            if(index !== -1){
                this.addToProcess(id);
                this.api.change(this.token, id, cnt)
                .then((res) => {
                    if(res){
                        this.products[index].cnt = cnt;
                    }
                })
                .finally(() => {
                    this.removeFromProcess(id);
                });
            }
        }
    }

    @action remove(id){
        if (this.inCart(id) || !(id in this.process) ) {
            let index = this.products.findIndex((pr) => pr.id === id);

            if(index !== -1){
                this.addToProcess(id);
                this.api.remove(this.token, id)
                .then((res) => {
                    if(res){
                        this.products.splice(index, 1);
                        this.load(); // фикс без него - рассинхрон
                    }
                })
                .finally(() => {
                    this.removeFromProcess(id);
                });
            }
        }
    }

    @action clean(){
        return new Promise((accept, reject) => {
            this.api.clean(this.token).then((res) => {
                if(res){
                    this.products = [];
                    accept();
                } else {
                    reject('delete error');
                }
            });
        });
    }
}