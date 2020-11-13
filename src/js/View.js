import Product from './Product';
import Basket from './Basket';
import Helper from './Helper';
import BasketImage from '../images/empty-basket.png';

export default class View {

    constructor() {
        this.Basket = new Basket();
        this.Product = new Product();

        const basketImg = new Image();
        basketImg.src = BasketImage;
        $('.empty-basket').append(basketImg);
    }

    buildListProducts(products = {}) {
        var productList = $('#product-list');
        productList.html('');
        products.map(function (p) {
            productList.append(`
                <div class="col-4">                            
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title">${p.name}</h5>
                            <h6 class="card-subtitle mb-2 text-muted">${Helper.FormatMoney(p.price)}</h6>
                        </div>
                        <div class="card-footer text-muted text-center">
                            <button class="btn btn-success btn-sm" data-toggle="modal" data-target="#modalAddProduct" data-product-id="${p.id}" data-product-name="${p.name}" data-product-price="${p.price}">
                                Add To Basket
                            </button>
                        </div>
                    </div>
                </div>
            `);
        });

        this.listenerAddItem();
    }

    listenerAddItem() {
        var self = this;
        $('#modalAddProduct').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var id = button.data('product-id');
            var name = button.data('product-name');
            var price = button.data('product-price');

            var modal = $(this);
            modal.find('.modal-title').text(name);
            modal.find('.price-product').text(Helper.FormatMoney(price));
            modal.find('#qtd').data('price', price);
            modal.find('input[name="id_product"').val(id);

            modal.find('#btn-total').text(`Add( ${Helper.FormatMoney(self.Basket.calcTotalAddProduct($('#qtd').val(), $('#qtd').data('price')))} )`);
        });

        $('#qtd').on('change', function () {
            $('#btn-total').text(`Add(${Helper.FormatMoney(self.Basket.calcTotalAddProduct($('#qtd').val(), $('#qtd').data('price')))} )`);
        });

        $('#modalAddProduct').on('hide.bs.modal', function (event) {
            var modal = $(this);
            modal.find('#qtd').data('price', 0);
            modal.find('#qtd').val(1);
        });

        $('#form-add-product').on('submit', event => {
            event.preventDefault();
            let id = $(event.currentTarget).find('input[name="id_product"').val();
            let qty = $(event.currentTarget).find('input[name="qty"').val();
            self.Product.getProduct(id).then(response => {
                const product = response;
                self.addProductToBasket(product, qty);
            }).catch(err => console.log(err));
        });
    }

    addProductToBasket(product, qty) {
        let totalItem = this.Basket.calcTotalAddProduct(qty, product.price);
        this.Basket.total += totalItem;

        // se o produto tiver promoção
        if (product.promotions.length > 0) {
            this.Basket.apllyPromo(product.promotions, qty, product.price)
        } else {
            this.Basket.totalPayable += totalItem;
        }

        let itemList = `
            <li class="list-group-item" data-list-id="${product.id}">
                <div class="row align-items-center">
                    <div class='col-7'>
                        
                        ${qty}x  <span class="mr-3">${product.name}</span>
                    </div>
                    <div class='col-5 text-right'>
                        <span class="price-product">${Helper.FormatMoney(totalItem)}</span>
                    </div>
                </div>                
            </li>
        `;

        $('.empty-basket').hide();
        $(".basket-list").append(itemList);
        this.addListTotalBasket();
        $('#modalAddProduct').modal('hide');
    }

    addListTotalBasket() {
        let self = this;

        if ($(".total-basket").length) {
            $(".total-basket").remove();
        }

        let itemList = `
            <li class="list-group-item total-basket">
                <div class="row align-items-center">
                    <div class='col'>
                        Total: 
                    </div>
                    <div class='col text-right'>
                        ${Helper.FormatMoney(this.Basket.total)}
                    </div>
                </div>

                <div class="row align-items-center">
                    <div class='col'>
                        Total Promos: 
                    </div>
                    <div class='col text-right'>
                        ${Helper.FormatMoney(this.Basket.totalPromos)}
                    </div>
                </div>

                <div class="row align-items-center">
                    <div class='col'>
                        Total Payable: 
                    </div>
                    <div class='col text-right'>
                        ${Helper.FormatMoney(this.Basket.totalPayable)}
                    </div>
                </div>

                <div class="row align-items-center">
                    <div class='col text-center'>
                        <button class="btn btn-success mt-4" id="checkout" data-toggle="modal" data-target="#modalCheckout">Checkout</button>
                    </div>
                </div>
            </li>
        `;

        $(".basket-list").append(itemList);

        $('#modalCheckout').on('show.bs.modal', function (event) {
            $('.total-order').text(Helper.FormatMoney(self.Basket.total));
            $('.total-saved').text(Helper.FormatMoney(self.Basket.totalPromos));
            $('.total-payable').text(Helper.FormatMoney(self.Basket.totalPayable));
        });

        // Add listener checkout
        $('#btn-new-order').on('click', event => {
            $(".basket-list").html('');
            $('.empty-basket').show();
            self.Basket.checkout();
            $('#modalCheckout').modal('hide');
        });
    }
}