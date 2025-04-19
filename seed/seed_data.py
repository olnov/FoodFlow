import pymongo
import bcrypt
import datetime as Datetime

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["auth_service"]
mycol = mydb["clients"]

hashed_password = str(bcrypt.hashpw(b"password!1", bcrypt.gensalt()), 'utf-8')

inventory_service = {
    "clientId": "inventory_service",
    "clientSecret": hashed_password,
    "scopes": ["read", "write"],
    "created_at": Datetime.datetime.now(),
    "updated_at": None,
}

catalog_service = {
    "clientId": "catalog_service",
    "clientSecret": hashed_password,
    "scopes": ["read", "write"],
    "created_at": Datetime.datetime.now(),
    "updated_at": None,
}

try:
    mycol.drop()
    mycol.insert_one(inventory_service)
    mycol.insert_one(catalog_service)
    print("Data seeded successfully.")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    myclient.close()