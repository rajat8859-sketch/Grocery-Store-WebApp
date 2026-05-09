var productModal = $("#productModal");

$(function () {

    $.get(productListApiUrl, function (response) {
        if(response) {
            var table = '';

            $.each(response, function(index, product) {

                table += '<tr data-id="'+ product.product_id +'" data-name="'+ product.name +'">' +
                    '<td>'+ product.name +'</td>'+
                    '<td>'+ product.uom_name +'</td>'+
                    '<td>'+ parseFloat(product.price_per_unit).toFixed(2) +'</td>'+
                    '<td><span class="btn btn-xs btn-danger delete-product">Delete</span></td></tr>';
            });

            $("table tbody").html(table);
        }
    });

});


// SAVE PRODUCT
$("#saveProduct").on("click", function () {

    var data = $("#productForm").serializeArray();

    var requestPayload = {
        product_name: null,
        uom_id: null,
        price_per_unit: null
    };

    for (var i=0;i<data.length;++i) {

        var element = data[i];

        switch(element.name) {

            case 'product_name':
                requestPayload.product_name = element.value;
                break;

            case 'uom_id':
                requestPayload.uom_id = element.value;
                break;

            case 'price_per_unit':
                requestPayload.price_per_unit = element.value;
                break;
        }
    }

    callApi("POST", productSaveApiUrl, requestPayload);   // ✅ FIX
});


// DELETE PRODUCT
$(document).on("click", ".delete-product", function (){

    var tr = $(this).closest('tr');

    var data = {
        product_id : tr.data('id')
    };

    if (confirm("Are you sure to delete "+ tr.data('name') +" item?")) {
        callApi("POST", productDeleteApiUrl, data);
    }
});


// RESET MODAL
productModal.on('hide.bs.modal', function(){

    $("#id").val('0');
    $("#name, #uoms, #price").val('');   // ✅ FIX

    productModal.find('.modal-title').text('Add New Product');
});


// LOAD UOM
productModal.on('show.bs.modal', function(){

    $.get(uomListApiUrl, function (response) {

        if(response) {

            var options = '<option value="">--Select--</option>';

            $.each(response, function(index, uom) {
                options += '<option value="'+ uom.uom_id +'">'+ uom.uom_name +'</option>';
            });

            $("#uoms").html(options);
        }
    });
});
