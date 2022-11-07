import {stringToHtml} from './app.js';
import {Core} from './core.js';

export class Cart extends Core{

    constructor() {
        super();
        this.cart_dom = '';
        this.cart_total_dom = '';
        this.cart_all_prodId = '';
        this.data = '';
        this.render_meth = this.render.bind(this);
        this.plusbtn_method = this.on_plusbtn_click.bind(this);
        this.minusbtn_method = this.on_minusbtn_click.bind(this);
        this.removebtn_method = this.on_removebtn_click.bind(this);
        this.checkoutbtn_method = this.on_checkoutbtn_click.bind(this);

    }

    on_getdata() {
        this.on('cartfiller', this.render_meth)
    }

    render(items) {
        this.data = items
        let cart_items = this.data[0];

        let cart_html1 = `<div class="container bootstrap snippets bootdey">
                <div class="col-md-9 col-sm-8 content">
                    <div class="row">
                        <div class="col-md-12">
                        <h2> <center>Cart</center> </h2>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <div class="panel panel-info panel-shadow">
                                <div class="panel-body">
                                    <div class="table-responsive">
                                    <table class="table">
                                        <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Qty</th>
                                            <th>Price</th>
                                        </tr>
                                        </thead>
            `

        let cart_html3 = `
                        </table>
                        <div class="col-sm-12">
                            <h5 class="text-right"> <strong>Total:</strong> <span class="cart_item_total"></span></h4>
                        </div>
                        </div>
                        </div>
                        </div>
                        <button class="btn badge-dark pull-right" type="button" data-action="check-out">Checkout</button>
                    </div>
                </div>
            </div>
        </div>
            `

        let cart_html2 = ''
        Object.keys(cart_items).forEach(cart_item => {
            let cart_item_html=  `
                        <tbody class="cart-items">
                        <tr>
                            <td><input type="hidden" class="cart_product_id" value="${cart_items[cart_item]['product_id']}"/><p class="cart_item_name"><strong>${cart_items[cart_item]['name']}</strong></p></td>
                            <td>
                            <div class="input-group">
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-danger btn-number"  data-type="minus" data-action="decrease-item">
                                        <span class="fa fa-minus"></span>
                                    </button>
                                </span>
                                <input class="form-control input-number" id="prod_qty" type="text" value="${cart_items[cart_item]['quantity']}" min="1">
                                <span class="input-group-btn">
                                    <button type="button" class="btn btn-success btn-number" data-type="plus" data-action="increase-item">
                                        <span class="fa fa-plus"></span>
                                    </button>
                                </span>
                            </div>
                            </td>
                            <td><p class="cart_item_price">${cart_items[cart_item]['price']}$</p></td>
                            <td><button class="btn badge badge-danger" type="button" data-action="remove-item" data-product-id="${cart_items[cart_item]['product_id']}">&times;</td>
                        </tr>
                        </tbody>
            `
            cart_html2 += cart_item_html;
        })

       let cart_items_str = cart_html1 + cart_html2 + cart_html3;
       let cart_items_dom = stringToHtml(cart_items_str);
       this.cart_dom = cart_items_dom.documentElement;
       this.cart_total_dom = this.cart_dom.querySelector('.cart_item_total');
       this.cart_all_prodId = this.cart_dom.querySelectorAll('.cart_product_id');
       this.cart_total = 0;

       // Bind Operations
       let plusbtn_method = this.plusbtn_method;
       let minusbtn_method = this.minusbtn_method;
       let removebtn_method = this.removebtn_method;
       let checkoutbtn_method = this.checkoutbtn_method;

       let cartItems = this.cart_dom.querySelectorAll(".cart-items");
       cartItems.forEach(cartItem => {
            let base_price = cartItem.querySelector('.cart_item_price').innerText;
            this.cart_total += parseInt(cartItem.querySelector('.input-number').value) * parseFloat(base_price)
            this.cart_total_dom.innerText = this.cart_total.toFixed(2) + "$";
            cartItem.querySelector('[data-action="increase-item"]').addEventListener("click",(e) => {e.preventDefault(); plusbtn_method(cartItem);});
            cartItem.querySelector('[data-action="decrease-item"]').addEventListener("click",(e) => {e.preventDefault(); minusbtn_method(cartItem);});
            cartItem.querySelector('[data-action="remove-item"]').addEventListener("click",(e) => {e.preventDefault(); removebtn_method(cartItem);});
       })

       let checkout_dom = this.cart_dom.querySelector('[data-action="check-out"]');
       checkout_dom.addEventListener("click", checkoutbtn_method);

       this.trigger("cart_dom",cart_items_dom);
    }

    on_plusbtn_click(cartItem) {
        let data = this.data[0];
        Object.keys(data).forEach(dt => {
            if (data[dt]['name'] == cartItem.querySelector('.cart_item_name').innerText)
                {
                    let qty_input = cartItem.querySelector('.input-number')
                    let cart_item_price = cartItem.querySelector('.cart_item_price')
                    qty_input.value = parseInt(qty_input.value) + 1
                    cart_item_price.innerText = parseInt(qty_input.value) * parseFloat(data[dt]['price']) + "$";
                    this.cart_total = this.cart_total + parseFloat(data[dt]['price']);
                    this.cart_total_dom.innerText = this.cart_total.toFixed(2) + "$";
                }
            })
    }

    on_minusbtn_click(cartItem) {
        let data = this.data[0];
        Object.keys(data).forEach(dt => {
            if (data[dt]['name'] == cartItem.querySelector('.cart_item_name').innerText)
            {
                let qty_input = cartItem.querySelector('.input-number');
                let cart_item_price = cartItem.querySelector('.cart_item_price')
                let val = parseInt(qty_input.value);
                if (val >qty_input.min) {
                    qty_input.value = val - 1
                    cart_item_price.innerText = parseInt(qty_input.value) * parseFloat(data[dt]['price']) + "$";
                    this.cart_total = this.cart_total - parseFloat(data[dt]['price']);
                    this.cart_total_dom.innerText = this.cart_total.toFixed(2) + "$";
                }
            }
        }
        )
    }

    on_removebtn_click(cartItem) {
        let data = this.data[0];
        let add_to_cart_btn_dom = this.data[1];
        Object.keys(data).forEach(dt => {
            if (data[dt]['name'] == cartItem.querySelector('.cart_item_name').innerText)
            {
                this.cart_total = this.cart_total - parseFloat(cartItem.querySelector(".cart_item_price").innerText);
                this.cart_total_dom.innerText = this.cart_total.toFixed(2) + "$";
                cartItem.remove();
                let prod_id = cartItem.querySelector('[data-action="remove-item"]').dataset.productId;
                let data = {'prod_id':prod_id}
                add_to_cart_btn_dom.forEach(add_to_cart_btn => {
                    if (add_to_cart_btn.dataset.productId == prod_id){
                        add_to_cart_btn.innerHTML = "Add to cart";
                        add_to_cart_btn.disabled = false;
                    }
                })
                fetch('/remove_item',{
                    method:'POST',
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify(data)
                  });
            }
        })
    }

    on_checkoutbtn_click(e){
        // Checkout cart
        e.preventDefault();
        let add_to_cart_btn_dom = this.data[1];
        let products = [];
        let product_ids = this.cart_all_prodId;

        product_ids.forEach(product_id => {
            products.push(product_id.value)
        })

            add_to_cart_btn_dom.forEach(add_to_cart_btn => {
                if (products.includes(add_to_cart_btn.dataset.productId)) {
                    add_to_cart_btn.innerHTML = "Add to cart";
                    add_to_cart_btn.disabled = false;
                }
                })

        fetch('/checkout', {
            method:'POST',
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({'product_ids' : products})
        })
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            this.cart_dom.innerHTML = "";
            this.trigger("checkout_done",data['cart-clear'])
        })
    }
}
