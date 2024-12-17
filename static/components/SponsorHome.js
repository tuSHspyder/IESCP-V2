export default {
    // Main template defining the layout of the page
    template: `
    <div class="container my-4">
      <div class="row">
        <div class="col-md-8 mx-auto">
          <!-- Welcome Card -->
          <div class="card mb-4 shadow-sm">
            <div class="card-body text-center">
              <h3 class="card-title">Welcome Sponsor</h3>
            </div>
          </div>

          <!-- Active Campaigns Section -->
          <div v-if="allCampaigns.length" class="card mb-4 shadow-sm">
            <div class="card-header bg-primary text-white">
              <h4>Active Campaigns</h4>
            </div>
            <div class="row m-3">
              <div 
                v-for="campaign in allCampaigns" 
                :key="campaign.id" 
                class="col-12 mb-3"
              >
                <div class="card border-primary shadow-sm">
                  <div class="card-body">
                    <h5 class="card-title">{{ campaign.title }}</h5>
                    <div class="d-flex justify-content-between">
                      <button 
                        class="btn btn-success" 
                        @click="viewCampaign(campaign.id)"
                      >
                        View
                      </button>
                      <button 
                        class="btn btn-warning" 
                        @click="editCampaign(campaign.id)"
                      >
                        Edit
                      </button>
                      <button 
                        class="btn btn-danger" 
                        @click="deleteCampaign(campaign.id)"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- New Ad Requests Section -->
          <div v-if="adRequests.length" class="card shadow-sm">
            <div class="card-header bg-info text-white">
              <h4>New Requests</h4>
            </div>
            <div class="card-body">
              <div 
                v-for="request in adRequests" 
                :key="request.id" 
                class="row align-items-center mb-3"
              >
                <div class="col">
                  <p>
                    Campaign ID: {{ request.campaign_id }} | 
                    Influencer ID: {{ request.influencer_id }}
                  </p>
                </div>
                <div class="col text-end">
                  <button type="button" class="btn btn-warning">View</button>
                  <button type="button" class="btn btn-success">Accept</button>
                  <button type="button" class="btn btn-danger">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Alert -->
      <div v-if="error" class="alert alert-danger mt-4 text-center">
        {{ error }}
      </div>
    </div>
  `,

    // Component data
    data() {
        return {
            allCampaigns: [], // List of all active campaigns
            token: localStorage.getItem('auth-token'), // Authentication token
            error: null, // Error message for UI display
            adRequests: [] // List of new ad requests
        };
    },

    // Lifecycle hook to fetch data upon component creation
    async created() {
        try {
            const res = await fetch('/api/campaign', {
                headers: {
                    'Authentication-Token': this.token
                }
            });
            if (res.ok) {
                const data = await res.json();
                this.allCampaigns = data.campaign || [];
                this.adRequests = data.adRequests || [];
            } else {
                this.error = `Error ${res.status}: ${res.statusText}`;
            }
        } catch (error) {
            console.error('Failed to fetch campaign details:', error);
            this.error = 'Failed to fetch campaign details.';
        }
    },

    // Methods for handling campaigns and requests
    methods: {
        // Fetches all campaigns
        async fetchCampaigns() {
            try {
                const res = await fetch('/api/campaign', {
                    headers: {
                        'Authentication-Token': this.token
                    }
                });
                if (res.ok) {
                    this.allCampaigns = await res.json();
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (error) {
                console.error('Failed to fetch campaigns:', error);
                this.error = 'Failed to fetch campaigns.';
            }
        },

        // Redirects to edit campaign page
        editCampaign(campaign_id) {
            this.$router.push({ name: 'campaign-edit', params: { id: campaign_id } });
        },

        // Deletes a campaign
        async deleteCampaign(id) {
            try {
                const res = await fetch(`/api/campaign/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authentication-Token': this.token
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    alert(data.message);
                    this.fetchCampaigns(); // Refresh campaign list
                } else {
                    console.error('Error:', await res.json());
                }
            } catch (error) {
                console.error('Request failed:', error);
                this.error = 'Failed to delete campaign.';
            }
        },

        // Redirects to view campaign page
        viewCampaign(campaign_id) {
            this.$router.push({ name: 'campaign-view', params: { id: campaign_id } });
        }
    },

    // Fetch campaigns when the component is mounted
    mounted() {
        this.fetchCampaigns();
    }
};
