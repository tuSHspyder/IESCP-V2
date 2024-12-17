export default {
    template: `
    <div class="container my-5">
      <!-- Error Display -->
      <div v-if="error" class="alert alert-danger text-center">
        Error: {{ error }}
      </div>

      <!-- Campaign Details -->
      <div v-else-if="campaign" class="card shadow mb-4">
        <div class="card-header text-center bg-primary text-white">
          <h2>{{ campaign.title }}</h2>
        </div>
        <div class="card-body">
          <p><strong>Description:</strong> {{ campaign.description }}</p>
          <p><strong>Niche:</strong> {{ campaign.niche }}</p>
          <p><strong>Budget:</strong> {{ campaign.budget }}</p>
          <p><strong>Goals:</strong> {{ campaign.goals }}</p>
          <!-- Ad Request Button (Visible only to influencers) -->
          <div class="text-center mt-3">
            <button 
              class="btn btn-success" 
              @click="adRequestForm(campaign.id)" 
              v-if="role === 'influencer'"
            >
              Send Ad Request
            </button>
          </div>
        </div>
      </div>

      <!-- Associated Ad Requests -->
      <div v-if="adRequests.length" class="mt-4">
        <h3 class="text-center mb-4">Associated Ad Requests</h3>
        <div class="row">
          <div 
            class="col-lg-4 col-md-6 mb-4" 
            v-for="adRequest in adRequests" 
            :key="adRequest.id"
          >
            <div class="card shadow h-100">
              <div class="card-body">
                <p><strong>Messages:</strong> {{ adRequest.messages }}</p>
                <p><strong>Requirements:</strong> {{ adRequest.requirements }}</p>
                <p><strong>Payment Amount:</strong> {{ adRequest.payment_amount }}</p>
                <p><strong>Status:</strong> 
                  <span :class="statusBadgeClass(adRequest.status)">
                    {{ adRequest.status }}
                  </span>
                </p>
                <div class="d-flex justify-content-between mt-3">
                  <button 
                    class="btn btn-warning btn-sm" 
                    @click="editAdRequest(adRequest.id)"
                  >
                    Edit
                  </button>
                  <button 
                    class="btn btn-danger btn-sm" 
                    @click="deleteAdRequest(adRequest.id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

    data() {
        return {
            campaign: null, // Campaign details
            adRequests: [], // List of associated ad requests
            error: null, // Error message
            role: localStorage.getItem('role'), // User role (e.g., 'influencer')
        };
    },

    async created() {
        // Fetch campaign and associated ad requests when the component is created
        const campaignId = this.$route.params.id;
        try {
            const res = await fetch(`/api/campaign/${campaignId}`, {
                headers: {
                    'Authentication-Token': localStorage.getItem('auth-token'),
                },
            });
            if (res.ok) {
                const data = await res.json();
                this.campaign = data.campaign;
                this.adRequests = data.adRequests;
            } else {
                this.error = `Error ${res.status}: ${res.statusText}`;
            }
        } catch (error) {
            console.error('Failed to fetch campaign details:', error);
            this.error = 'Failed to fetch campaign details.';
        }
    },

    methods: {
        /**
         * Redirects to the ad request form page for a specific campaign.
         */
        adRequestForm(campaign_id) {
            this.$router.push({ name: 'adRequest-form', params: { id: campaign_id } });
        },

        /**
         * Redirects to the ad request edit page for a specific ad request.
         */
        editAdRequest(adRequest_id) {
            this.$router.push({ name: 'adRequest-edit', params: { id: adRequest_id } });
        },

        /**
         * Deletes an ad request and refreshes the list of associated ad requests.
         */
        async deleteAdRequest(id) {
            try {
                const res = await fetch(`/api/ad_request/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token'),
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    alert(data.message);
                    this.fetchAdRequests(); // Refresh the list of ad requests
                } else {
                    const errorData = await res.json();
                    console.error('Error:', errorData);
                    alert(`Error: ${errorData.message}`);
                }
            } catch (error) {
                console.error('Request failed:', error);
                alert('Request failed. Please try again.');
            }
        },

        /**
         * Fetches updated ad requests for the current campaign.
         */
        async fetchAdRequests() {
            const campaignId = this.$route.params.id;
            try {
                const res = await fetch(`/api/campaign/${campaignId}`, {
                    headers: {
                        'Authentication-Token': localStorage.getItem('auth-token'),
                    },
                });
                if (res.ok) {
                    const data = await res.json();
                    this.campaign = data.campaign;
                    this.adRequests = data.adRequests;
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (error) {
                console.error('Failed to fetch campaign details:', error);
                this.error = 'Failed to fetch campaign details.';
            }
        },

        /**
         * Determines the badge class for displaying the ad request status.
         * @param {string} status - The status of the ad request.
         * @returns {string} - CSS class for the status badge.
         */
        statusBadgeClass(status) {
            switch (status) {
                case 'pending':
                    return 'badge bg-warning text-dark';
                case 'approved':
                    return 'badge bg-success';
                case 'rejected':
                    return 'badge bg-danger';
                default:
                    return 'badge bg-secondary';
            }
        },
    },
};
