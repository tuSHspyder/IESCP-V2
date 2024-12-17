# IESCP V2

The Influencer Engagement & Sponsorship Coordination Platform (IESCP) is a web-based application designed to bridge the 
gap between sponsors and influencers. It facilitates seamless collaboration, enabling sponsors to advertise their products 
or services effectively while providing influencers with monetization opportunities. The platform ensures role-specific 
functionalities for sponsors, influencers, and administrators, fostering a secure and dynamic ecosystem.

## Terminal 1:
Step 1: Create a virtual environment named '.venv'
- `python -m venv .venv`

Step 2: Activate the virtual environment to isolate dependencies
- `.venv\Scripts\activate`

Step 3: Install all required Python packages specified in the 'requirements.txt' file
- `pip install -r requirements.txt`

#Step 4: Run the script to upload initial data into the system (e.g., default configurations or database entries)
- `python upload_initial_data.py`

Step 5: Start the main application
- `python main.py`

## Terminal 2:
Step 1: Open the Windows Subsystem for Linux (WSL) shell
- `wsl`

Step 2: Start the Redis server, which acts as a message broker and backend for task queuing
- `redis-server`

## Terminal 3:
 Step 1: Activate the same virtual environment as in Terminal 1
- `.venv\scripts\activate`

 Step 2: Start the Celery worker process to handle background tasks, specifying the application and logging level
 The `--pool=solo` argument ensures compatibility with Windows
- `python -m celery -A main:celery_app worker -l INFO --pool=solo`

## Terminal 4:
Step 1: Execute the script for daily reminders (e.g., sending notifications or emails to users)
- `python Daily_reminder_script.py`



## Folder Structure
```
.
├── application
│   ├── __init__.py
│   ├── instances.py
│   ├── mail_service.py
│   ├── models.py
│   ├── __pycache__
│   │   ├── __init__.cpython-312.pyc
│   │   ├── instances.cpython-312.pyc
│   │   ├── mail_service.cpython-312.pyc
│   │   ├── models.cpython-312.pyc
│   │   ├── resources.cpython-312.pyc
│   │   ├── sec.cpython-312.pyc
│   │   ├── tasks.cpython-312.pyc
│   │   ├── views.cpython-312.pyc
│   │   └── worker.cpython-312.pyc
│   ├── resources.py
│   ├── sec.py
│   ├── tasks.py
│   ├── views.py
│   └── worker.py
├── celerybeat-schedule
├── celeryconfig.py
├── config.py
├── dump.rdb
├── Daily reminder_script.py
├── instance
│   └── dev.db
├── main.py
├── __pycache__
│   ├── celeryconfig.cpython-312.pyc
│   ├── config.cpython-312.pyc
│   └── main.cpython-312.pyc
├── README.md
├── requirements.txt
├── static
│   ├── components
│   │   ├── AdminFind.js
│   │   ├── AdminInfo.js
│   │   ├── AdminStats.js
│   │   ├── AdminUsers.js
│   │   ├── AdRequestEdit.js
│   │   ├── AdRequestForm.js
│   │   ├── CampaignEdit.js
│   │   ├── CampaignForm.js
│   │   ├── CampaignView.js
│   │   ├── Home.js
│   │   ├── InfluencerFind.js
│   │   ├── InfluencerHome.js
│   │   ├── InfluencerStats.js
│   │   ├── Login.js
│   │   ├── Navbar.js
│   │   ├── Payment.js
│   │   ├── Signup.js
│   │   ├── SponsorAdRequestForm.js
│   │   ├── SponsorCampaigns.js
│   │   ├── SponsorFind.js
│   │   ├── SponsorHome.js
│   │   ├── SponsorStats.js
│   │   └── Welcome.js
│   ├── images
│   │   └── DB_schema.png
│   │   └── lime.jpg
│   │   └── Login_image.jpg
│   ├── index.js
│   └── router.js
├── templates
│   ├── activity_report.html
│   ├── daily_reminder.html
│   └── index.html
├── test.csv
└── upload_initial_data.py
```