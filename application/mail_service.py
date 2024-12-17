from smtplib import SMTP  # Import the SMTP class for sending emails
from email.mime.multipart import MIMEMultipart  # Import for creating multipart email messages
from email.mime.text import MIMEText  # Import for adding plain text or HTML content to the email

# Configuration for the SMTP server
SMTP_HOST = "localhost"  # Hostname or IP address of the SMTP server
SMTP_PORT = 1025  # Port number of the SMTP server
# SENDER_EMAIL = '21f1000334@ds.study.iitm.ac.in'  # Uncomment and modify if using a different sender email
SENDER_EMAIL = 'tusharborntoshine@gmail.com'  # Email address of the sender
SENDER_PASSWORD = ''  # Password for the sender's email account (leave blank if not required)

# Function to send an email message
def send_message(to, subject, content_body):
    msg = MIMEMultipart()  # Create a multipart email message
    msg["To"] = to  # Set the recipient email address
    msg["Subject"] = subject  # Set the email subject
    msg["From"] = SENDER_EMAIL  # Set the sender email address
    msg.attach(MIMEText(content_body, 'html'))  # Attach the email body content as HTML
    client = SMTP(host=SMTP_HOST, port=SMTP_PORT)  # Create an SMTP client session with the specified host and port
    client.login(SENDER_EMAIL, SENDER_PASSWORD)  # Log in to the SMTP server using sender's credentials
    client.send_message(msg=msg)  # Send the email message
    client.quit()  # Terminate the SMTP client session
