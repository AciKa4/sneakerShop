
var baseurl = "assets/data/";

$(document).ready(function(){
  
let location = window.location.pathname;

mobileNav();

//  index stranica
if(location.indexOf("index.html") != -1){
    skrol();
    strelicaUp();
    
}
 //store stranica
if(location.indexOf("store.html") != -1){
    filterProizvodi();
}

//  store stranica
if(location.indexOf("store.html") != -1){
    $('#sortiranje').change(sortiraj);
    $('.cena').change(sortiraj)
}

 //cart stranica
if(location.indexOf('cart.html') != -1) {

    let products = anyInCart();
    check(products);
}
    
if(location.indexOf('contact.html'!= -1)){

    $('#form-submit').click(regButton);
}

function filterProizvodi(){
    $(".prikazFiltera").click(function(){
    $(this).find("i").toggleClass("fa fa-sort-down");
    $(this).find("i").toggleClass("fa fa-sort-up");
    $(this).next().slideToggle("slow");
    })
}
// ajax callback funkcija
function callbackajax(url,method,result){
    $.ajax({
        url:url,
        method:method,
        dataType:'json',
        success:result,
        error:function(xhr){
            console.log(xhr);
        }
    });
}

callbackajax(baseurl + "menu.json","get",function(result){
    ispisNav(result);
});

callbackajax(baseurl + "brandsIndex.json","get",function(result){
    ispisBrendovaPocetna(result);
});
callbackajax(baseurl + "products.json","get",function(result){
    ispisProizvoda(result);
    setItemToLS("allProducts",result);
});
callbackajax(baseurl + "brands.json","get",function(result){
    ispisBrendova(result);
});

});

function ispisNav(data){
    let ispis="";
    for(let obj of data){
        ispis+=`
        <li class="nav-link"><a href="${obj.href}" class="nav-item">${obj.name}</a></li>
        `;
    }
    $('.navisp').html(ispis);
}

function ispisBrendovaPocetna(data){
    let ispis ="";

    for(let i=0;i<data.length;i++){
        if( i%2 == 0){
            ispis+=`
            <div class="container-xl-lg bg-slika p-5 mt-3"> 
            <div class="container">
              <div class="row pt-5">
                <div class="col-xl-7 col-md-12 picpatike">
                  <img src="assets/img/${data[i].img.src}" alt="${data[i].img.alt}"/>
                </div>
                <div class="col-xl-5 col-md-12 tekstpatike pt-5">
                  <h1>${data[i].name}</h1>
                  <h2>${data[i].text}</h2>
                  <p>${data[i].description}</p>
                  <div class="buylink">
                    <a href="store.html">Buy now</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
            `;
        }
        else{
            ispis+=`
            <div class="container-xl-lg bg-slika1 p-5"> 
                <div class="container">
                <div class="row pt-5 justify-content-space-between">
                    <div class="col-xl-5 col-md-12 tekstpatikewhite pt-5">
                    <h1>${data[i].name}</h1>
                    <h2>${data[i].text}</h2>
                    <p>${data[i].description}</p>
                    <div class="buylink">
                        <a href="store.html">Buy now</a>
                    </div>
                </div>
                <div class="col-xl-7 col-md-12 picpatike">
                <img src="assets/img/${data[i].img.src}" alt="${data[i].img.alt}"/>
                </div>
            </div>
            </div>
            </div>
            `;
        }
    }
    $('#marke').html(ispis);
}

// ispis proizvoda
function ispisProizvoda(data){
    let ispis="";

    if(data.length != 0){
        for(let obj of data){
            ispis+=`
            <div class="col-5 col-md-3 mb-3 pt-2 product">
                <img src="assets/img/${obj.img.src}" alt="${obj.img.alt}" class="img-fluid frontpic">
                <img src="assets/img/${obj.img.hover}" alt="${obj.img.alt}" class="img-fluid backpic">
                <p class="border-bottom pb-3">${obj.name}</p>
                <div class="pt-2 pb-3 ">
                    <span class="red">${obj.price.new} $ </span><br>
                    <span><del>${obj.price.old} $ </del></span>
                    <div class="cart"> 
                        <button class="addToCart buylink" href="#" data-id="${obj.id}">Add to Cart</button>
                    </div>
                </div>
            </div>`;
        }
    }
    else 
    {
        ispis=`<h2 class="h3 m-auto my-3">No items match your search!</h2>`
    }
    $('#products').html(ispis);
    $(".addToCart").click(addToCart);
   
}

function ispisBrendova(data){
    let ispis="";

    for(let obj of data){
        ispis+=`<input type="checkbox" name="chbBrend" value="${obj.value}" class="brend"> <lab el=""> ${obj.name}<br>`
    }
    ispis+=`</lab></lab></lab></lab>`;
    $('.markaDva').html(ispis);

    $('.brend').click(sortiraj);
}


// responsive navigacija, strelica i skrol
function mobileNav(){  
    $(".meniResp li").hide();
    $('.hamb').click(function(){
     $(".meniResp li").stop().slideToggle('slow');
    });
}

function skrol(){
        $(window).scroll(function(){    
        var rootElement = document.documentElement;
        var strelica = document.querySelector(".up");
        if(document.body.scrollTop > 220 || rootElement.scrollTop > 220){
        strelica.style.display="block";
        }
        else{
        strelica.style.display="none";
        }
        });
}

function strelicaUp(){
        var strelica = document.querySelector(".up");
        strelica.addEventListener("click",function(){
            $("html, body").animate({ scrollTop: 0 }, "slow");
        });
}

//sortiranje  po ceni, firstnamenu i opsegu cene
var maxArray = [];
var minArray = [];

function sortiraj(){
    var filtProizvodi = [];
    var allProducts = getItemFromLS("allProducts");

    let selectedBrands = [];
    // po brendu
	$('.brend:checked').each(function(el){
		selectedBrands.push($(this).val()); 
	});

    if(selectedBrands.length != 0){
        filtProizvodi = allProducts.filter(x =>selectedBrands.includes(x.brand));	
    }
    else
        filtProizvodi = allProducts;


    //po ceni i firstnamenu
    var sortType = $('#sortiranje').val();
    if(sortType == 'asc'){
        filtProizvodi = filtProizvodi.sort((a,b) => a.price.new > b.price.new ? 1 : -1)
    }
    else if(sortType == 'desc'){
        filtProizvodi = filtProizvodi.sort((a,b) => a.price.new < b.price.new ? 1 : -1)
    }
    else if(sortType == 'descbyName'){
        filtProizvodi = filtProizvodi.sort((a,b) => a.name > b.name ? 1 : -1)
    }


    //po opseg cene 
    var pricemax = $(this).data('max');
    var pricemin = $(this).data('min');

    if($.inArray(pricemax,maxArray) != -1){
        maxArray = maxArray.filter(x => x != pricemax);
    }
    else{
        maxArray.push(pricemax);
    }

    if($.inArray(pricemin,minArray) != -1){
        minArray = minArray.filter(x => x != pricemin)
    }
    else{
        minArray.push(pricemin);
    }

    var cenaOpseg  = [];
    cenaOpseg = filtProizvodi;
   
    cenaOpseg = cenaOpseg.filter(x =>{
        if(minArray.length !=0 && maxArray.length !=0){
            for(let i=0; i<minArray.length;i++){
                for(let j=0; j<maxArray.length; j++){
                    if(x.price.new > minArray[i] && x.price.new < maxArray[j])
                        return true;
                }
            }
        }
        else{
            return true;
        }
    });

    if(cenaOpseg != 0){
        filtProizvodi = cenaOpseg;
    }
    
    if(minArray != 0 && maxArray != 0 && selectedBrands !=0 && cenaOpseg.length == 0){
       filtProizvodi = cenaOpseg;
    }

    ispisProizvoda(filtProizvodi);
}

// cart funckionalnost 
function addToCart(){

    var id = $(this).data('id');
    var products = anyInCart();

    if(!products){
        let products = [];
        products[0]={
           id:id,
           quantity:1
    };

    setItemToLS("products",products);  
    }

    else{
        if(!inLocalStorage(products, id)) {
            addToLocalStorage(id)
        }
        else{
            updatequantity(id);
        }
    }

    alert("Your item has been added to the cart!");       
}


//funk proverava da li je prazan localstorage za proizvode
function anyInCart(){
    return JSON.parse(localStorage.getItem("products"));
}

//provera da li se proizvod vec nalazi u localstorage-u
function inLocalStorage(products, id) {
    return products.find(p => p.id == id);
}

//dodavanje proizvoda u localstorage
function addToLocalStorage(id) {
    let products = anyInCart();

    products.push({
    id : id,
    quantity : 1
    });
    setItemToLS("products",products);
}

//funkcija za postavljanje localstorage-a
function setItemToLS(key,value){
    localStorage.setItem(key,JSON.stringify(value));
}

//funkcija za dohvatanje localstorage-a
function getItemFromLS(value){
    return JSON.parse(localStorage.getItem(value));
}

//povecavanje kolicine proizvoda
function updatequantity(id){
    let products = anyInCart();
    products.forEach(el => {
        if(el.id == id)
            el.quantity++;
        });
    setItemToLS("products",products);
}

// ubacivanje u korpu
function displayCart(){
    
    let ispis= `
    <div id="orderTable">
        <table class="tableAlign">
            <thead>
            <tr>
            <td>Product Name</td>
            <td>Image</td>
            <td>Price</td>
            <td>Quantity</td>
            <td>Sum</td>
            <td>Remove</td>
            </tr>
            </thead>`;

    let allProducts = getItemFromLS("allProducts");
    let products = getItemFromLS("products");

    allProducts = allProducts.filter(el => {
        for(let p of products){
            if(el.id == p.id) {
            el.quantity = p.quantity;
             return true;
        }
    }
    });

    for(let obj of allProducts){
        ispis+=`<tbody>
            <tr>
            <td><h5>${obj.name}</h5></td>
            <td>
                <img src="assets/img/${obj.img.src}" alt="${obj.img.alt}" class="img-fluid">
            </td>
            <td class="price">$${obj.price.new}</td>
            <td class="quantity">
                <input class="form-control quantityInput" type="number" value="${obj.quantity}">
            </td>
            <td class="productSum">${parseFloat(obj.price.new*obj.quantity)} $</td>
            <td>
                <button onclick ='removeItem(${obj.id})'class="btn btn-outline-danger btnRemove">Remove</button>
            </td>
        </tr>
        </tbody>
        `;
    }
    ispis+=` </table>
    </div>


   <div class="container">
        <div class="row d-flex justify-content-end" id="controls">
                <p id="totalSum" class="m-2">Total Sum:${sum(allProducts)}$</p>
                <button id="purchase" onclick ="buy()" class="btn btn-info m-2">Purchase</button>
                <button id="removeAll" onclick="removeAll()" class="btn btn-danger m-2">Remove All</button>
        </div>
    </div>`;
 
    $(".cartDiv").html(ispis);
}

// ukupna cena proizvoda - cena jednog*kolicina
function sum(data){
    let sum = 0;

    data.forEach(el =>{
        sum+=parseFloat(el.price.new*el.quantity);
    })
    return sum;
}

//provera za korpu, ukoliko je prazna ispisuje poruku, ukoliko nije pravi se tabela proizvoda
function check(productsInCart){
    if(productsInCart){
        if(productsInCart.length){
            displayCart();
            $(".quantityInput").change(quantityChange);
        }
        else
            showEmptyCart();
        
    }
    else
        showEmptyCart();  
}

//isprazniti korpu
function removeAll(){
    localStorage.removeItem("products");
    showEmptyCart();
}   
// izbrisati odredjeni proizvod iz korpe
function removeItem(id){
        let products = anyInCart();

        products = products.filter(x => x.id != id);

        setItemToLS("products",products);
        check(products);
}
// prilikom kupovine se prazni korpa i izbacuje poruka o uspesnoj kupovini proizvoda
function buy(){
    alert("Your order has been placed.");
    localStorage.removeItem("products");
    showEmptyCart();
}
//prazna korpa
function showEmptyCart() {
    $(".cartDiv").html("<div class='mx-auto d-flex w-75'><img class=' w-50 mx-auto' src='assets/img/emptycart.png' alt='Your cart is empty'></div><h1 class='py-3'>Your cart is empty</h1>")
}
   
// ukoliko se poveca/smanji kolicina jednog proizvoda azurira se cena za taj proizvod kao i ukupna cena svih proizvoda u korpi.
function update(){
    let productSum = document.querySelectorAll(".productSum");
    let price = document.querySelectorAll(".price");
    let quantitySum = document.querySelectorAll(".quantityInput");
    let totalSumforAll = document.querySelector("#totalSum");
    let totalSumForOne = 0;

    for(let i=0; i< price.length; i++){
        let priceone = price[i].innerHTML.replace('$','');

        productSum[i].innerHTML =  (Number(priceone)*Number(quantitySum[i].value)).toFixed(2) + "$";
    
        totalSumForOne += Number(priceone) * Number(quantitySum[i].value);  
    }

    totalSumforAll.innerHTML =  "Total Sum:" + parseFloat(totalSumForOne).toFixed(2) + "$";
}

// kolicina jednog proizvoda ne moze biti negativna i  poziva se funkcija update() koja menja cene, ukupnu i za proizvod.
function quantityChange(){
    if(this.value > 0 ) {
        update();
    } 
    else {
    this.value = 1;
    }
}
    

// regularni izrazi
function regButton(){
var email = $("#email");
var firstname = $("#firstname");
var lastname = $("#lastname");
var tel = $("#phone");
var valid = $("#forma");
var br = 0;

var emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
var telefonRegex = /^\d{8,13}$/;
var nameRegex =  /^[A-ZČĆŽŠĐ][a-zčćžš]{2,15}$/

// telefon
    

    if(tel.val() == ''){
        tel.css({
        'border':'1px solid  #e60000'
        });
        tel.val("");
        tel.attr('placeholder','Phone  can not be empty');
    }
    else if(!telefonRegex.test(tel.val())){
        tel.css({
        'border':'1px solid  #e60000'
        });
        tel.val("");
        tel.attr('placeholder','Please provide number between 8 and 13 digits');
    }
    else {
        tel.css({
        'border':'1px solid  #fff'
    });
    }
    //za text polje
    var tekstPolje =$("#message");
    var tekstValid = 0;

    if(tekstPolje.val() == ''){
        tekstPolje.css({
        'border':'1px solid  #e60000'
        });
        tekstPolje.val("");
        tekstPolje.attr('placeholder','You can not send empty message');
        tekstValid = 0;
    }
    else {
        tekstPolje.css({
        'border':'1px solid  #fff'
        });
        tekstValid = 1;
    }

    //za email 
    if(email.val() == ''){
        email.css({
        'border':'1px solid  #e60000'
        });
        email.val("");
        email.attr('placeholder','Email adress can not be empty');
    }
    else if(!emailRegex.test(email.val())){
        email.css({
        'border':'1px solid  #e60000'
        });
        email.val("");
        email.attr('placeholder','e.g. aleksandar14@gmail.com');
    }
    else {
        email.css({
        'border':'1px solid  #fff'
        });
        br++
    }
    //firstname 
    if(firstname.val() == ''){
        firstname.css({
        'border':'1px solid  #e60000'
        });
        firstname.val("");
        firstname.attr('placeholder','First name can not be empty');
    }

    else if(!nameRegex.test(firstname.val())){
        firstname.css({
        'border':'1px solid  #e60000'
        });
        firstname.val("");
        firstname.attr('placeholder','Please provide a valid first name, must be between 2-12 characters');
    }
    else {
    firstname.css({
        'border':'1px solid  #fff'
        });
        br++;
    }


    //lastname 
    if(lastname.val() == ''){
        lastname.css({
        'border':'1px solid  #e60000'
        });
        lastname.val("");
        lastname.attr('placeholder','Last name can not be empty');
    }

    else if(!nameRegex.test(lastname.val())){
        lastname.css({
        'border':'1px solid  #e60000'
        });
        lastname.val("");
        lastname.attr('placeholder','Please provide a valid last name, must be between 2-12 characters');
    }
    else {
        lastname.css({
        'border':'1px solid  #fff'
        });
        br++;
    }
 // Ukoliko nema gresaka, ispisuje poruku da je uspesno poslata poruka i poruka se upisuje u local storage
    if(br != 0 && tekstValid == 1){
        var message = getItemFromLS("message");
        if(!message){
            let message = [];
            message[0] = {
                name : firstname.val()+' ' + lastname.val(),
                email : email.val(),
                mess : tekstPolje.val(),
                phone : tel.val()
            }
            setItemToLS("message",message);
        }
        else{
            message = getItemFromLS("message");
            message.push({
                name : firstname.val()+' ' + lastname.val(),
                email : email.val(),
                mess : tekstPolje.val(),
                phone : tel.val()
            });
            setItemToLS("message",message);
        }

        valid.show();
        firstname.val("");
        firstname.attr('placeholder','Full name');
        lastname.val("");
        lastname.attr('placeholder','Full name');
        email.val("");
        email.attr('placeholder','Email');
        tekstPolje.val("");
        tekstPolje.attr('placeholder','Your message..');
        tel.val("");
        tel.attr('placeholder','Your phone number');

       
    }
    else{
        valid.hide();
    }

}













