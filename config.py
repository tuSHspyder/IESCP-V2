# Base configuration class
class Config(object):
    DEBUG = False  # Disable debug mode by default
    TESTING = False  # Disable testing mode by default

# Configuration class for development environment
class DevelopmentConfig(Config):
    DEBUG = True  # Enable debug mode for development
    SQLALCHEMY_DATABASE_URI = 'sqlite:///dev.db'  # Database URI for SQLite in development
    SECRET_KEY = "thisissecter"  # Secret key for session management and other Flask features
    SECURITY_PASSWORD_SALT = "thisissaltt"  # Salt for password hashing in Flask-Security
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Disable SQLAlchemy event system to save resources
    WTF_CSRF_ENABLED = False  # Disable CSRF protection for forms in development
    SECURITY_TOKEN_AUTHENTICATION_HEADER = 'Authentication-Token'  # Header for token-based authentication
    CACHE_TYPE = "RedisCache"  # Cache type set to Redis
    CACHE_REDIS_HOST = "localhost"  # Redis host for caching
    CACHE_REDIS_PORT = 6379  # Redis port for caching
    CACHE_REDIS_DB = 3  # Redis database number for caching
