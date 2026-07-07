var productListApiUrl = "http://127.0.0.1:5000/getProducts";
var orderListApiUrl = "http://127.0.0.1:5000/getAllOrders";

$(function () {

    // PRODUCTS
    $.get(productListApiUrl, function(response){

        $("#totalProducts").html(response.length);

    });


    // ORDERS
    $.get(orderListApiUrl, function(response){

        $("#totalOrders").html(response.length);

        var revenue = 0;

        var rows = '';

        $.each(response, function(index, order){

            revenue += parseFloat(order.total);

            rows += `
                <tr>
                    <td>${order.order_id}</td>
                    <td>${order.customer_name}</td>
                    <td>₹${order.total}</td>
                    <td>${order.datetime}</td>
                </tr>
            `;

        });

        $("#totalRevenue").html("₹" + revenue.toFixed(2));

        $("#ordersTable").html(rows);

    });

});