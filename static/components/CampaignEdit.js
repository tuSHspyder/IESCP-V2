export default {
    template: `
    <div class="container my-5">
      <!-- Campaign Edit Form -->
      <div class="row justify-content-center">
        <div class="col-lg-6 col-md-8 col-sm-10">
          <div class="card shadow">
            <div class="card-header bg-primary text-white text-center">
              <h4>Edit Campaign</h4>
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
                  placeholder="Enter niche"
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
                  placeholder="Enter budget"
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
                  class="btn btn-success px-4 py-2" 
                  @click="editCampaign"
                >
                  Submit Changes
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
                campaign_id: '', // Campaign ID
            },
            token: localStorage.getItem('auth-token'), // Authentication token from localStorage
            error: null, // Holds any error message
        };
    },

    methods: {
        /**
         * Fetches campaign details from the server and populates the form fields.
         * @param {string} id - The ID of the campaign to fetch.
         */
        async fetchCampaign(id) {
            try {
                const res = await fetch(`/api/campaign/${id}`, {
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    this.campaign = data.campaign; // Populate form with fetched data
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (error) {
                console.error('Failed to fetch campaign:', error);
                this.error = 'Failed to fetch campaign.';
            }
        },

        /**
         * Submits the edited campaign details to the server.
         */
        async editCampaign() {
            try {
                const url = `/api/campaign/${this.$route.params.id}`;
                const res = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Authentication-Token': this.token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.campaign),
                });

                const data = await res.json();

                if (res.ok) {
                    alert(data.message); // Notify user of success
                    this.$router.push({ path: '/campaigns' }); // Redirect to campaigns list
                } else {
                    console.error('Error:', data);
                    alert(`Error: ${data.message || 'An unknown error occurred'}`);
                }
            } catch (error) {
                console.error('Request failed:', error);
                alert('An error occurred while updating the campaign.');
            }
        },
    },

    mounted() {
        const campaignId = this.$route.params.id; // Get campaign ID from route params
        this.fetchCampaign(campaignId); // Fetch the campaign details on component mount
    },
};
