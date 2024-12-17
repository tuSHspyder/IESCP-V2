from flask import current_app as app, jsonify, request, render_template, send_file
from flask_security import auth_required, roles_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from flask_restful import marshal, fields
import flask_excel as excel
from celery.result import AsyncResult
from .tasks import create_campaign_csv
from .models import db, User, Campaign, Role, Sponsor, Influencer
from .sec import datastore

@app.get('/')
def home():
    return render_template("index.html")

@app.get('/activate/sponsor/<int:sponsor_id>')
@auth_required("token")
@roles_required("admin")
def activate_sponsor(sponsor_id):
    sponsor = User.query.get(sponsor_id)
    if not sponsor or "sponsor" not in sponsor.roles:
        return jsonify({"message": "Sponsor not found"}), 404

    sponsor.active = True
    db.session.commit()
    return jsonify({"message": "User Activated"})

@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"message": "email not provided"}), 400

    user = datastore.find_user(email=email)

    if not user:
        return jsonify({"message": "User Not Found"}), 404

    if check_password_hash(user.password, data.get("password")):
        if user.active:
            return jsonify({"token": user.get_auth_token(), "email": user.email, "role": user.roles[0].name})
        else:
            return jsonify({"message": "User is not approved"})
    else:
        return jsonify({"message": "Wrong Password"}), 400

@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    role = data.get('role')
    niche = data.get('niche')

    if not email or not password or not role:
        return jsonify({'message' : 'invalid input'}), 403

    if datastore.find_user(email=email):
        return jsonify({'message' : 'user already exists'}), 400
    
    if role == 'influencer':
        datastore.create_user(
            username=username, 
            email=email, 
            password=generate_password_hash(password), 
            active=True, 
            roles=['influencer']
        )
        db.session.commit()

        user = datastore.find_user(email=email)

        influencer = Influencer(
            user_id=user.id,
            username=username,
            email=email,
            niche=niche
        )

        db.session.add(influencer)
        db.session.commit()
        return jsonify({'message' : 'Influencer successfully created'}), 201
    
    elif role == 'sponsor':
        try:
            datastore.create_user(
                username=username,
                email=email, 
                password=generate_password_hash(password), 
                active=False, 
                roles=['sponsor']
            )
            sponsor = Sponsor(
                username=username,
                email=email
            )

            db.session.add(sponsor)
            db.session.commit()
        except Exception as e:
            print(f'Error while creating sponsor: {e}')
            return jsonify({'message' : 'Failed to create sponsor'}), 500
        
        return jsonify({'message' : 'Sponsor successfully created'}), 201
    
    return jsonify({'message' : 'invalid role'}), 400


user_fields = {
    "id": fields.Integer,
    "email": fields.String,
    "active": fields.Boolean
}


@app.get('/users')
@auth_required("token")
@roles_required("admin")
def all_users():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message": "No User Found"}), 404
    return marshal(users, user_fields)


@app.get('/download-csv')
@auth_required("token")
@roles_required("sponsor")
def download_csv():
    user_id = current_user.id
    task = create_campaign_csv.delay(user_id)
    return jsonify({"task-id": task.id})

@app.route('/api/get-csv/<task_id>', methods=['GET'])
@auth_required("token")
@roles_required("sponsor")
def get_csv(task_id):
    res = AsyncResult(task_id)
    if res.ready():
        filename = res.result
        return send_file(filename, as_attachment=True, download_name='campaigns.csv',  # Specify the file name
            mimetype='text/csv')
    else:
        return jsonify({"message": "Task Pending"}), 404

@app.route('/api/campaign/<int:campaign_id>', methods=['DELETE'])
@auth_required("token")
@roles_required("sponsor")
def delete_campaign(campaign_id):
    campaign = Campaign.query.filter_by(id=campaign_id).first()
    if not campaign:
        return jsonify({"message": "Campaign not found"}), 404
    db.session.delete(campaign)
    db.session.commit()
    return jsonify({"message": "Campaign deleted successfully"})
