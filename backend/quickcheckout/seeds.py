"""
Initial realistic seed data for QUICKCHECKOUT 2.0 supermarket catalog.
Includes realistic Indian supermarket products, EAN barcodes, stock levels,
pricing in Indian Rupees (₹), and pre-configured demo users.
"""

import datetime
from quickcheckout.jwt_auth import hash_password

def get_seed_users():
    return [
        {
            "_id": "usr_customer_01",
            "name": "Abdul Khan",
            "email": "customer@quickcheckout.in",
            "password": hash_password("password123"),
            "role": "customer",
            "phone": "+91 98765 43210",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "usr_admin_01",
            "name": "Supermarket Admin",
            "email": "admin@quickcheckout.in",
            "password": hash_password("adminpassword123"),
            "role": "admin",
            "phone": "+91 99887 76655",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
    ]

def get_seed_products():
    return [
        # 1. Fruits & Vegetables
        {
            "_id": "prod_001",
            "name": "Fresh Alphonso Mangoes Ratnagiri",
            "barcode": "8901030383701",
            "sku": "FV-MANGO-01",
            "category": "Fruits & Vegetables",
            "description": "Hand-picked, naturally ripened premium Ratnagiri Alphonso mangoes known for their rich aroma and sweet pulp. 1kg box.",
            "price": 499.0,
            "stock": 45,
            "discount": 10,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80",
            "unit": "1 kg (approx 4-5 pcs)",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_002",
            "name": "Shimla Apples Royal Gala",
            "barcode": "8901030383702",
            "sku": "FV-APPLE-02",
            "category": "Fruits & Vegetables",
            "description": "Crisp, sweet, and succulent red Shimla Royal Gala apples sourced directly from Himachal orchards.",
            "price": 180.0,
            "stock": 32,
            "discount": 5,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=600&auto=format&fit=crop&q=80",
            "unit": "1 kg (approx 6-8 pcs)",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_003",
            "name": "Farm Fresh Red Onions",
            "barcode": "8901030383703",
            "sku": "FV-ONION-03",
            "category": "Fruits & Vegetables",
            "description": "High-quality Nasik red onions, firm and pungent, ideal for everyday Indian curries and salads.",
            "price": 70.0,
            "stock": 4, # Low stock indicator test
            "discount": 0,
            "status": "low_stock",
            "image": "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80",
            "unit": "2 kg net bag",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },

        # 2. Dairy & Eggs
        {
            "_id": "prod_004",
            "name": "Amul Gold Full Cream Fresh Milk",
            "barcode": "8901262010115",
            "sku": "DE-AMUL-01",
            "category": "Dairy & Eggs",
            "description": "Pasteurized standardized full cream milk with 6.0% fat and 9.0% SNF. Wholesome goodness for tea, coffee, and sweets.",
            "price": 68.0,
            "stock": 80,
            "discount": 0,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
            "unit": "1 Litre Pouch",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_005",
            "name": "Mother Dairy Classic Malai Paneer",
            "barcode": "8901262010122",
            "sku": "DE-PANEER-02",
            "category": "Dairy & Eggs",
            "description": "Super soft and rich malai paneer packed in vacuum seal to retain moisture and freshness.",
            "price": 95.0,
            "stock": 25,
            "discount": 5,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=600&auto=format&fit=crop&q=80",
            "unit": "200g Pack",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_006",
            "name": "Farm Fresh Brown Eggs (Pack of 6)",
            "barcode": "8901262010139",
            "sku": "DE-EGGS-03",
            "category": "Dairy & Eggs",
            "description": "Nutritious brown eggs rich in Omega-3 and protein from free-range healthy hens.",
            "price": 75.0,
            "stock": 0, # Out of stock indicator test
            "discount": 0,
            "status": "out_of_stock",
            "image": "https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=600&auto=format&fit=crop&q=80",
            "unit": "Pack of 6",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },

        # 3. Snacks
        {
            "_id": "prod_007",
            "name": "Haldiram's Nagpur Aloo Bhujia",
            "barcode": "8904004400101",
            "sku": "SN-HALD-01",
            "category": "Snacks",
            "description": "Iconic Indian crispy savory snack made from spicy potato flour and gram pulse flour. The ultimate tea-time companion.",
            "price": 115.0,
            "stock": 60,
            "discount": 12,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&auto=format&fit=crop&q=80",
            "unit": "400g Pack",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_008",
            "name": "Lay's India's Magic Masala Potato Chips",
            "barcode": "8901491101851",
            "sku": "SN-LAYS-02",
            "category": "Snacks",
            "description": "Crispy ridges potato chips seasoned with authentic Indian spices, dried mango powder, and chili.",
            "price": 40.0,
            "stock": 110,
            "discount": 0,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80",
            "unit": "115g Pack",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_009",
            "name": "Britannia Good Day Butter Cookies",
            "barcode": "8901063012012",
            "sku": "SN-BRIT-03",
            "category": "Snacks",
            "description": "Delightful crunch loaded with the richness of pure butter and a warm smile baked right onto every biscuit.",
            "price": 45.0,
            "stock": 75,
            "discount": 5,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
            "unit": "200g Pack",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },

        # 4. Beverages
        {
            "_id": "prod_010",
            "name": "Tata Tea Gold Premium Blend",
            "barcode": "8901052003885",
            "sku": "BV-TATA-01",
            "category": "Beverages",
            "description": "Exquisite blend of valley grown Assam CTC teas with 15% gently rolled aromatic long leaves.",
            "price": 310.0,
            "stock": 40,
            "discount": 8,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80",
            "unit": "500g Box",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_011",
            "name": "Nescafé Classic Instant Coffee Jar",
            "barcode": "8901058852319",
            "sku": "BV-NESC-02",
            "category": "Beverages",
            "description": "100% pure Robusta coffee beans carefully roasted to deliver signature rich aroma and taste.",
            "price": 320.0,
            "stock": 22,
            "discount": 10,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80",
            "unit": "100g Glass Jar",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_012",
            "name": "Paper Boat Aamras Mango Juice Drink",
            "barcode": "8906064010156",
            "sku": "BV-BOAT-03",
            "category": "Beverages",
            "description": "Made with 45% real mango pulp, reminding you of nostalgic Indian childhood summers. No preservatives.",
            "price": 35.0,
            "stock": 90,
            "discount": 0,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
            "unit": "250ml Pouch",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },

        # 5. Bakery
        {
            "_id": "prod_013",
            "name": "Britannia 100% Whole Wheat Brown Bread",
            "barcode": "8901063012999",
            "sku": "BK-BREAD-01",
            "category": "Bakery",
            "description": "Wholesome toasted goodness baked with 100% whole wheat flour, high in dietary fiber without maida.",
            "price": 55.0,
            "stock": 35,
            "discount": 0,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
            "unit": "400g Loaf",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_014",
            "name": "Cadbury Bournville 70% Dark Chocolate",
            "barcode": "8901233020088",
            "sku": "BK-CAD-02",
            "category": "Bakery",
            "description": "Crafted from fine cocoa beans with an intense, lingering chocolate indulgence.",
            "price": 120.0,
            "stock": 50,
            "discount": 15,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=600&auto=format&fit=crop&q=80",
            "unit": "80g Bar",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },

        # 6. Household
        {
            "_id": "prod_015",
            "name": "Surf Excel Matic Top Load Detergent Powder",
            "barcode": "8901030700010",
            "sku": "HH-SURF-01",
            "category": "Household",
            "description": "Engineered for top loading washing machines with color care and tough stain removal technology.",
            "price": 240.0,
            "stock": 30,
            "discount": 7,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=80",
            "unit": "1 kg Pouch",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_016",
            "name": "Vim Dishwash Liquid Lemon Gel",
            "barcode": "8901030700027",
            "sku": "HH-VIM-02",
            "category": "Household",
            "description": "Just 1 spoon of Vim gel removes the toughest grease with power of 100 lemons. Leaves zero residue.",
            "price": 145.0,
            "stock": 42,
            "discount": 10,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1585832770485-e68a5dbfad52?w=600&auto=format&fit=crop&q=80",
            "unit": "750ml Bottle",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },

        # 7. Personal Care
        {
            "_id": "prod_017",
            "name": "Dettol Original Bathing Soap (Pack of 3)",
            "barcode": "8901396112015",
            "sku": "PC-DETT-01",
            "category": "Personal Care",
            "description": "Trusted 99.9% germ protection with natural pine scent, certified by the Indian Medical Association.",
            "price": 165.0,
            "stock": 55,
            "discount": 5,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1607006483702-86d34e320436?w=600&auto=format&fit=crop&q=80",
            "unit": "125g x 3 Soaps",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_018",
            "name": "Colgate Total Advanced Health Toothpaste",
            "barcode": "8901314010119",
            "sku": "PC-COLG-02",
            "category": "Personal Care",
            "description": "12-hour antibacterial defense for whole mouth health - teeth, tongue, cheeks and gums.",
            "price": 140.0,
            "stock": 38,
            "discount": 0,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1559591937-e62fb330bc1f?w=600&auto=format&fit=crop&q=80",
            "unit": "150g Tube",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },

        # 8. Groceries
        {
            "_id": "prod_019",
            "name": "Aashirvaad Shudh Chakki Whole Wheat Atta",
            "barcode": "8901725181222",
            "sku": "GR-AASH-01",
            "category": "Groceries",
            "description": "Made from heavy, sun-ripened golden grains ground with traditional stone chakki process. Soft rotis guaranteed.",
            "price": 265.0,
            "stock": 48,
            "discount": 10,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80",
            "unit": "5 kg Bag",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_020",
            "name": "Tata Salt Vacuum Evaporated Iodised Salt",
            "barcode": "8901052001010",
            "sku": "GR-TATA-02",
            "category": "Groceries",
            "description": "Desh ka Namak. India's first packaged iodised salt ensuring essential iodine for child development.",
            "price": 28.0,
            "stock": 150,
            "discount": 0,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1518110925495-5fe2fda0442c?w=600&auto=format&fit=crop&q=80",
            "unit": "1 kg Pouch",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_021",
            "name": "Fortune Sunlite Refined Sunflower Oil",
            "barcode": "8906007281014",
            "sku": "GR-FORT-03",
            "category": "Groceries",
            "description": "Light, healthy edible cooking oil enriched with Vitamins A & D. Low absorption technology.",
            "price": 145.0,
            "stock": 65,
            "discount": 12,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
            "unit": "1 Litre Pouch",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_022",
            "name": "Daawat Rozana Super Basmati Rice",
            "barcode": "8901537002013",
            "sku": "GR-DAAW-04",
            "category": "Groceries",
            "description": "Aged, slender aromatic Basmati rice grains perfect for daily biryanis, pulavs and steamed rice.",
            "price": 420.0,
            "stock": 30,
            "discount": 15,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80",
            "unit": "5 kg Bag",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_023",
            "name": "Maggi 2-Minute Masala Instant Noodles",
            "barcode": "8901058850025",
            "sku": "SN-MAGG-04",
            "category": "Snacks",
            "description": "India's favorite instant noodles infused with blend of 10 spices and herbs. Source of Iron and Vitamin A.",
            "price": 56.0,
            "stock": 95,
            "discount": 5,
            "status": "in_stock",
            "image": "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&auto=format&fit=crop&q=80",
            "unit": "280g (Pack of 4)",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        },
        {
            "_id": "prod_024",
            "name": "Epigamia Greek Yogurt Natural Alphonso",
            "barcode": "8908006900118",
            "sku": "DE-EPIG-04",
            "category": "Dairy & Eggs",
            "description": "High-protein artisanal Greek yogurt with chunks of real Alphonso mangoes. Preservative free.",
            "price": 60.0,
            "stock": 3,
            "discount": 0,
            "status": "low_stock",
            "image": "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=600&auto=format&fit=crop&q=80",
            "unit": "120g Cup",
            "created_at": datetime.datetime.now(datetime.timezone.utc).isoformat()
        }
    ]
