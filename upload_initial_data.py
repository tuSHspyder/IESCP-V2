from main import app
from application.sec import datastore
from application.models import db, Role
from flask_security import hash_password
from werkzeug.security import generate_password_hash


with app.app_context():
    db.create_all()

    datastore.find_or_create_role(
        name="admin", description="User is an admin")
    datastore.find_or_create_role(
        name="influencer", description="User is an Influencer")
    datastore.find_or_create_role(
        name="sponsor", description="User is a Sponsor")

    db.session.commit()

    if not datastore.find_user(email="admin@iitm.com"):
        datastore.create_user(
            email="admin@iitm.com", password=generate_password_hash("admin"), roles=["admin"])
    if not datastore.find_user(email="inf1@iitm.com"):
        datastore.create_user(
            email="inf1@iitm.com", password=generate_password_hash("pass"), roles=["influencer"])
    if not datastore.find_user(email="spon1@iitm.com"):
        datastore.create_user(
            email="spon1@iitm.com", password=generate_password_hash("pass"), roles=["sponsor"])

    db.session.commit()
