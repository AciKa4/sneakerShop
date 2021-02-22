
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

// //  contact stranica
// if(location.indexOf("index.html") != -1){
//     skrol();
//     strelicaUp();
//   
// }

// //  author stranica
// if(location.indexOf("index.html") != -1){
//     skrol();
//     strelicaUp();
//    
// }
//  cart stranica
// if(location.indexOf('cart') != -1) {

    
// }




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
});
callbackajax(baseurl + "brands.json","get",function(result){
    ispisBrendova(result);
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
    
    products = data;

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
                    <a href="#">Buy now</a>
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
                        <a href="#">Buy now</a>
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

    $('.brend').change(filterChange);
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
    localStorage.setItem("products", JSON.stringify(products));
    }

    else{
        if(!inLocaleStorage(products, id)) {
            addToLocaleStorage(id)
            }
            else {
                updatequantity(id);
            }
    }

         alert("Your item has been added to the cart!");       
    
}



//provera da li se proizvod vec nalazi u localstorage-u
function inLocaleStorage(products, id) {
    return products.find(p => p.id == id);
   }

//dodavanje proizvoda u localstorage
function addToLocaleStorage(id) {
    let products = anyInCart();

    products.push({
    id : id,
    quantity : 1
    })

    localStorage.setItem("products", JSON.stringify(products));
}




// $(document).ready(function() {

    // if(anyInCart()){
    //     $('#count').html(anyInCart().length);
//     }
//     });


//povecavanje kolicine proizvoda
function updatequantity(id){
    let products = anyInCart();
    products.forEach(el => {
        if(el.id == id)
            el.quantity++;
        });

    localStorage.setItem("products", JSON.stringify(products));
}

//funk proverava da li je prazan localstorage za proizvode
function anyInCart(){
    return JSON.parse(localStorage.getItem("products"));
}



$('#sortiranje').click(sortiraj);

//sortiranje  po ceni i imenu
function sortiraj(){
    var sortType = $('#sortiranje').val();
    var filtProizvodi = [];

    callbackajax(baseurl + "products.json","get",function(result){
        if(sortType == 'asc'){
            filtProizvodi = result.sort((a,b) => a.price.new > b.price.new ? 1 : -1)
        }
        else if(sortType == 'desc'){
            filtProizvodi = result.sort((a,b) => a.price.new < b.price.new ? 1 : -1)
        }
        else if(sortType == 'descbyName'){
            filtProizvodi = result.sort((a,b) => a.name > b.name ? 1 : -1)
        }
        else{
            filtProizvodi = result;
        }
        ispisProizvoda(filtProizvodi);
    });
}1



function filterChange(){

    let selectedBrands = [];
	$('.brend:checked').each(function(el){
		selectedBrands.push($(this).val());
	});
    
    callbackajax(baseurl + "products.json","get",function(result){
        if(selectedBrands.length != 0){
            var filter = [];
            filter = result.filter(x =>selectedBrands.includes(x.brand));	
            ispisProizvoda(filter);
        }
        else
            ispisProizvoda(result);
    });
}









});









