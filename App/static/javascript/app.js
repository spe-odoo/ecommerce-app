import {Search_bar} from './search.js';
import {Product_list} from './product_list.js';
import {Cart} from './cart.js';
import {Core} from './core.js';

export function stringToHtml(str) {
    let parser = new DOMParser();
    let htmlDoc = parser.parseFromString(str, 'text/html');
    return htmlDoc;
}

class App extends Core{

    constructor() {
        super();
        this.searchbar_obj = '';
        this.productlist_obj = '';
        this.cart_obj = '';
        this.template = `
                        <div id="root">
                            <div id="searchbar"></div>
                            <div id="productlist"></div>
                            <div id="cart"></div>
                            <div id="checkout_done"></div>
                        </div>`;

    }

    render(){

        let element = stringToHtml(this.template);
        let searchbar_div = element.getElementById('searchbar');
        let productlist_div = element.getElementById('productlist');
        let cart_div = element.getElementById('cart');
        let checkout_done_div = element.getElementById('checkout_done');

        // checkout done
        this.on("checkout_done", (msg) => {
            checkout_done_div.innerHTML = msg;
        })

        // cart
        let cart_obj = new Cart();
        cart_obj.on_getdata();
        this.on("cart_dom", (dom) => {
            cart_div.innerHTML = "";
            cart_div.appendChild(dom.documentElement);
        })

        // product list
        new Product_list();
        this.on("product_dom", (dom) =>{
            productlist_div.innerHTML = "";
            productlist_div.appendChild(dom.documentElement);
        })

        // search bar
        let searchbar_obj = new Search_bar();
        this.searchbar_obj = searchbar_obj;
        searchbar_div.appendChild(searchbar_obj.render().documentElement);

        return element.getElementById('root');
    }

}

let app = new App();

window.onload = () =>{
    let dom = app.render()
    let content = document.getElementById('content');
    content.appendChild(dom);
}
