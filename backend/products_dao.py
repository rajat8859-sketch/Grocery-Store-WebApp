from sql_connection import get_sql_connection


def get_all_products(connection):
    cursor = connection.cursor()

    query = (
        "SELECT product.product_id, product.name, product.uom_id, "
        "product.price_per_unit, uom.uom_name "
        "FROM product INNER JOIN uom ON product.uom_id = uom.uom_id"
    )

    cursor.execute(query)

    response = []

    for (product_id, name, uom_id, price_per_unit, uom_name) in cursor:
        response.append({
            "product_id": product_id,
            "name": name,
            "uom_id": uom_id,
            "price_per_unit": price_per_unit,
            "uom_name": uom_name
        })

    cursor.close()   

    return response


def insert_new_product(connection, product):
    cursor = connection.cursor()

    query = (
        "INSERT INTO product (name, uom_id, price_per_unit) "
        "VALUES (%s, %s, %s)"
    )

    data = (
        product["product_name"],
        product["uom_id"],
        product["price_per_unit"]
    )

    cursor.execute(query, data)
    connection.commit()

    last_id = cursor.lastrowid
    cursor.close()  

    return last_id


def delete_product(connection, product_id):
    cursor = connection.cursor()

    query = "DELETE FROM product WHERE product_id = %s"
    data = (product_id,)

    cursor.execute(query, data)
    connection.commit()

    cursor.close()   

    return product_id  

# ================= UPDATE PRODUCT =================

def update_product(connection, product):

    cursor = connection.cursor()

    query = """
    UPDATE product
    SET name = %s,
        uom_id = %s,
        price_per_unit = %s
    WHERE product_id = %s
    """

    data = (

        product['product_name'],

        product['uom_id'],

        product['price_per_unit'],

        product['product_id']
    )

    cursor.execute(query, data)

    connection.commit()

    cursor.close()

    return product['product_id']


if __name__ == "__main__":
    connection = get_sql_connection()
    print(delete_product(connection, 18))