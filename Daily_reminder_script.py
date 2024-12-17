import requests

WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAAACYVRA8E/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=tJU5dmzVkDr7xkyu9lx4MrXAJmFu1nLv71OKDFHckzI"

def send_rich_gchat_reminder():
    payload = {
        "cards": [
            {
                "header": {
                    "title": "Daily Reminder",
                    "subtitle": "Task Reminder Bot",
                    "imageUrl": "https://cdni.iconscout.com/illustration/premium/thumb/businesswoman-completing-task-from-home-illustration-download-in-svg-png-gif-file-formats--girl-pending-business-person-pack-people-illustrations-3575300.png?f=webp"
                },
                "sections": [
                    {
                        "widgets": [
                            {
                                "keyValue": {
                                    "topLabel": "Today's ad requests",
                                    "content": "Reminder to visit/accept the ad request or checkout the public ad requests"
                                }
                            },
                            {
                                "buttons": [
                                    {
                                        "textButton": {
                                            "text": "VIEW TASKS",
                                            "onClick": {
                                                "openLink": {
                                                    "url": "http://127.0.0.1:5000/#/login"
                                                }
                                            }
                                        }
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }

    headers = {"Content-Type": "application/json"}
    response = requests.post(WEBHOOK_URL, json=payload, headers=headers)
    if response.status_code == 200:
        print("Rich reminder sent successfully!")
    else:
        print("Failed to send reminder:", response.status_code, response.text)

# Call the function
send_rich_gchat_reminder()