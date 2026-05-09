var productPrices = {};

$(function () {

    $.get(productListApiUrl, function (response) {

        productPrices = {};

        if(response) {
            var options = '<option value="">--Select--</option>';

            $.each(response, function(index, product) {

                options += '<option value="'+ product.product_id +'">'+ product.name +'</option>';

                productPrices[product.product_id] = product.price_per_unit;
            });

            $(".product-box select").html(options);
        }
    });
});


// ADD MORE ROW
$("#addMoreButton").click(function () {

    var row = $(".product-box").html();

    $(".product-box-extra").append(row);

    $(".product-box-extra .remove-row").last().removeClass('hideit');
    $(".product-box-extra .product-price").last().text('0.0');
    $(".product-box-extra .product-qty").last().val('1');
    $(".product-box-extra .product-total").last().text('0.0');
});


// REMOVE ROW
$(document).on("click", ".remove-row", function (){

    $(this).closest('.row').remove();
    calculateValue();
});


// SELECT PRODUCT
$(document).on("change", ".cart-product", function (){

    var product_id = $(this).val();

    var price = productPrices[product_id] || 0;   // ✅ FIX

    $(this).closest('.row').find('#product_price').val(price);

    calculateValue();
});


// CHANGE QTY
$(document).on("change", ".product-qty", function (){

    calculateValue();
});


// SAVE ORDER
$("#saveOrder").on("click", function(){

    var formData = $("form").serializeArray();

    var requestPayload = {
        customer_name: null,
        total: null,
        order_details: []
    };

    var lastElement = null;

    for(var i=0;i<formData.length;++i) {

        var element = formData[i];

        switch(element.name) {

            case 'customerName':
                requestPayload.customer_name = element.value;
                break;

            case 'product_grand_total':
                requestPayload.total = element.value;   // ✅ FIX
                break;

            case 'product':
                lastElement = {
                    product_id: element.value,
                    quantity: null,
                    total_price: null
                };
                requestPayload.order_details.push(lastElement);
                break;

            case 'qty':
                lastElement.quantity = element.value;
                break;

            case 'item_total':
                lastElement.total_price = element.value;
                break;
        }
    }

    callApi("POST", orderSaveApiUrl, {
        customer_name: requestPayload.customer_name,
        total: requestPayload.total,
        order_details: JSON.stringify(requestPayload.order_details)
    });   // ✅ FIX
});