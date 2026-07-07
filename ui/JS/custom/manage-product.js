var productListApiUrl = "http://127.0.0.1:5000/getProducts";
var productSaveApiUrl = "http://127.0.0.1:5000/insertProduct";
var productDeleteApiUrl = "http://127.0.0.1:5000/deleteProduct";
var productUpdateApiUrl = "http://127.0.0.1:5000/updateProduct";
var uomListApiUrl = "http://127.0.0.1:5000/getUOM";

$(function () {

    loadProducts();
    loadUOM();

});


/* ================= LOAD PRODUCTS ================= */

function loadProducts(){

    $.get(productListApiUrl, function(response){

        var table = '';

        $.each(response, function(index, product){

            table += `
                <tr>

                    <td>${product.name}</td>

                    <td>${product.uom_name}</td>

                    <td>${product.price_per_unit}</td>

                    <td>

                        <button class="btn btn-sm btn-primary editProduct"

                            data-id="${product.product_id}"
                            data-name="${product.name}"
                            data-uom="${product.uom_id}"
                            data-price="${product.price_per_unit}">

                            Edit

                        </button>

                        <button class="btn btn-sm btn-danger deleteProduct"

                            data-id="${product.product_id}">

                            Delete

                        </button>

                    </td>

                </tr>
            `;
        });

        $("#productTableBody").html(table);

    });

}


/* ================= LOAD UOM ================= */

function loadUOM(){

    $.get(uomListApiUrl, function(response){

        var options = '';

        $.each(response, function(index, uom){

            options += `
                <option value="${uom.uom_id}">
                    ${uom.uom_name}
                </option>
            `;
        });

        $("#uoms").html(options);

    });

}


/* ================= SAVE PRODUCT ================= */

$("#saveProduct").click(function(){

    var productId = $("#product_id").val();

    var requestData = {

        product_name: $("#name").val(),

        uom_id: $("#uoms").val(),

        price_per_unit: $("#price").val()
    };


    /* ===== UPDATE ===== */

    if(productId){

        requestData.product_id = productId;

        $.post(productUpdateApiUrl, requestData, function(response){

            alert("Product Updated Successfully");

            location.reload();

        });

    }

    /* ===== INSERT ===== */

    else{

        $.post(productSaveApiUrl, requestData, function(response){

            alert("Product Added Successfully");

            location.reload();

        });

    }

});


/* ================= DELETE PRODUCT ================= */

$(document).on("click", ".deleteProduct", function(){

    var productId = $(this).data("id");

    $.post(productDeleteApiUrl, {

        product_id: productId

    }, function(response){

        alert("Product Deleted Successfully");

        location.reload();

    });

});


/* ================= EDIT PRODUCT ================= */

$(document).on("click", ".editProduct", function(){

    $("#product_id").val($(this).data("id"));

    $("#name").val($(this).data("name"));

    $("#uoms").val($(this).data("uom"));

    $("#price").val($(this).data("price"));

    $("#productModal").modal("show");

});


/* ================= SEARCH ================= */

$("#searchProduct").on("keyup", function(){

    var value = $(this).val().toLowerCase();

    $("#productTableBody tr").filter(function(){

        $(this).toggle(

            $(this).text().toLowerCase().indexOf(value) > -1

        );

    });

});