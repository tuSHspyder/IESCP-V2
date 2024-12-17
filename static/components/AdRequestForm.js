export default {
    template: `
    <div class="container my-5">
      <!-- Ad Request Form -->
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8 col-sm-10">
          <div class="card shadow">
            <div class="card-header bg-primary text-white text-center">
              <h4 class="mb-0">Ad Request Form</h4>
            </div>
            <div class="card-body">
              <!-- Input for Messages -->
              <div class="mb-3">
                <label for="messages" class="form-label">Messages</label>
                <input 
                  type="text" 
                  id="messages" 
                  class="form-control" 
                  v-model="adRequest.messages" 
                  placeholder="Enter messages"
                />
              </div>

              <!-- Input for Requirements -->
              <div class="mb-3">
                <label for="requirements" class="form-label">Requirements</label>
                <input 
                  type="text" 
                  id="requirements" 
                  class="form-control" 
                  v-model="adRequest.requirements" 
                  placeholder="Enter requirements"
                />
              </div>

              <!-- Input for Payment Amount -->
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

              <!-- Submit Button -->
              <div class="text-center">
                <button 
                  class="btn btn-success px-4 py-2" 
                  @click="createAdRequest"
                >
                  Submit Ad Request
                </button>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="alert alert-danger mt-4 text-center">
            <strong>Error:</strong> {{ error }}
          </div>
        </div>
      </div>
    </div>
  `,

    data() {
        return {
            campaign: null, // Stores campaign details fetched from the server
            adRequest: {
                messages: '', // Stores the messages for the ad request
                requirements: '', // Stores the requirements for the ad request
                payment_amount: '', // Stores the payment amount offered
                campaign_id: null, // The ID of the associated campaign
            },
            token: localStorage.getItem('auth-token'), // Retrieves the authentication token from local storage
            error: null, // Stores any error message
        };
    },

    async created() {
        // Fetch the campaign ID from the route params
        this.adRequest.campaign_id = this.$route.params.id;

        const campaignId = this.$route.params.id;
        try {
            // API call to fetch campaign details
            const res = await fetch(`/api/campaign/${campaignId}`, {
                headers: {
                    'Authentication-Token': this.token,
                },
            });

            if (res.ok) {
                const data = await res.json();
                this.campaign = data.campaign; // Store the campaign details
                this.adRequests = data.adRequests; // Store related ad requests if needed
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
         * Sends a POST request to create a new ad request.
         */
        async createAdRequest() {
            // Validate form inputs
            if (!this.adRequest.messages || !this.adRequest.requirements || !this.adRequest.payment_amount || !this.adRequest.campaign_id) {
                alert('All fields are required');
                return;
            }

            try {
                // API call to create an ad request
                const res = await fetch('/api/ad_request', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token': this.token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.adRequest),
                });

                const data = await res.json();

                if (res.ok) {
                    alert(data.message); // Notify the user of success
                    // Redirect to the campaign view page
                    this.$router.push({ name: 'campaign-view', params: { id: this.$route.params.id } });
                } else {
                    console.error('Error:', data);
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Request failed:', error);
                this.error = error.toString(); // Display error message
            }
        },
    },
};
