import mysql.connector

def get_sql_connection():
    try:
        connection = mysql.connector.connect(
            host="localhost",
            user="root",
            password="RAJJU7409@rana",   
            database="gs"    
        )

        if connection.is_connected():
            print("MySQL Connected")
            return connection

    except Exception as e:
        print(" DB Connection Error:", e)
        return None