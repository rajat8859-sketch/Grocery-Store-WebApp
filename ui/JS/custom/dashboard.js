var productListApiUrl = "http://127.0.0.1:5000/getProducts";
var orderListApiUrl = "http://127.0.0.1:5000/getAllOrders";

$(function () {

    // ================= TOTAL PRODUCTS =================

    $.get(productListApiUrl, function(products){

        if(products){

            $("#totalProducts").html(products.length);

        } else {

            $("#totalProducts").html("0");
        }

    });


    // ================= TOTAL ORDERS & REVENUE =================

    $.get(orderListApiUrl, function(orders){

        console.log("Orders:", orders);

        if(orders && orders.length > 0){

            // TOTAL ORDERS
            $("#totalOrders").html(orders.length);

            // REVENUE
            var revenue = 0;

            $.each(orders, function(index, order){

                revenue += Number(order.total);

            });

            $("#totalRevenue").html("₹ " + revenue.toFixed(2));

        }

        else{

            $("#totalOrders").html("0");

            $("#totalRevenue").html("₹ 0.00");
        }

    }).fail(function(error){

        console.log(error);

        $("#totalRevenue").html("₹ 0.00");
    });

});