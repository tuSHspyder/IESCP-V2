export default {
    template: `
    <div class="container my-5">
      <!-- Page Header -->
      <div class="row justify-content-center">
        <div class="col-md-8">
          <div class="card shadow-lg">
            <div class="card-body">
              <h3 class="text-center text-primary mb-4">Submit Your Ad Request</h3>
              <p class="text-center text-muted">Complete the form below to send your ad request.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Form Section -->
      <div class="row justify-content-center mt-4">
        <div class="col-md-6">
          <div class="card p-4 shadow">
            <div class="mb-3">
              <label for="messages" class="form-label">Messages</label>
              <input
                type="text"
                id="messages"
                class="form-control"
                v-model="adRequest.messages"
                placeholder="Enter your message"
              />
            </div>
            <div class="mb-3">
              <label for="requirements" class="form-label">Requirements</label>
              <textarea
                id="requirements"
                class="form-control"
                v-model="adRequest.requirements"
                rows="3"
                placeholder="Enter requirements"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="paymentAmount" class="form-label">Payment Amount</label>
              <input
                type="number"
                id="paymentAmount"
                class="form-control"
                v-model="adRequest.payment_amount"
                placeholder="Enter payment amount"
              />
            </div>
            <div class="mb-3">
              <label for="campaigns" class="form-label">Select Campaign</label>
              <select id="campaigns" class="form-select" v-model="selectedCampaign">
                <option disabled value="">-- Choose a campaign --</option>
                <option
                  v-for="campaign in campaigns"
                  :key="campaign.id"
                  :value="campaign.id"
                >
                  {{ campaign.title }}
                </option>
              </select>
            </div>
            <div class="text-center">
              <button
                class="btn btn-primary w-100 py-2"
                @click="createAdRequest"
              >
                Submit Ad Request
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger mt-4 text-center">
        <strong>Error:</strong> {{ error }}
      </div>
    </div>
  `,

    data() {
        return {
            campaigns: [], // List of campaigns fetched from the API
            selectedCampaign: null, // The selected campaign ID
            adRequest: {
                messages: '', // Message for the ad request
                requirements: '', // Requirements for the ad request
                payment_amount: '', // Proposed payment amount
            },
            token: localStorage.getItem('auth-token'), // Authentication token
            error: null, // Error message, if any
        };
    },

    async created() {
        /**
         * Fetch campaigns from the API when the component is created.
         */
        try {
            const res = await fetch(`/api/campaign`, {
                headers: {
                    'Authentication-Token': this.token,
                },
            });

            if (res.ok) {
                const data = await res.json();
                this.campaigns = data; // Populate campaigns with the API response
            } else {
                const errorData = await res.json();
                this.error = `Error ${res.status}: ${errorData.message || res.statusText}`;
            }
        } catch (error) {
            console.error('Failed to fetch campaigns:', error);
            this.error = 'Failed to fetch campaigns.';
        }
    },

    methods: {
        /**
         * Submit the ad request form to the server.
         */
        async createAdRequest() {
            if (
                !this.adRequest.messages ||
                !this.adRequest.requirements ||
                !this.adRequest.payment_amount ||
                !this.selectedCampaign
            ) {
                alert('All fields are required.');
                return;
            }

            try {
                const res = await fetch('/api/ad_request', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token': this.token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...this.adRequest,
                        campaign_id: this.selectedCampaign, // Associate request with the selected campaign
                        influencer_id: this.$route.params.id, // Assuming influencer ID is passed via route params
                    }),
                });

                const data = await res.json();

                if (res.ok) {
                    alert(data.message); // Success feedback
                    this.$router.push({
                        name: 'campaign-view',
                        params: { id: this.selectedCampaign },
                    }); // Navigate to campaign view
                } else {
                    console.error('Error:', data);
                    alert(`Error: ${data.message}`); // Error feedback
                }
            } catch (error) {
                console.error('Request failed:', error);
                this.error = error.toString(); // Set error message for UI display
            }
        },
    },
};
