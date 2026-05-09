var productPrices = {};

$(function () {

    // LOAD PRODUCTS
    $.get(productListApiUrl, function (response) {

        if(response) {

            var options = '<option value="">Select Product</option>';

            $.each(response, function(index, product) {

                options += '<option value="'+ product.product_id +'">'+ product.name +'</option>';

                productPrices[product.product_id] = product.price_per_unit;
            });

            $(".cart-product").html(options);
        }
    });

});


// ADD MORE ROW
$("#addMoreButton").click(function () {

    var row = `
    <div class="row product-item mb-3 text-center">

        <div class="col-md-4">
            <select class="form-control cart-product" name="product">
                <option value="">Select Product</option>
            </select>
        </div>

        <div class="col-md-2">
            <input type="text"
                   class="form-control product-price"
                   readonly>
        </div>

        <div class="col-md-2">
            <input type="number"
                   class="form-control product-qty"
                   name="qty"
                   value="1"
                   min="1">
        </div>

        <div class="col-md-2">
            <input type="text"
                   class="form-control product-total"
                   name="item_total"
                   readonly>
        </div>

        <div class="col-md-2">
            <button type="button"
                    class="btn btn-danger remove-row">
                Remove
            </button>
        </div>

    </div>
    `;

    $(".product-box-extra").append(row);

    // LOAD PRODUCTS IN NEW ROW
    var options = '<option value="">Select Product</option>';

    $.each(productPrices, function(id, price) {

        var productName = "";

        $(".cart-product:first option").each(function () {

            if($(this).val() == id) {
                productName = $(this).text();
            }

        });

        options += '<option value="'+ id +'">'+ productName +'</option>';

    });

    $(".cart-product:last").html(options);
});


// REMOVE ROW
$(document).on("click", ".remove-row", function () {

    $(this).closest('.product-item').remove();

    calculateValue();
});


// PRODUCT CHANGE
$(document).on("change", ".cart-product", function () {

    var product_id = $(this).val();

    var price = productPrices[product_id] || 0;

    var row = $(this).closest('.product-item');

    row.find(".product-price").val(price);

    calculateValue();
});


// QUANTITY CHANGE
$(document).on("keyup change", ".product-qty", function () {

    calculateValue();
});


// CALCULATE TOTAL
function calculateValue() {

    var grandTotal = 0;

    $(".product-item").each(function () {

        var price = parseFloat($(this).find(".product-price").val()) || 0;

        var qty = parseFloat($(this).find(".product-qty").val()) || 0;

        var total = price * qty;

        $(this).find(".product-total").val(total.toFixed(2));

        grandTotal += total;
    });

    $("#product_grand_total").val(grandTotal.toFixed(2));
}


// SAVE ORDER
$("#saveOrder").click(function () {

    var requestPayload = {
        customer_name: $('[name="customerName"]').val(),
        total: $("#product_grand_total").val(),
        order_details: []
    };

    $(".product-item").each(function () {

        var product_id = $(this).find(".cart-product").val();

        var quantity = $(this).find(".product-qty").val();

        var total_price = $(this).find(".product-total").val();

        if(product_id) {

            requestPayload.order_details.push({
                product_id: product_id,
                quantity: quantity,
                total_price: total_price
            });

        }

    });

    $.post(orderSaveApiUrl, {
        data: JSON.stringify(requestPayload)
    }, function(response) {

        alert("Order Saved Successfully!");

        location.reload();

    }).fail(function() {

        alert("Something went wrong!");

    });

});