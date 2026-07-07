// ---------------- API URLs ----------------
var productListApiUrl = 'http://127.0.0.1:5000/getProducts';
var uomListApiUrl = 'http://127.0.0.1:5000/getUOM';
var productSaveApiUrl = 'http://127.0.0.1:5000/insertProduct';
var productDeleteApiUrl = 'http://127.0.0.1:5000/deleteProduct';
var orderListApiUrl = 'http://127.0.0.1:5000/getAllOrders';
var orderSaveApiUrl = 'http://127.0.0.1:5000/insertOrder';


// ---------------- API CALL FUNCTION ----------------
function callApi(method, url, data) {
    $.ajax({
        method: method,
        url: url,
        data: data
    })
    .done(function(response) {
        console.log(" API Success:", response);
        window.location.reload();
    })
    .fail(function(error) {
        console.error(" API Error:", error);
        alert("Something went wrong!");
    });
}


// ---------------- CALCULATE TOTAL ----------------
function calculateValue() {
    var total = 0;

    $(".product-item").each(function () {

        var qty = parseFloat($(this).find('.product-qty').val()) || 0;
        var price = parseFloat($(this).find('.product_price').val()) || 0;

        var itemTotal = qty * price;

        $(this).find('.item_total').val(itemTotal.toFixed(2));
        total += itemTotal;
    });

    $("#product_grand_total").val(total.toFixed(2));
}


// ---------------- ORDER PARSER ----------------
function orderParser(order) {
    return {
        id: order.order_id,
        date: order.datetime,
        orderNo: order.order_id,
        customerName: order.customer_name,
        cost: parseFloat(order.total)
    };
}


// ---------------- PRODUCT PARSER ----------------
function productParser(product) {
    return {
        id: product.product_id,
        name: product.name,
        unit: product.uom_name,
        price: parseFloat(product.price_per_unit)
    };
}


// ---------------- PRODUCT DROPDOWN PARSER ----------------
function productDropParser(product) {
    return {
        id: product.product_id,
        name: product.name
    };
}