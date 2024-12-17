import pytz


broker_url = "redis://localhost:6379/1"
result_backend = "redis://localhost:6379/2"
timezone = pytz.timezone('Asia/kolkata').zone
broker_connection_retry_on_startup=True
