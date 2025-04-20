import pymongo
from datetime import datetime, timezone

myclient = pymongo.MongoClient("mongodb://localhost:27017/")
mydb = myclient["product_catalog_service"]
mycol = mydb["catalogitems"]

catalog_items = [
  {
    "name": "Tomatoes",
    "description": "Fresh, organic tomatoes for cooking or salads.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg",
    "isActive": True
  },
  {
    "name": "Bananas",
    "description": "Sweet ripe bananas imported from Ecuador.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/8/8a/Banana-Single.jpg",
    "isActive": True
  },
  {
    "name": "Potatoes",
    "description": "Washed and sorted yellow potatoes.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Patates.jpg/1280px-Patates.jpg",
    "isActive": True
  },
  {
    "name": "Red Apples",
    "description": "Crispy red apples, perfect for snacking.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/15/Red_Apple.jpg",
    "isActive": False
  },
  {
    "name": "Green Grapes",
    "description": "Seedless green grapes, juicy and sweet.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/TenderGrapes.JPG/1280px-TenderGrapes.JPG",
    "isActive": True
  },
  {
    "name": "White Onions",
    "description": "White onions for stews, soups, and sauces.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/b/b6/White_onions_drying.jpg",
    "isActive": True
  },
  {
    "name": "Carrots",
    "description": "Crunchy carrots rich in vitamin A.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Vegetable-Carrot-Bundle-wStalks.jpg/1920px-Vegetable-Carrot-Bundle-wStalks.jpg",
    "isActive": True
  },
  {
    "name": "Cucumbers",
    "description": "Green cucumbers, ideal for salads.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/ARS_cucumber.jpg/800px-ARS_cucumber.jpg",
    "isActive": True
  },
  {
    "name": "Bell Peppers",
    "description": "Mixed red, yellow, and green bell peppers.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/85/Green-Yellow-Red-Pepper-2009.jpg/1280px-Green-Yellow-Red-Pepper-2009.jpg",
    "isActive": True
  },
  {
    "name": "Lettuce",
    "description": "Fresh iceberg lettuce, crisp and ready to eat.",
    "unit": "pcs",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Iceberg_lettuce_in_SB.jpg/1280px-Iceberg_lettuce_in_SB.jpg",
    "isActive": True
  },
  {
    "name": "Zucchini",
    "description": "Tender zucchinis for grilling or stir fry.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/CSA-Striped-Zucchini.jpg/1920px-CSA-Striped-Zucchini.jpg",
    "isActive": True
  },
  {
    "name": "Strawberries",
    "description": "Bright red strawberries packed with sweetness.",
    "unit": "box",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/2/29/PerfectStrawberry.jpg",
    "isActive": True
  },
  {
    "name": "Blueberries",
    "description": "Antioxidant-rich blueberries, ideal for desserts.",
    "unit": "box",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/1/15/Blueberries.jpg",
    "isActive": True
  },
  {
    "name": "Broccoli",
    "description": "Fresh broccoli florets for steaming or roasting.",
    "unit": "pcs",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/0/03/Broccoli_and_cross_section_edit.jpg",
    "isActive": True
  },
  {
    "name": "Cauliflower",
    "description": "White cauliflower, perfect for low-carb meals.",
    "unit": "pcs",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Chou-fleur_02.jpg/500px-Chou-fleur_02.jpg",
    "isActive": True
  },
  {
    "name": "Avocados",
    "description": "Creamy avocados from Mexico, ideal for guacamole.",
    "unit": "pcs",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Avocado_Hass_-_single_and_halved.jpg/1280px-Avocado_Hass_-_single_and_halved.jpg",
    "isActive": True
  },
  {
    "name": "Eggplants",
    "description": "Deep purple eggplants for grilling or curry.",
    "unit": "pcs",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/f/fb/Aubergine.jpg",
    "isActive": True
  },
  {
    "name": "Sweet Corn",
    "description": "Golden sweet corn on the cob, great grilled.",
    "unit": "pcs",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/7/79/VegCorn.jpg",
    "isActive": True
  },
  {
    "name": "Spinach",
    "description": "Fresh spinach leaves, perfect for salads or sautés.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/Spinach_leaves.jpg/1199px-Spinach_leaves.jpg?20080518133034",
    "isActive": True
  },
  {
    "name": "Garlic",
    "description": "Pungent garlic bulbs to enhance your cooking.",
    "unit": "kg",
    "imageUrl": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Garlic.jpg/1200px-Garlic.jpg",
    "isActive": False
  }
]

for item in catalog_items:
    item['createdAt'] = datetime.now(timezone.utc)
    item['updatedAt'] = datetime.now(timezone.utc)

try:
    mycol.drop()
    mycol.insert_many(catalog_items)
    print("Data seeded successfully.")
except Exception as e:
    print(f"An error occurred: {e}")
finally:
    myclient.close()
