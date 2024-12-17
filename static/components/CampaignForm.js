export default {
    template: `
    <div class="container my-5">
      <!-- Campaign Creation Form -->
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8 col-sm-10">
          <div class="card shadow">
            <div class="card-header bg-success text-white text-center">
              <h4>Create a New Campaign</h4>
            </div>
            <div class="card-body">
              <!-- Input: Title -->
              <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input 
                  type="text" 
                  id="title" 
                  class="form-control" 
                  v-model="campaign.title" 
                  placeholder="Enter campaign title" 
                />
              </div>

              <!-- Input: Description -->
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea 
                  id="description" 
                  class="form-control" 
                  v-model="campaign.description" 
                  placeholder="Enter campaign description" 
                  rows="3"
                ></textarea>
              </div>

              <!-- Input: Niche -->
              <div class="mb-3">
                <label for="niche" class="form-label">Niche</label>
                <input 
                  type="text" 
                  id="niche" 
                  class="form-control" 
                  v-model="campaign.niche" 
                  placeholder="Enter campaign niche" 
                />
              </div>

              <!-- Input: Budget -->
              <div class="mb-3">
                <label for="budget" class="form-label">Budget</label>
                <input 
                  type="number" 
                  id="budget" 
                  class="form-control" 
                  v-model="campaign.budget" 
                  placeholder="Enter campaign budget" 
                />
              </div>

              <!-- Input: Goals -->
              <div class="mb-3">
                <label for="goals" class="form-label">Goals</label>
                <textarea 
                  id="goals" 
                  class="form-control" 
                  v-model="campaign.goals" 
                  placeholder="Enter campaign goals" 
                  rows="3"
                ></textarea>
              </div>

              <!-- Submit Button -->
              <div class="text-center">
                <button 
                  class="btn btn-primary px-4 py-2" 
                  @click="createCampaign"
                >
                  Create Campaign
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
            campaign: {
                title: '', // Campaign title
                description: '', // Campaign description
                niche: '', // Campaign niche
                budget: '', // Campaign budget
                goals: '', // Campaign goals
            },
            token: localStorage.getItem('auth-token'), // Authentication token from localStorage
            error: null, // Error message to display in case of an issue
        };
    },

    methods: {
        /**
         * Creates a new campaign and sends data to the server.
         */
        async createCampaign() {
            // Validate required fields
            if (!this.campaign.title || !this.campaign.description || !this.campaign.niche) {
                alert('All fields are required');
                return;
            }

            try {
                // Send POST request to create a new campaign
                const res = await fetch('/api/campaign', {
                    method: 'POST',
                    headers: {
                        'Authentication-Token': this.token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.campaign),
                });

                const data = await res.json();

                if (res.ok) {
                    // Show success message and redirect to campaigns page
                    alert(data.message);
                    this.$router.push({ path: '/sponsor-campaigns' });
                } else {
                    // Handle server error response
                    console.error('Error:', data);
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                // Log and show error in case of a failed request
                console.error('Request failed:', error);
                this.error = 'An error occurred while creating the campaign.';
            }
        },
    },
};
