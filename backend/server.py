from flask import Flask, jsonify, request
from flask_cors import CORS
import products_dao
import uom_dao
import order_dao
import json
from sql_connection import get_sql_connection

app = Flask(__name__)
CORS(app)


@app.route("/getProducts", methods=["GET"])
def get_products():
    connection = get_sql_connection()
    response = products_dao.get_all_products(connection)
    connection.close()
    return jsonify(response)


@app.route("/insertProduct", methods=["POST"])
def insert_product():
    connection = get_sql_connection()
    product_id = products_dao.insert_new_product(connection, request.form)
    connection.close()
    return jsonify({"product_id": product_id})


@app.route("/getUOM", methods=["GET"])
def get_uom():
    connection = get_sql_connection()
    response = uom_dao.get_uoms(connection)
    connection.close()
    return jsonify(response)


@app.route("/deleteProduct", methods=["POST"])
def delete_products():
    product_id = request.form.get("product_id")
    connection = get_sql_connection()
    return_id = products_dao.delete_product(connection, product_id)
    connection.close()
    return jsonify({"product_id": return_id})


# NEW ROUTES
@app.route("/getAllOrders", methods=["GET"])
def get_all_orders():
    connection = get_sql_connection()
    response = order_dao.get_all_orders(connection)
    connection.close()
    return jsonify(response)


@app.route("/insertOrder", methods=["POST"])
def insert_order():
    payload = request.form.to_dict()
    payload['order_details'] = json.loads(request.form['order_details'])

    connection = get_sql_connection()
    order_id = order_dao.insert_order(connection, payload)
    connection.close()

    return jsonify({"order_id": order_id})


@app.route("/")
def home():
    return "Flask Server Running ✅"


if __name__ == "__main__":
    app.run(debug=True)