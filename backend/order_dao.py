import mysql.connector


# ================= INSERT NEW ORDER =================
def insert_order(connection, order):

    cursor = connection.cursor()

    order_query = (
        "INSERT INTO orders (customer_name, total, datetime) "
        "VALUES (%s, %s, NOW())"
    )

    order_data = (
        order['customer_name'],
        order.get('grand_total') or 
        order.get('total')
    )

    cursor.execute(order_query, order_data)

    order_id = cursor.lastrowid

    order_details_query = (
        "INSERT INTO order_details "
        "(order_id, product_id, quantity, total_price) "
        "VALUES (%s, %s, %s, %s)"
    )

    order_details_data = []

    for record in order['order_details']:
        order_details_data.append((
            order_id,
            int(record['product_id']),
            float(record['quantity']),
            float(record['total_price'])
        ))

    cursor.executemany(order_details_query, order_details_data)

    connection.commit()
    cursor.close()

    return order_id


# ================= GET ALL ORDERS =================
def get_all_orders(connection):

    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT order_id,
           customer_name,
           total,
           datetime
    FROM orders
    """

    cursor.execute(query)

    orders = cursor.fetchall()

    cursor.close()

    response = []

    for order in orders:

        response.append({
            'order_id': order['order_id'],
            'customer_name': order['customer_name'],
            'total': float(order['total']),
            'datetime': str(order['datetime']),
            'order_details': get_order_details(
                connection,
                order['order_id']
            )
        })

    return response


# ================= DELETE ORDER =================
def delete_order(connection, order_id):

    cursor = connection.cursor()

    cursor.execute("DELETE FROM order_details WHERE order_id = %s", (order_id,))
    cursor.execute("DELETE FROM orders WHERE order_id = %s", (order_id,))

    connection.commit()
    cursor.close()

    return order_id


# ================= GET ORDER DETAILS =================
def get_order_details(connection, order_id):

    cursor = connection.cursor(dictionary=True)

    query = """
    SELECT od.order_id,
           p.name,
           od.quantity,
           od.total_price
    FROM order_details od
    JOIN product p
    ON od.product_id = p.product_id
    WHERE od.order_id = %s
    """

    cursor.execute(query, (order_id,))

    response = []

    for (order_id, product_name, quantity, total_price) in cursor:
        response.append({
            'order_id': order_id,
            'product_name': product_name,
            'quantity': quantity,
            'total_price': total_price
        })

    cursor.close()

    return response