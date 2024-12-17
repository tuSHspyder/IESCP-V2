from celery import shared_task
import flask_excel as excel
from .mail_service import send_message
from .models import User, Campaign, Role, AdRequest
from jinja2 import Template
from flask import current_app
import tempfile
import os

@shared_task(ignore_result=False)
def create_campaign_csv(user_id):
    try:
        with current_app.app_context():
            tmp_dir = tempfile.gettempdir()  # Get system's temp directory
            campaigns = Campaign.query.filter_by(creator_id=user_id).with_entities(
                Campaign.title, Campaign.description, Campaign.niche, Campaign.budget, Campaign.goals).all()

            csv_output = excel.make_response_from_query_sets(
                campaigns, ["title", "description", "niche", "budget", "goals"], "csv")
            filename = f"user_{user_id}_campaigns.csv"

            file_path = os.path.join(tmp_dir, filename)
            with open(file_path, 'wb') as f:
                f.write(csv_output.data)

        return file_path

    except Exception as e:
        current_app.logger.error(f"Error creating CSV: {e}")
        raise


# ------------- daily reminder for all the sponsors
@shared_task(ignore_result=True)
def daily_reminder(to, subject):
    try:
        with current_app.app_context():
            users = User.query.filter(User.roles.any(Role.name == 'sponsor')).all()
            for user in users:
                template_path = os.path.join(current_app.root_path, 'templates', 'daily_reminder.html')
                with open(template_path, 'r') as f:
                    template = Template(f.read())
                    send_message(user.email, subject, template.render(email=user.email))
    except Exception as e:
        current_app.logger.error(f"Error sending daily reminder: {e}")
        raise

    return "OK"


# monthly report for all the sponsors
@shared_task(ignore_result=True)
def monthly_report(to, subject):
    try:
        with current_app.app_context():
            # Query all campaigns and ad requests
            campaigns = Campaign.query.all()
            ad_requests = AdRequest.query.all()

            # Render the report template
            template_path = os.path.join(current_app.root_path, 'templates', 'monthly_report.html')
            with open(template_path, 'r') as f:
                template = Template(f.read())
                report_content = template.render(
                    campaigns=campaigns,
                    ad_requests=ad_requests
                )

            # Send the email
            send_message(to, subject, report_content)
    except Exception as e:
        current_app.logger.error(f"Error sending monthly report: {e}")
        raise

    return "OK"

