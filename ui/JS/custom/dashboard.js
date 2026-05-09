$(function () {

    $.get(orderListApiUrl, function (response) {

        if(response && response.length > 0) {

            var table = '';
            var totalCost = 0;

            $.each(response, function(index, order) {

                var total = parseFloat(order.total);   // ✅ FIX

                totalCost += total;

                table += '<tr>' +
                    '<td>'+ order.datetime +'</td>'+
                    '<td>'+ order.order_id +'</td>'+
                    '<td>'+ order.customer_name +'</td>'+
                    '<td>'+ total.toFixed(2) +' Rs</td></tr>';
            });

            table += '<tr>' +
                '<td colspan="3" style="text-align: end"><b>Total</b></td>' +
                '<td><b>'+ totalCost.toFixed(2) +' Rs</b></td></tr>';

            $("table tbody").html(table);

        } else {
            $("table tbody").html("<tr><td colspan='4'>No Orders Found</td></tr>");
        }

    }).fail(function(err) {
        console.error("❌ API Error:", err);
    });

});