from flask import Flask  # Import Flask for creating the application
from flask_security import SQLAlchemyUserDatastore, Security  # Import Flask-Security for user and role management
from application.models import db, User, Role  # Import database, User, and Role models
from config import DevelopmentConfig  # Import the development configuration
from application.resources import api  # Import API resources
from application.sec import datastore  # Import the security datastore
from application.worker import celery_init_app  # Import Celery initialization function
import flask_excel as excel  # Import Flask-Excel for handling Excel files
from celery.schedules import crontab  # Import crontab for scheduling periodic tasks
from application.tasks import daily_reminder, monthly_report  # Import task functions
from application.instances import cache  # Import cache instance

# Function to create and configure the Flask application
def create_app():
    app = Flask(__name__)  # Create a Flask app instance
    app.config.from_object(DevelopmentConfig)  # Load development configuration
    db.init_app(app)  # Initialize the SQLAlchemy database with the app
    api.init_app(app)  # Initialize the API resources with the app
    excel.init_excel(app)  # Initialize Flask-Excel for the app
    app.security = Security(app, datastore)  # Initialize Flask-Security with the app and datastore
    cache.init_app(app)  # Initialize the cache with the app
    with app.app_context():  # Bind the application context
        import application.views  # Import views after the app context is available

    return app  # Return the configured Flask application

# Create the Flask app
app = create_app()
# Initialize Celery with the Flask app
celery_app = celery_init_app(app)

# Daily Reminder: Setup a periodic Celery task
@celery_app.on_after_configure.connect  # Signal to configure the task after Celery setup
def setup_periodic_tasks(sender, **kwargs):
    sender.add_periodic_task(  # Add a periodic task to the Celery beat schedule
        crontab(hour=13, minute=27),  # Schedule the task to run daily at 13:27
        daily_reminder.s('tushar@iitm.com', 'Daily Test'),  # Call the daily_reminder task
    )

# Monthly Report: Setup a periodic Celery task
@celery_app.on_after_configure.connect  # Signal to configure the task after Celery setup
def setup_periodic_monthly_report(sender, **kwargs):
    sender.add_periodic_task(  # Add a periodic task to the Celery beat schedule
        crontab(hour=13, minute=27, day_of_month=1),  # Schedule the task to run monthly on the 1st at 13:27
        monthly_report.s('tushar@iitm.com', 'Monthly Report'),  # Call the monthly_report task
    )

# Main entry point for running the application
if __name__ == '__main__':
    app.run(debug=True)  # Run the Flask app in debug mode
