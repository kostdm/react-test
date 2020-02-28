import {observable, computed, action} from 'mobx';

export default class{
    constructor(rootStore){
        this.rootStore = rootStore;
    }

    @observable formData = {
        name: {
            value: '',
            label: 'Name',
            validator: val => /^[aA-zZ ]{2,}$/.test(val),
            errorText: 'Латинские символы, не менее двух',
            valid: null
        },
        phone: {
            value: '',
            label: 'Phone',
            validator: val => /^[0-9]{7,15}$/.test(val),
            errorText: 'От 7 до 15 цифр',
            valid: null
        },
        email: {
            value: '',
            label: 'Email',
            validator: val => /^.+@.+$/.test(val),
            errorText: 'Собака',
            valid: null
        }
    }

    lastOrderCache = {}

    @computed get formValid(){
        return Object.values(this.formData).every(field => field.valid);
    }

    @computed get data(){
        let data = {};

        for(let name in this.formData){
            data[name] = this.formData[name].value;
        }

        return data;
    }

    @computed get clean(){
        for(let name in this.formData){
            this.formData[name].value = '';
            this.formData[name].valid = null;
        }
    }

    @action change(key, value){
        let field = this.formData[key];
        field.value = value;
        field.valid = field.validator(field.value);
    }

    addOrder(){
        return new Promise((resolve, reject) => {
            this.lastOrderCache['cart'] = JSON.parse(JSON.stringify(this.rootStore.cart.productsDetailed));
            this.lastOrderCache['total'] = this.rootStore.cart.total;
            this.lastOrderCache['user'] = JSON.parse(JSON.stringify(this.data));
            resolve();
        });
    }
}