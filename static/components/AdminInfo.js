export default {
    template: `
    <div class="container mt-5">
      <!-- Header Section -->
      <h1 class="text-center text-primary mb-5">Admin Dashboard</h1>

      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger">
        <strong>Error:</strong> {{ error }}
      </div>

      <!-- Section: Approve Sponsor Requests -->
      <div class="mb-4 p-4 border rounded shadow-sm bg-white">
        <h2 class="text-secondary">Approve Sponsor Requests</h2>
        <ul class="list-group">
          <li 
            v-for="user in allUsers" 
            :key="user.id" 
            v-if="!user.active"
            class="list-group-item d-flex justify-content-between align-items-center">
            <span class="fw-bold">{{ user.email }} <small class="text-muted">(Inactive)</small></span>
            <div>
              <button class="btn btn-sm btn-success me-2" @click="approve(user.id)">
                Approve
              </button>
              <button class="btn btn-sm btn-danger" @click="deleteUser(user.id)">
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Section: Campaigns -->
      <div class="mb-4 p-4 border rounded shadow-sm bg-white">
        <h2 class="text-secondary">Manage Campaigns</h2>
        <ul class="list-group">
          <li 
            v-for="campaign in allCampaigns" 
            :key="campaign.id"
            class="list-group-item d-flex justify-content-between align-items-center">
            <span>{{ campaign.title }} <small class="text-muted">- {{ campaign.description }}</small></span>
            <div>
              <button class="btn btn-sm btn-danger" @click="deleteCampaign(campaign.id)">
                Delete
              </button>
            </div>
          </li>
        </ul>
      </div>

      <!-- Section: Ad Requests -->
      <div class="mb-4 p-4 border rounded shadow-sm bg-white">
        <h2 class="text-secondary">Ad Requests</h2>
        <ul class="list-group">
          <li 
            v-for="adRequest in allAdRequests" 
            :key="adRequest.id"
            class="list-group-item d-flex justify-content-between align-items-center">
            <span>{{ adRequest.messages }} <small class="text-muted">- {{ adRequest.status }}</small></span>
            <button class="btn btn-sm btn-danger" @click="deleteAdRequest(adRequest.id)">
              Delete
            </button>
          </li>
        </ul>
      </div>

      <!-- Section: Influencers -->
      <div class="mb-4 p-4 border rounded shadow-sm bg-white">
        <h2 class="text-secondary">Manage Influencers</h2>
        <ul class="list-group">
          <li 
            v-for="influencer in allInfluencers" 
            :key="influencer.id"
            class="list-group-item d-flex justify-content-between align-items-center">
            <span>{{ influencer.username }} <small class="text-muted">- {{ influencer.niche }}</small></span>
            <button class="btn btn-sm btn-danger" @click="deleteInfluencer(influencer.id)">
              Delete
            </button>
          </li>
        </ul>
      </div>

      <!-- Section: Sponsors -->
      <div class="mb-4 p-4 border rounded shadow-sm bg-white">
        <h2 class="text-secondary">Manage Sponsors</h2>
        <ul class="list-group">
          <li 
            v-for="sponsor in allSponsors" 
            :key="sponsor.id"
            class="list-group-item d-flex justify-content-between align-items-center">
            <span>Sponsor ID: {{ sponsor.id }}</span>
            <button class="btn btn-sm btn-danger" @click="deleteSponsor(sponsor.id)">
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  `,

    data() {
        return {
            allUsers: [], // List of all users
            allCampaigns: [], // List of all campaigns
            allAdRequests: [], // List of all ad requests
            allInfluencers: [], // List of all influencers
            allSponsors: [], // List of all sponsors
            token: localStorage.getItem('auth-token'), // Authentication token from localStorage
            error: null, // Error message
        };
    },

    methods: {
        // Fetch users from the API
        async fetchUsers() {
            try {
                const res = await fetch('/users', {
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    this.allUsers = data;
                } else {
                    this.error = `Failed to fetch users: ${data.message}`;
                }
            } catch (e) {
                this.error = 'An error occurred while fetching users.';
            }
        },

        // Fetch campaigns from the API
        async fetchCampaigns() {
            try {
                const res = await fetch('/api/campaign', {
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    this.allCampaigns = data;
                } else {
                    this.error = `Failed to fetch campaigns: ${data.message}`;
                }
            } catch (e) {
                this.error = 'An error occurred while fetching campaigns.';
            }
        },

        // Fetch ad requests from the API
        async fetchAdRequests() {
            try {
                const res = await fetch('/api/ad_request', {
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    this.allAdRequests = data;
                } else {
                    this.error = `Failed to fetch ad requests: ${data.message}`;
                }
            } catch (e) {
                this.error = 'An error occurred while fetching ad requests.';
            }
        },

        // Fetch influencers from the API
        async fetchInfluencers() {
            try {
                const res = await fetch('/api/influencer', {
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    this.allInfluencers = data;
                } else {
                    this.error = `Failed to fetch influencers: ${data.message}`;
                }
            } catch (e) {
                this.error = 'An error occurred while fetching influencers.';
            }
        },

        // Fetch sponsors from the API
        async fetchSponsors() {
            try {
                const res = await fetch('/api/sponsor', {
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    this.allSponsors = data;
                } else {
                    this.error = `Failed to fetch sponsors: ${data.message}`;
                }
            } catch (e) {
                this.error = 'An error occurred while fetching sponsors.';
            }
        },

        // Approve a user
        async approve(userId) {
            try {
                const res = await fetch(`/activate/sponsor/${userId}`, {
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.message);
                    this.fetchUsers();
                } else {
                    this.error = `Failed to approve user: ${data.message}`;
                }
            } catch (e) {
                this.error = 'An error occurred while approving the user.';
            }
        },

        // Delete a user
        async deleteUser(userId) {
            try {
                const res = await fetch(`/users/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.message);
                    this.fetchUsers();
                } else {
                    this.error = `Failed to delete user: ${data.message}`;
                }
            } catch (e) {
                this.error = 'An error occurred while deleting the user.';
            }
        },

        // Delete a campaign
        async deleteCampaign(campaignId) {
            try {
                const res = await fetch(`/api/campaign/${campaignId}`, {
                    method: 'DELETE',
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.message);
                    this.fetchCampaigns();
                } else {
                    this.error = `Failed to delete campaign: ${data.message}`;
                }
            } catch (e) {
                this.error = 'An error occurred while deleting the campaign.';
            }
        },

        // Delete an ad request
        async deleteAdRequest(adRequestId) {
            try {
                const res = await fetch(`/api/ad-request/${adRequestId}`, {
                    method: 'DELETE',
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.message);
                    this.fetchAdRequests();
                } else {
                    this.error = `Failed to delete ad request: ${data.message}`;
                }
            } catch (e) {
                this.error = 'An error occurred while deleting the ad request.';
            }
        },

        // Delete an influencer
        async deleteInfluencer(influencerId) {
            try {
                const res = await fetch(`/api/influencer/${influencerId}`, {
                    method: 'DELETE',
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.message);
                    this.fetchInfluencers();
                } else {
                    this.error = `Failed to delete influencer: ${data.message}`;
                }
            } catch (e) {
                this.error = 'An error occurred while deleting the influencer.';
            }
        },

        // Delete a sponsor
        async deleteSponsor(sponsorId) {
            try {
                const res = await fetch(`/api/sponsor/${sponsorId}`, {
                    method: 'DELETE',
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.message);
                    this.fetchSponsors();
                } else {
                    this.error = `Failed to delete sponsor: ${data.message}`;
                }
            } catch (e) {
                this.error = 'An error occurred while deleting the sponsor.';
            }
        },

        // Redirect to edit campaign page
        editCampaign(campaignId) {
            this.$router.push(`/edit-campaign/${campaignId}`);
        },
    },

    // Fetch all data when the component is mounted
    mounted() {
        this.fetchUsers();
        this.fetchCampaigns();
        this.fetchAdRequests();
        this.fetchInfluencers();
        this.fetchSponsors();
    },
};
