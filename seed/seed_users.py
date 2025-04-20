import pymongo
import bcrypt
from datetime import datetime, timezone

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["auth_service"]
mycol = mydb["users"]

hashed_password = str(bcrypt.hashpw(b"password!1", bcrypt.gensalt()), 'utf-8')

user = {
    "email": "admin@foodflow.com",
    "password": hashed_password,
    "role": "admin",
    "created_at": datetime.now(timezone.utc),
    "updated_at": None,
}


try:
    mycol.drop()
    mycol.insert_one(user)
    print("Data seeded successfully.")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    myclient.close()