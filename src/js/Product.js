const axios = require('axios');
import Basket from './Basket';

export default class Product {

    constructor() {
        this.products = {};
        this.Basket = new Basket();
    }

    loadListProducts() {
        const promise = axios.get('/api/products');
        // using .then, create a new promise which extracts the data
        const dataPromise = promise.then((response) => response.data);

        // return it
        return dataPromise;
    }

    getProduct(id) {
        const promise = axios.get(`/api/products/${id}`);
        // using .then, create a new promise which extracts the data
        const dataPromise = promise.then((response) => response.data);

        // return it
        return dataPromise;
    }


}