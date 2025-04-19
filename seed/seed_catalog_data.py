import pymongo
import datetime as Datetime

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["product_catalog_service"]
mycol = mydb["catalogitems"]

catalog_items = [
  {
    "name": "Tomatoes",
    "description": "Fresh, organic tomatoes for cooking or salads.",
    "unit": "kg",
    "imageUrl": "https://example.com/images/tomatoes.jpg",
    "isActive": True
  },
  {
    "name": "Olive Oil",
    "description": "Extra virgin olive oil, cold-pressed.",
    "unit": "L",
    "imageUrl": "https://example.com/images/olive-oil.jpg",
    "isActive": True
  },
  {
    "name": "Mozzarella Cheese",
    "description": "Soft Italian cheese, great for pizza and pasta.",
    "unit": "kg",
    "imageUrl": "https://example.com/images/mozzarella.jpg",
    "isActive": True
  }
]

try:
    # mycol.drop()
    mycol.insert_many(catalog_items)
    print("Data seeded successfully.")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    myclient.close()
