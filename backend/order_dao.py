from datetime import datetime
from sql_connection import get_sql_connection


# ------------------ INSERT ORDER ------------------
def insert_order(connection, order):
    cursor = connection.cursor()

    order_query = (
        "INSERT INTO orders (customer_name, total, datetime) "
        "VALUES (%s, %s, %s)"
    )

    order_data = (
        order['customer_name'],
        order['total'],   # ✅ FIXED (was grand_total)
        datetime.now()
    )

    cursor.execute(order_query, order_data)
    order_id = cursor.lastrowid

    order_details_query = (
        "INSERT INTO order_details (order_id, product_id, quantity, total_price) "
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
    cursor.close()   # ✅ IMPORTANT

    return order_id


# ------------------ GET ORDER DETAILS ------------------
def get_order_details(connection, order_id):
    cursor = connection.cursor()

    query = (
        "SELECT od.order_id, od.quantity, od.total_price, "
        "p.name, p.price_per_unit "
        "FROM order_details od "
        "LEFT JOIN product p ON od.product_id = p.product_id "
        "WHERE od.order_id = %s"
    )

    cursor.execute(query, (order_id,))

    records = []
    for (order_id, quantity, total_price, product_name, price_per_unit) in cursor:
        records.append({
            'order_id': order_id,
            'quantity': quantity,
            'total_price': total_price,
            'product_name': product_name,
            'price_per_unit': price_per_unit
        })

    cursor.close()   # ✅ FIX

    return records


# ------------------ GET ALL ORDERS ------------------
def get_all_orders(connection):
    cursor = connection.cursor()

    query = "SELECT order_id, customer_name, total, datetime FROM orders"
    cursor.execute(query)

    response = []

    for (order_id, customer_name, total, dt) in cursor:
        response.append({
            'order_id': order_id,
            'customer_name': customer_name,
            'total': total,
            'datetime': dt.strftime('%Y-%m-%d %H:%M:%S')  # ✅ FIX (JSON safe)
        })

    cursor.close()   # ✅ FIX

    # Attach order details
    for record in response:
        record['order_details'] = get_order_details(connection, record['order_id'])

    return response


# ------------------ TEST ------------------
if __name__ == '__main__':
    connection = get_sql_connection()

    print(get_all_orders(connection))

    # Example insert
    # print(insert_order(connection, {
    #     'customer_name': 'Rajat',
    #     'total': 500,
    #     'order_details': [
    #         {
    #             'product_id': 1,
    #             'quantity': 2,
    #             'total_price': 100
    #         },
    #         {
    #             'product_id': 2,
    #             'quantity': 1,
    #             'total_price': 50
    #         }
    #     ]
    # }))