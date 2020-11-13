import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/app.css';

// Class's of project
import Product from './js/Product';
import View from './js/View';

const view = new View();
const produto = new Product();
const products = produto.loadListProducts();

products.then(response => {
    view.buildListProducts(response);
}).catch(err => console.log(err));

