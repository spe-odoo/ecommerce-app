import {stringToHtml} from './app.js';
import {Core} from './core.js';

export class Search_bar extends Core {

    constructor() {
        super();
        this.search_res_div = '';
        this.prod_srch = '';
        this.on_search_click_method = this.on_search_click.bind(this);
    }

    render() {

        let search_bar_str = `
            <input type='text' placeholder='Search..' name='prod_srch' id="prod_srch"><span>
            <input type = 'Submit' id="search_btn"></span>
            <div id="search_res">
            </div>
       `
       let search_bar_dom = stringToHtml(search_bar_str);
       let searchbtn = search_bar_dom.getElementById('search_btn');
       this.search_res_div = search_bar_dom.getElementById('search_res');
       this.prod_srch = search_bar_dom.getElementById('prod_srch');

       // Bind Operations
       let on_search_click_method = this.on_search_click_method;
       searchbtn.addEventListener("click", on_search_click_method);

       this.getProducts();
       return search_bar_dom;
    }

    getProducts(method = 'GET', data = undefined) {
        if (method == 'POST') {
            fetch('/search',{
                method:'POST',
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(data)
            }).then((response) => (response.json()))
            .then((data) => {
                console.log(data);
                this.trigger("productlister",data);
                });
        }
        else{
            fetch('/search')
            .then((response) => (response.json()))
            .then((data) => {
                console.log(data);
                this.trigger("productlister",data);
                });
        }
    }

    on_search_click(e) {
            e.preventDefault();
            this.search_res_div.innerHTML = '';
            let input_data = this.prod_srch.value;

            let data = {
                'name' : input_data
            }
            if (input_data != ""){
                this.getProducts('POST', data);
            }
            else {
                this.getProducts();
            }
    }
}
