"""
MongoDB Database Connection and Collection Initializer.
Supports MongoDB Atlas URI and resilient in-memory/mongomock fallback.
Enforces unique indexes on barcode, email, and SKU.
"""

import os
import logging
from pymongo import MongoClient, ASCENDING, IndexModel
import mongomock
from django.conf import settings

logger = logging.getLogger(__name__)

_mongo_client = None
_mongo_db = None
_is_mock = False

def get_db():
    global _mongo_client, _mongo_db, _is_mock
    if _mongo_db is not None:
        return _mongo_db

    mongodb_uri = getattr(settings, 'MONGODB_URI', os.getenv('MONGODB_URI', 'mongodb://localhost:27017/'))
    db_name = getattr(settings, 'MONGODB_DB_NAME', os.getenv('MONGODB_DB_NAME', 'quickcheckout_db'))

    try:
        # Try real MongoDB / Atlas connection with an 8-second timeout for replica set TLS discovery
        client = MongoClient(mongodb_uri, serverSelectionTimeoutMS=8000, connectTimeoutMS=8000)
        # Test connection
        client.admin.command('ping')
        _mongo_client = client
        _mongo_db = client[db_name]
        _is_mock = False
        logger.info(f"Connected to MongoDB Atlas successfully: {db_name}")
    except Exception as e:
        logger.warning(f"MongoDB Atlas connection note ({e}). Falling back to resilient mongomock in-memory database.")
        _mongo_client = mongomock.MongoClient()
        _mongo_db = _mongo_client[db_name]
        _is_mock = True

    init_indexes(_mongo_db)
    seed_database_if_empty(_mongo_db)
    return _mongo_db

def init_indexes(db):
    """Enforce critical database constraints and unique indexes."""
    try:
        # Products collection: unique barcode and unique SKU
        db.products.create_index([("barcode", ASCENDING)], unique=True)
        db.products.create_index([("sku", ASCENDING)], unique=True)
        db.products.create_index([("category", ASCENDING)])
        db.products.create_index([("name", ASCENDING)])

        # Users collection: unique email
        db.users.create_index([("email", ASCENDING)], unique=True)

        # Orders collection: order_id unique
        db.orders.create_index([("order_id", ASCENDING)], unique=True)
        db.orders.create_index([("user_id", ASCENDING)])
        db.orders.create_index([("created_at", ASCENDING)])
    except Exception as e:
        logger.warning(f"Index creation note: {e}")

def seed_database_if_empty(db):
    """Seeds rich authentic products if products collection is empty."""
    from quickcheckout.seeds import get_seed_products, get_seed_users
    try:
        if db.products.count_documents({}) == 0:
            products = get_seed_products()
            db.products.insert_many(products)
            logger.info(f"Seeded {len(products)} initial products into MongoDB.")
        
        if db.users.count_documents({}) == 0:
            users = get_seed_users()
            db.users.insert_many(users)
            logger.info(f"Seeded initial users into MongoDB.")
    except Exception as e:
        logger.error(f"Error seeding database: {e}")

def is_mock_db():
    return _is_mock
