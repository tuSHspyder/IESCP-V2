from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin

# Initialize the SQLAlchemy instance for database interaction
db = SQLAlchemy()

# Association table for many-to-many relationship between User and Role
class RolesUsers(db.Model):
    __tablename__ = 'roles_users'  # Table name in the database
    id = db.Column(db.Integer(), primary_key=True)  # Primary key
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))  # Foreign key referencing User table
    role_id = db.Column('role_id', db.Integer(), db.ForeignKey('role.id'))  # Foreign key referencing Role table

# User model that extends Flask-Security's UserMixin for authentication
class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)  # Unique identifier for each user
    username = db.Column(db.String, unique=False)  # User's username (not required to be unique)
    email = db.Column(db.String, unique=True)  # User's email address (must be unique)
    password = db.Column(db.String(255))  # Hashed password for security
    active = db.Column(db.Boolean())  # Status indicating if the user is active
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)  # Unique identifier for Flask-Security
    roles = db.relationship('Role', secondary='roles_users',  # Many-to-many relationship with Role
                         backref=db.backref('users', lazy='dynamic'))  # Back-reference for accessing associated users

# Role model that extends Flask-Security's RoleMixin
class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer(), primary_key=True)  # Unique identifier for each role
    name = db.Column(db.String(80), unique=True)  # Name of the role (must be unique)
    description = db.Column(db.String(255))  # Optional description of the role

# Sponsor model to represent sponsors in the application
class Sponsor(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique identifier for each sponsor
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))  # Foreign key referencing User table
    username = db.Column(db.String(120), nullable=False)  # Sponsor's username (required)
    email = db.Column(db.String, unique=True)  # Sponsor's email address (must be unique)
    # category = db.Column(db.String, unique=True)  # Uncomment if a category is needed for sponsors
    def __repr__(self):
        return f'<Sponsor {self.id}>'  # String representation for debugging

# Influencer model to represent influencers in the application
class Influencer(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique identifier for each influencer
    user_id = db.Column('user_id', db.Integer(), db.ForeignKey('user.id'))  # Foreign key referencing User table
    username = db.Column(db.String(120), nullable=False)  # Influencer's username (required)
    niche = db.Column(db.String, nullable=False)  # Influencer's niche or specialization
    email = db.Column(db.String, unique=True)  # Influencer's email address (must be unique)
    # ad_requests = db.relationship('AdRequest', backref='influencer', lazy=True)  # Uncomment if AdRequest relationship is needed

    def __repr__(self):
        return f'<Influencer {self.name}>'  # String representation for debugging

# AdRequest model to represent advertising requests
class AdRequest(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique identifier for each ad request
    campaign_id = db.Column(db.Integer, db.ForeignKey('campaign.id'), nullable=False, index=True)  # Foreign key referencing Campaign table
    # influencer_id = db.Column(db.Integer, db.ForeignKey('influencer.id'), nullable=False, index=True)  # Uncomment if an influencer reference is needed
    sender_id = db.Column(db.String, nullable=False)  # ID of the user sending the request
    receiver_id = db.Column(db.String, nullable=False)  # ID of the user receiving the request
    messages = db.Column(db.String, nullable=False)  # Messages exchanged in the ad request
    requirements = db.Column(db.String, nullable=False)  # Specific requirements for the ad request
    payment_amount = db.Column(db.Integer, nullable=False)  # Payment amount agreed for the request
    status = db.Column(db.String(20), nullable=False)  # Status of the request (e.g., Pending, Accepted, Rejected)

    campaign = db.relationship('Campaign', backref='ad_requests')  # Relationship with the Campaign model

    def __repr__(self):
        return f'<AdRequest {self.id}, Status: {self.status}>'  # String representation for debugging

# Campaign model to represent advertising campaigns
class Campaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)  # Unique identifier for each campaign
    title = db.Column(db.String(120), nullable=False)  # Title of the campaign
    description = db.Column(db.String, nullable=False)  # Description of the campaign
    niche = db.Column(db.String, nullable=False)  # Niche or target audience for the campaign
    # date = db.Column(db.Date, nullable=False)  # Uncomment if a date is needed for campaigns
    budget = db.Column(db.Integer, nullable=False)  # Budget allocated for the campaign
    goals = db.Column(db.String, nullable=False)  # Goals or objectives of the campaign
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Foreign key referencing User table
