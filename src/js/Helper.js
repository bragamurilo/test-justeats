import Accounting from '../../node_modules/accounting/accounting';

export default class Helper {

    static FormatMoney(value) {
        return Accounting.formatMoney(value, {
            symbol: "£ ",
            thousand: ".",
            decimal: ",",
        });
    }


}