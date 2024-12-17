export default {
    template: `
    <div class="container mt-5">
      <!-- Header Section -->
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card shadow mb-4">
            <div class="card-body text-center">
              <h2 class="card-title text-primary">Welcome, Influencer!</h2>
              <p class="text-muted">Manage your ad requests and stay connected with campaigns.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Ad Requests Section -->
      <div v-if="adRequests.length" class="mt-5">
        <h3 class="mb-4 text-center text-success">Your Ad Requests</h3>
        <div class="row justify-content-center">
          <div 
            class="col-lg-4 col-md-6 mb-4" 
            v-for="adRequest in adRequests" 
            :key="adRequest.id"
          >
            <div class="card shadow h-100">
              <div class="card-body">
                <h5 class="card-title text-center text-info">Ad Request</h5>
                <p><strong>Messages:</strong> {{ adRequest.messages }}</p>
                <p><strong>Requirements:</strong> {{ adRequest.requirements }}</p>
                <p><strong>Payment Amount:</strong> {{ adRequest.payment_amount }}</p>
                <p><strong>Status:</strong> 
                  <span 
                    :class="{
                      'text-warning': adRequest.status === 'Pending',
                      'text-success': adRequest.status === 'Accepted',
                      'text-danger': adRequest.status === 'Rejected'
                    }"
                  >
                    {{ adRequest.status }}
                  </span>
                </p>
                <!-- Buttons for actions -->
                <div class="text-center">
                  <button 
                    class="btn btn-warning btn-sm me-2" 
                    v-if="adRequest.status === 'Pending'" 
                    @click="negotiateAdRequest(adRequest.id)"
                  >
                    Negotiate
                  </button>
                  <button 
                    class="btn btn-success btn-sm me-2" 
                    v-if="adRequest.status === 'Pending'" 
                    @click="acceptAdRequest(adRequest.id)"
                  >
                    Accept
                  </button>
                  <button 
                    class="btn btn-danger btn-sm" 
                    v-if="adRequest.status === 'Pending'" 
                    @click="rejectAdRequest(adRequest.id)"
                  >
                    Reject
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger text-center mt-4">
        <strong>Error:</strong> {{ error }}
      </div>
    </div>
  `,

    data() {
        return {
            allCampaigns: [], // Stores all available campaigns
            activeCampaigns: [], // Stores active campaigns
            token: localStorage.getItem('auth-token'), // Authentication token for API calls
            error: null, // Stores any error message to display
            adRequests: [], // Stores ad requests for the influencer
            creator_id: localStorage.getItem('user-id'), // User ID of the influencer
        };
    },

    async created() {
        // Fetch initial data when the component is created
        await this.fetchCampaigns();
        await this.fetchAdRequests();
    },

    methods: {
        // Fetches all campaigns
        async fetchCampaigns() {
            try {
                const res = await fetch(`/api/campaign`, {
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    this.allCampaigns = data; // Adjust based on your API response
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (error) {
                console.error('Failed to fetch campaigns:', error);
                this.error = 'Failed to fetch campaigns.';
            }
        },

        // Fetches ad requests associated with the influencer
        async fetchAdRequests() {
            try {
                const res = await fetch(`/api/ad_request`, {
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    this.adRequests = data; // Adjust based on your API response
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (error) {
                console.error('Failed to fetch ad requests:', error);
                this.error = 'Failed to fetch ad requests.';
            }
        },

        // Updates the status of an ad request
        async updateAdRequestStatus(id, status, paymentAmount = null) {
            try {
                const res = await fetch(`/api/ad_request/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Authentication-Token': this.token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status, payment_amount: paymentAmount }),
                });

                const data = await res.json();

                if (res.ok) {
                    alert(data.message);
                    this.fetchAdRequests(); // Refresh the ad requests after update
                } else {
                    console.error('Error:', data);
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Request failed:', error);
                this.error = 'Failed to update ad request status.';
            }
        },

        // Accepts an ad request
        async acceptAdRequest(id) {
            await this.updateAdRequestStatus(id, 'Accepted');
        },

        // Rejects an ad request
        async rejectAdRequest(id) {
            await this.updateAdRequestStatus(id, 'Rejected');
        },

        // Handles negotiation for an ad request
        async negotiateAdRequest(id) {
            const newPaymentAmount = prompt('Enter a new payment amount:');
            if (newPaymentAmount) {
                await this.updateAdRequestStatus(id, 'Pending', newPaymentAmount);
            }
        },

        // Redirects to the campaign view
        viewCampaign(campaign_id) {
            this.$router.push({ name: 'campaign-view', params: { id: campaign_id } });
        },
    },
};
