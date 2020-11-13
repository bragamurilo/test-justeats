export default class Basket {

    constructor() {
        this.total = 0;
        this.totalPromos = 0;
        this.totalPayable = 0;
        this.basket = [];
    }

    calcTotalAddProduct(qty, price) {
        qty = parseInt(qty);
        price = parseFloat(price);
        return qty * price;
    }

    apllyPromo(promotion, qty, price) {
        let totalItem = 0;
        let promo = 0;

        promotion.map(p => {
            switch (p.type) {
                case 'QTY_BASED_PRICE_OVERRIDE':
                    if (qty >= p.required_qty) {
                        let oldTotalItem = price * qty;
                        totalItem = (p.price / p.required_qty) * qty;
                        this.totalPromos += oldTotalItem - totalItem;
                        this.totalPayable += totalItem;
                    } else {
                        this.totalPayable += this.calcTotalAddProduct(qty, price);
                    }
                    break;
                case 'BUY_X_GET_Y_FREE':
                    if (qty >= p.required_qty) {
                        let free = parseInt(qty / p.required_qty);
                        this.totalPromos += parseFloat((free * price).toFixed(2));
                    }
                    this.totalPayable += this.calcTotalAddProduct(qty, price);
                    break;
                case 'FLAT_PERCENT':
                    totalItem = this.calcTotalAddProduct(qty, price);
                    promo = parseFloat((totalItem * 0.10).toFixed(2));
                    totalItem = totalItem - promo;
                    this.totalPayable += totalItem;
                    this.totalPromos += promo;
                    break;
            }
        });
    }

    checkout() {
        this.total = 0;
        this.totalPromos = 0;
        this.totalPayable = 0;
    }
}