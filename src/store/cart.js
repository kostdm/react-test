import {observable, computed, action} from 'mobx';


export default class{
    constructor(rootStore){
        this.rootStore = rootStore;
        this.api = this.rootStore.api.cart;
        this.storage = this.rootStore.storage;
        this.token = this.storage.getItem('cartToken');
    }

    @observable products = [];
    

    @observable process = [];

    @action addToProcess(id) {
        this.process.push(id);
    }

    @action removeFromProcess(id) {
        this.process = this.process.filter(val => val !== id);
    }

    @computed get inProcess() {
        return (id) => this.process.some(item => item === id);
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
        this.addToProcess(id);
        this.api.add(this.token, id).then((res) => {
            if(res){
                this.products.push({id, cnt: 1});
                this.removeFromProcess(id);
            }
        });
    }

    @action change(id, cnt){
        this.addToProcess(id);
        let index = this.products.findIndex((pr) => pr.id === id);

        if(index !== -1){
            this.api.change(this.token, id, cnt).then((res) => {
                if(res){
                    this.products[index].cnt = cnt;
                    this.removeFromProcess(id);
                }
            });
        }
    }

    @action remove(id){
        this.addToProcess(id);
        let index = this.products.findIndex((pr) => pr.id === id);

        if(index !== -1){
            this.api.remove(this.token, id).then((res) => {
                if(res){
                    this.products.splice(index, 1);
                    this.removeFromProcess(id);
                }
            });
        }
    }

    @action clean(){
        this.api.clean(this.token).then((res) => {
            if(res){
                this.products = [];
            }
        });
    }
}











// server api
function getProducts(){
    return [
        {
            id: 100,
            title: 'Ipnone 200',
            price: 12000,
            rest: 10,
            current: 1
        },
        {
            id: 101,
            title: 'Samsung AAZ8',
            price: 22000,
            rest: 5,
            current: 1
        },
        {
            id: 103,
            title: 'Nokia 3310',
            price: 5000,
            rest: 2,
            current: 1
        },
        {
            id: 105,
            title: 'Huawei ZZ',
            price: 15000,
            rest: 8,
            current: 1
        }
    ];
}