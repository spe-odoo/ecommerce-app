import {stringToHtml} from './app.js';
import {Core} from './core.js';

export class Product_list extends Core{

    constructor() {
        super();
        this.add_to_cart_btn_dom = '';
        this.on_addtocartbtn_click_method = this.on_addtocartbtn_click.bind(this);
        this.products = '';
        this.render_meth = this.on_getdata.bind(this);
        this.on('productlister', this.render_meth)
    }

    on_getdata(data) {
        this.products = data;
        this.render();
    }

    render() {
       let products = this.products;
        let product_list_str = '';
           Object.keys(products).forEach(product => {
                let product_list_segment = `<div class="card-group">
                    <div class="card">
                        <img src="" alt="${product}" style="width:100%">
                        <div class="card-body">
                            <h1>${product}</h1>
                            <p class="product-price">${products[product]['price']}$</p>
                            <p class="product-name" >${products[product]['name']}</p>
                            <p><button class="add_to_cart_btn" id="add_to_cart_btn" data-product-id="${products[product]['id']}">Add to Cart</button></p>
                        </div>
                    </div>
            </div>`
            product_list_str += product_list_segment;
        });
        let product_list_dom = stringToHtml(product_list_str);
        this.add_to_cart_btn_dom = product_list_dom.querySelectorAll(".add_to_cart_btn");

        // Bind Operations
        let on_addtocartbtn_click_method = this.on_addtocartbtn_click_method;
        this.add_to_cart_btn_dom.forEach(add_to_cart_btn => {
            add_to_cart_btn.addEventListener("click", on_addtocartbtn_click_method)
        })
        this.trigger("product_dom",product_list_dom)
    }

    on_addtocartbtn_click(e) {
        e.preventDefault();
        let add_to_cart_btn = e.srcElement;
        let prod_id = add_to_cart_btn.dataset.productId;
        let data = {'prod_id':prod_id}

        add_to_cart_btn.innerHTML = "In Cart";
        add_to_cart_btn.disabled = true;

        fetch('/add_to_cart', {
            method:'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        })
        .then((response) => response.json())
        .then((data) => {
            console.log("data",data);
            let  add_to_cart_btn_dom = this.add_to_cart_btn_dom;
            this.trigger("cartfiller",[data,add_to_cart_btn_dom]);
        });
    }
}
