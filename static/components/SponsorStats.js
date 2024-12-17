export default {
    template: `
    <div class="container mt-5">
      <!-- Header Section -->
      <div class="row justify-content-center mb-4">
        <div class="col-md-8 text-center">
          <h2 class="text-primary display-5 fw-bold">Campaign Statistics</h2>
          <p class="text-muted fs-5">Gain insights into the performance and key metrics of your campaigns.</p>
        </div>
      </div>

      <!-- Graphs & Statistics Section -->
      <div class="row g-4">
        <!-- Graphs Card -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm rounded-lg h-100">
            <div class="card-body">
              <h4 class="card-title text-primary fw-semibold">Campaign Performance Graphs</h4>
              <p class="card-text text-muted">Visualize data trends and insights.</p>
              <!-- Placeholder for charts -->
              <div class="d-flex justify-content-center align-items-center" style="height: 200px; background-color: #f8f9fa; border-radius: 10px;">
                <span class="text-secondary">Graph placeholder (Integrate your chart library here)</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics Card -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm rounded-lg h-100">
            <div class="card-body">
              <h4 class="card-title text-info fw-semibold">Detailed Campaign Statistics</h4>
              <p class="card-text text-muted">Track metrics such as engagement, reach, and more.</p>
              <!-- Placeholder for statistics or tables -->
              <div class="d-flex justify-content-center align-items-center" style="height: 200px; background-color: #f8f9fa; border-radius: 10px;">
                <span class="text-secondary">Statistics placeholder (Add detailed metrics here)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger mt-4 text-center rounded-pill">
        <strong>Error:</strong> {{ error }}
      </div>
    </div>
  `,

    data() {
        return {
            allCampaigns: [], // Store campaigns
            token: localStorage.getItem('auth-token'), // Authentication token from localStorage
            error: null, // Error message for displaying API errors
        };
    },

    // Fetch campaigns when component is created
    async created() {
        this.fetchCampaigns();
    },

    methods: {
        /**
         * Fetch the list of all campaigns from the API.
         */
        async fetchCampaigns() {
            try {
                const res = await fetch('/api/campaign', {
                    headers: {
                        'Authentication-Token': this.token, // Include auth token in the request header
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    this.allCampaigns = data; // Populate campaign data
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`; // Handle HTTP errors
                }
            } catch (error) {
                console.error('Failed to fetch campaigns:', error);
                this.error = 'Failed to fetch campaigns. Please try again later.'; // Handle fetch failure
            }
        },

        /**
         * Redirect to the campaign view page.
         * @param {number} campaign_id - The ID of the campaign to view.
         */
        viewCampaign(campaign_id) {
            this.$router.push({ name: 'campaign-view', params: { id: campaign_id } }); // Navigate to the campaign view page
        },
    },

    // Fetch campaigns on component mount
    mounted() {
        this.fetchCampaigns();
    },
};
