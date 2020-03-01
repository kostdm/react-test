import {observable, computed, action} from 'mobx';

export default class{
    constructor(rootStore){
        this.rootStore = rootStore;
    }

    @observable messages = {};
    @observable _id = 0;

    @action add(text, type = 'warning', time = 5000){
        this.messages[++this._id] = {
            text,
            type,
            time
        };

        const remove = this.remove.bind(this, this._id);

        setTimeout(remove, time);
    }

    @action remove(id){
        delete this.messages[id];
    }

}