from flask_restful import Resource, Api, reqparse, fields, marshal
from flask_security import auth_required, roles_required, current_user
from flask import jsonify, make_response, request, abort
from sqlalchemy import or_
import datetime
from .models import (
    db,
    Campaign,
    AdRequest,
    User,
    Influencer,
    Sponsor
)
from .instances import cache

api = Api(prefix='/api')

parser = reqparse.RequestParser()

# Study Resource arguments
# parser.add_argument('topic', type=str,
#                     help='Topic is required should be a string', required=True)
# parser.add_argument('description', type=str,
#                     help='Description is required and should be a string', required=True)
# parser.add_argument('resource_link', type=str,
#                     help='Resource Link is required and should be a string', required=True)

# Campaign creation arguments
# parser.add_argument('title', type=str, required=True)
# parser.add_argument('description', type=str, required=True)
# parser.add_argument('niche', type=str, required=True)
# parser.add_argument('budget', type=str, required=True)
# parser.add_argument('goals', type=str, required=True)
# parser.add_argument('date', type=str, required=True)  # YYYY-MM-DD format


# class Creator(fields.Raw):
#     def format(self, user):
#         return user.email


# class Campaign(fields.Raw):
#     def format(self, campaign):
#         return {
#             "id": campaign.id,
#             "title": campaign.title,
#             "description": campaign.description,
#             "niche": campaign.niche,
#             # "date": campaign.date.strftime("%Y-%m-%d"),  # Format date
#             "budget": campaign.budget,
#             "goals": campaign.goals,
#             "creator_id": campaign.creator_id,
#         }


influencer_fields = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'username': fields.String,
    'niche': fields.String,
}

sponsor_fields = {
    'id': fields.Integer,
    'user_id': fields.Integer,
    'name': fields.String,
    'email': fields.String,
    'company_name': fields.String,
    'budget': fields.Integer,
    'campaigns': fields.List(fields.Integer)
}


user_fields = {
    'id': fields.Integer,
    'username': fields.String,
    'email': fields.String,
    'active': fields.Boolean,
    'roles': fields.List(fields.String),
}


ad_request_fields = {
    'id': fields.Integer,
    'campaign_id': fields.Integer,
    'sender_id': fields.Integer,
    'receiver_id': fields.Integer,
    'messages': fields.String,
    'requirements': fields.String,
    'payment_amount': fields.Integer,
    'status': fields.String,
}

campaign_fields = {
    'id': fields.Integer,
    'title': fields.String,
    'description': fields.String,
    'niche': fields.String,
    'budget': fields.Integer,
    'goals': fields.String,
    'creator': fields.Integer,
}


class UserResource(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        try:
            data = request.json
            user = User(
                email=data.get('email'),
                active=data.get('active', False),
                # Other user fields...
            )
            db.session.add(user)
            db.session.commit()
            return make_response(jsonify({"message": "User created successfully"}), 201)
        except Exception as e:
            print(f"Error creating user: {e}")
            return make_response(jsonify({"message": "Failed to create user", "error": str(e)}), 500)

    @auth_required("token")
    @roles_required("admin")
    def get(self, user_id=None):
        if user_id is None:
            try:
                users = User.query.all()
                result = marshal(users, user_fields)
                return result
            except Exception as e:
                print(f"Error fetching users: {e}")
                return {"message": "Error fetching users"}, 500
        else:
            try:
                user = User.query.filter_by(id=user_id).first()
                if not user:
                    return {"message": "User not found"}, 404
                result = marshal(user, user_fields)
                return result
            except Exception as e:
                print(f"Error fetching user details: {e}")
                return {"message": "Error fetching user details"}, 500

    @auth_required("token")
    @roles_required("admin")
    def put(self, user_id):
        try:
            user = User.query.filter_by(id=user_id).first()
            if not user:
                abort(404, "User not found")

            data = request.get_json()

            if data.get('email') is not None:
                user.email = data.get('email')
            if data.get('active') is not None:
                user.active = data.get('active')

            db.session.commit()
            return jsonify({"message": "User updated successfully"}), 200
        except Exception as e:
            print(f"Error updating user: {e}")
            return jsonify({"message": "An error occurred while updating the user", "error": str(e)}), 500

    @auth_required("token")
    @roles_required("admin")
    def delete(self, user_id):
        user = User.query.filter_by(id=user_id).first()
        if not user:
            return jsonify({"message": "User not found"}), 404
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"})


class SponsorResource(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        try:
            data = request.json
            sponsor = Sponsor(
                # Sponsor fields initialization
            )
            db.session.add(sponsor)
            db.session.commit()
            return make_response(jsonify({"message": "Sponsor created successfully"}), 201)
        except Exception as e:
            print(f"Error creating sponsor: {e}")
            return make_response(jsonify({"message": "Failed to create sponsor", "error": str(e)}), 500)

    @auth_required("token")
    @roles_required("admin")
    def get(self, sponsor_id=None):
        if sponsor_id is None:
            try:
                sponsors = Sponsor.query.all()
                result = marshal(sponsors, sponsor_fields)
                return result
            except Exception as e:
                print(f"Error fetching sponsors: {e}")
                return {"message": "Error fetching sponsors"}, 500
        else:
            try:
                sponsor = Sponsor.query.filter_by(id=sponsor_id).first()
                if not sponsor:
                    return {"message": "Sponsor not found"}, 404
                result = marshal(sponsor, sponsor_fields)
                return result
            except Exception as e:
                print(f"Error fetching sponsor details: {e}")
                return {"message": "Error fetching sponsor details"}, 500

    @auth_required("token")
    @roles_required("admin")
    def put(self, sponsor_id):
        try:
            sponsor = Sponsor.query.filter_by(id=sponsor_id).first()
            if not sponsor:
                abort(404, "Sponsor not found")

            data = request.get_json()

            # Update sponsor fields with new data
            # if data.get('field_name') is not None:
            #     sponsor.field_name = data.get('field_name')

            db.session.commit()
            return jsonify({"message": "Sponsor updated successfully"}), 200
        except Exception as e:
            print(f"Error updating sponsor: {e}")
            return jsonify({"message": "An error occurred while updating the sponsor", "error": str(e)}), 500

    @auth_required("token")
    @roles_required("admin")
    def delete(self, sponsor_id):
        sponsor = Sponsor.query.filter_by(id=sponsor_id).first()
        if not sponsor:
            return jsonify({"message": "Sponsor not found"}), 404
        db.session.delete(sponsor)
        db.session.commit()
        return jsonify({"message": "Sponsor deleted successfully"})


class InfluencerResource(Resource):
    @auth_required("token")
    @roles_required("admin")
    def post(self):
        try:
            data = request.json
            influencer = Influencer(
                # Influencer fields initialization
            )
            db.session.add(influencer)
            db.session.commit()
            return make_response(jsonify({"message": "Influencer created successfully"}), 201)
        except Exception as e:
            print(f"Error creating influencer: {e}")
            return make_response(jsonify({"message": "Failed to create influencer", "error": str(e)}), 500)

    @auth_required("token")
    # @roles_required("admin")
    def get(self, influencer_id=None):
        if influencer_id is None:
            try:
                influencers = Influencer.query.all()
                result = marshal(influencers, influencer_fields)
                return result
            except Exception as e:
                print(f"Error fetching influencers: {e}")
                return {"message": "Error fetching influencers"}, 500
        else:
            try:
                influencer = Influencer.query.filter_by(id=influencer_id).first()
                if not influencer:
                    return {"message": "Influencer not found"}, 404
                result = marshal(influencer, influencer_fields)
                return result
            except Exception as e:
                print(f"Error fetching influencer details: {e}")
                return {"message": "Error fetching influencer details"}, 500

    @auth_required("token")
    @roles_required("admin")
    def put(self, influencer_id):
        try:
            influencer = Influencer.query.filter_by(id=influencer_id).first()
            if not influencer:
                abort(404, "Influencer not found")

            data = request.get_json()

            # Update influencer fields with new data
            # if data.get('field_name') is not None:
            #     influencer.field_name = data.get('field_name')

            db.session.commit()
            return jsonify({"message": "Influencer updated successfully"}), 200
        except Exception as e:
            print(f"Error updating influencer: {e}")
            return jsonify({"message": "An error occurred while updating the influencer", "error": str(e)}), 500

    @auth_required("token")
    @roles_required("admin")
    def delete(self, influencer_id):
        influencer = Influencer.query.filter_by(id=influencer_id).first()
        if not influencer:
            return jsonify({"message": "Influencer not found"}), 404
        db.session.delete(influencer)
        db.session.commit()
        return jsonify({"message": "Influencer deleted successfully"})


class AdRequestResource(Resource):
    @auth_required("token")
    # @roles_required("sponsor")
    def post(self):
        try:
            # Reading from JSON payload
            data = request.json
            
            campaign_id = data.get('campaign_id')

            ad_request = AdRequest(
                campaign_id=campaign_id,
                # influencer_id=data.get('influencer_id'),
                sender_id=current_user.id,
                # receiver_id=Campaign.query.filter_by(id=campaign_id).first().creator_id,
                receiver_id=data.get('influencer_id'),
                messages=data.get('messages'),
                requirements=data.get('requirements'),
                payment_amount=data.get('payment_amount'),
                status="Pending"
            )
            db.session.add(ad_request)
            db.session.commit()
            return make_response(jsonify({"message": "AdRequest created successfully"}), 201)
        except Exception as e:
            print(f"Error creating AdRequest: {e}")
            return make_response(jsonify({"message": "Failed to create AdRequest", "error": str(e)}), 500)

    @auth_required("token")
    # @roles_required(["sponsor"])
    def get(self, ad_request_id=None):
        if ad_request_id is None:
            if current_user.has_role("influencer"):
                ad_requests = AdRequest.query.filter_by(receiver_id=current_user.id).all()
                ad_requests_data = marshal(ad_requests, ad_request_fields)
                return ad_requests_data
            else:
                try:
                    ad_requests = AdRequest.query.all()
                    result = marshal(ad_requests, ad_request_fields)
                    return result
                except Exception as e:
                    print(f"Error fetching AdRequests: {e}")
                    return {"message": "Error fetching AdRequests"}, 500
        else:
            try:
                ad_request = AdRequest.query.filter_by(id=ad_request_id).first()
                if not ad_request:
                    return {"message": "AdRequest not found"}, 404
                result = marshal(ad_request, ad_request_fields)
                return result
            except Exception as e:
                print(f"Error fetching AdRequest details: {e}")
                return {"message": "Error fetching AdRequest details"}, 500

    @auth_required("token")
    # @roles_required("sponsor")
    def put(self, ad_request_id):
        try:
            # Retrieve the ad request to update
            ad_request = AdRequest.query.filter_by(id=ad_request_id).first()

            # If ad_request is not found, abort with 404
            if not ad_request:
                abort(404, "AdRequest not found")

            # Parse the incoming request data
            data = request.get_json()

            # Check if status is provided and valid
            if 'status' in data:
                if data.get('status') is not None:
                    valid_statuses = ['Pending', 'Accepted', 'Rejected']
                    if data.get('status') not in valid_statuses:
                        abort(400, f"Invalid status. Choose from {', '.join(valid_statuses)}.")
                    ad_request.status = data.get('status')

            # Update the ad request fields with the new data if provided
            if 'messages' in data:
                if data.get('messages') is not None:
                    ad_request.messages = data.get('messages')
            if 'requirements' in data:
                if data.get('requirements') is not None:
                    ad_request.requirements = data.get('requirements')
            if 'payment_amount' in data:
                if data.get('payment_amount') is not None:
                    ad_request.payment_amount = data.get('payment_amount')
            if 'campaign_id' in data:
                if data.get('campaign_id') is not None:
                    ad_request.campaign_id = data('campaign_id')

            # Commit the changes to the database
            db.session.commit()

            # Return a JSON response with a success message
            return jsonify({"message": "AdRequest updated successfully"}), 200

        except Exception as e:
            # Log the error and return a JSON response with an error message
            print(f"Error updating AdRequest: {e}")
            return jsonify({"message": "An error occurred while updating the AdRequest", "error": str(e)}), 500


    @auth_required("token")
    # @roles_required("sponsor")
    def delete(self, ad_request_id):
        ad_request = AdRequest.query.filter_by(id=ad_request_id).first()
        if not ad_request:
            return jsonify({"message": "AdRequest not found"}), 404
        db.session.delete(ad_request)
        db.session.commit()
        return jsonify({"message": "AdRequest deleted successfully"})


class CampaignResource(Resource):
    @auth_required("token")
    # @roles_required("sponsor", "influencer")
    def post(self):
        try:
            # Reading from JSON payload
            data = request.json

            campaign = Campaign(
                title=data.get('title'),
                description=data.get('description'),
                niche=data.get('niche'),
                budget=data.get('budget'),
                goals=data.get('goals'),
                creator_id=current_user.id,
            )
            db.session.add(campaign)
            db.session.commit()
            return make_response(jsonify({"message": "Campaign created successfully"}), 201)
        except Exception as e:
            print(f"Error creating campaign: {e}")
            return make_response(jsonify({"message": "Failed to create campaign", "error": str(e)}), 500)

    @auth_required("token")
    # @roles_required(["sponsor", "influencer"])
    def get(self, campaign_id=None):
        if campaign_id is None:
            if current_user.has_role("sponsor"):
                campaigns = Campaign.query.filter_by(creator_id=current_user.id).all()
                campaigns_data = marshal(campaigns, campaign_fields)
                return campaigns_data
            else:
                try:
                    campaigns = Campaign.query.all()
                    result = marshal(campaigns, campaign_fields)
                    return result
                except Exception as e:
                    print(f"Error fetching campaigns: {e}")
                    return {"message": "Error fetching campaigns"}, 500
        else:
            try:
                campaign = Campaign.query.filter_by(id=campaign_id).first()
                if not campaign:
                    return {"message": "Campaign not found"}, 404

                ad_requests = AdRequest.query.filter_by(campaign_id=campaign_id).all()
                campaign_data = marshal(campaign, campaign_fields)
                ad_requests_data = [marshal(ar, ad_request_fields) for ar in ad_requests]

                return {"campaign": campaign_data, "adRequests": ad_requests_data}
            except Exception as e:
                print(f"Error fetching campaign details: {e}")
                return {"message": "Error fetching campaign details"}, 500

    @auth_required("token")
    # @roles_required("sponsor", "influencer")
    def put(self, campaign_id):
        try:
            campaign = Campaign.query.filter_by(id=campaign_id).first()

            if not campaign:
                abort(404, "Campaign not found")

            data = request.get_json()

            if not data.get('title'):
                abort(400, "Title is required.")
            if not data.get('description'):
                abort(400, "Description is required.")
            if not data.get('niche'):
                abort(400, "Niche is required.")
            
            if Campaign.query.filter(Campaign.title == data.get('title')).first():
                abort(400, "Campaign title already exists. Choose a different title.")

            if data.get('title') is not None:
                campaign.title = data.get('title')
            if data.get('description') is not None:
                campaign.description = data.get('description')
            if data.get('niche') is not None:
                campaign.niche = data.get('niche')
            if data.get('budget') is not None:
                campaign.budget = data.get('budget')
            if data.get('goals') is not None:
                campaign.goals = data.get('goals')

            db.session.commit()
            cache.delete('campaigns')

            return jsonify({"message": "Campaign updated successfully"}), 200

        except Exception as e:
            print(f"Error updating campaign: {e}")
            return jsonify({"message": "An error occurred while updating the campaign", "error": str(e)}), 500



    @auth_required("token")
    # @roles_required("sponsor")
    def delete(self, campaign_id):
        campaign = Campaign.query.filter_by(id=campaign_id).first()
        if not campaign:
            return jsonify({"message": "Campaign not found"}), 404
        db.session.delete(campaign)
        db.session.commit()
        return jsonify({"message": "Campaign deleted successfully"})


class SearchResource(Resource):
    @auth_required("token")
    def get(self):
        search_query = request.args.get('search', '')
        if not search_query:
            return {'message': 'Search query is required'}, 400

        try:            
            if current_user.has_role("admin"):
                campaigns = Campaign.query.filter(
                    or_(
                        Campaign.title.ilike(f'%{search_query}%'),
                        Campaign.description.ilike(f'%{search_query}%'),
                        Campaign.budget.ilike(f'%{search_query}%')
                    )
                ).all()

                ad_requests = AdRequest.query.filter(
                    or_(
                        AdRequest.messages.ilike(f'%{search_query}%'),
                        AdRequest.requirements.ilike(f'%{search_query}%'),
                        AdRequest.payment_amount.ilike(f'%{search_query}%')
                    )
                ).all()

                users = User.query.filter(
                    or_(
                        User.email.ilike(f'%{search_query}%'),
                        User.username.ilike(f'%{search_query}%')
                    )
                ).all()

                campaign_results = marshal(campaigns, campaign_fields)
                ad_request_results = marshal(ad_requests, ad_request_fields)
                user_results = marshal(users, user_fields)

                return {
                    "campaigns": campaign_results,
                    "ad_requests": ad_request_results,
                    "users": user_results
                }
            
            elif current_user.has_role("influencer"):
                print("THIS IS WORKING!!!!!!!!!!")
                campaigns = Campaign.query.filter(
                    or_(
                        Campaign.title.ilike(f'%{search_query}%'),
                        Campaign.description.ilike(f'%{search_query}%')
                    )
                ).all()

                ad_requests = AdRequest.query.filter(
                    or_(
                        AdRequest.messages.ilike(f'%{search_query}%'),
                        AdRequest.requirements.ilike(f'%{search_query}%')
                    )
                ).all()

                campaign_results = marshal(campaigns, campaign_fields)
                ad_request_results = marshal(ad_requests, ad_request_fields)

                return {
                    "campaigns": campaign_results,
                    "ad_requests": ad_request_results
                    }

            elif current_user.has_role("sponsor"):
                influencers = Influencer.query.filter(
                    or_(
                        Influencer.username.ilike(f'%{search_query}%'),
                        Influencer.niche.ilike(f'%{search_query}%')
                    )
                ).all()

                influencer_results = marshal(influencers, influencer_fields)

                return {
                    "influencers": influencer_results
                    }

        except Exception as e:
            print(f"Error performing search: {e}")
            return {"message": "Error performing search"}, 500


api.add_resource(UserResource, '/user', '/user/<int:user_id>')
api.add_resource(SponsorResource, '/sponsor', '/sponsor/<int:sponsor_id>')
api.add_resource(InfluencerResource, '/influencer', '/influencer/<int:influencer_id>')
api.add_resource(AdRequestResource, '/ad_request', '/ad_request/<int:ad_request_id>')
api.add_resource(CampaignResource, '/campaign', '/campaign/<int:campaign_id>')
api.add_resource(SearchResource, '/search')
