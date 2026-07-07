import mysql.connector

cnx = mysql.connector.connect(user='root', password='RAJJU7409@rana', host='127.0.0.1', database='gs')

cursor = cnx.cursor()

query = ("SELECT * FROM gs.product")

cursor.execute(query)

response = []

for (product_id, name, uom_id, price_per_unit,uom_name) in cursor:
    response.append({
        "product_id": product_id,
        "name": name,
        "uom_id": uom_id,
        "price_per_unit": price_per_unit,
        "uom_name": uom_name
    })

cnx.close()

return response

if __name__ == "__main__":
    print("get_all_products()")