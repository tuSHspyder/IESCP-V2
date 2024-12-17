export default {
    template: `
    <div class="container mt-5">
      <!-- Page Header -->
      <div class="row justify-content-center mb-4">
        <div class="col-lg-8">
          <div class="card shadow text-center">
            <div class="card-body">
              <h2 class="text-primary">Campaign Dashboard</h2>
              <p class="text-muted">Overview of statistics and campaign data</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Statistics and Graphs Section -->
      <div class="row">
        <!-- Graphs Section -->
        <div class="col-lg-6 mb-4">
          <div class="card shadow h-100">
            <div class="card-body">
              <h5 class="text-success mb-3">Campaign Graphs</h5>
              <p class="text-muted">Visualize campaign trends and performance here.</p>
              <!-- Placeholder for graphs -->
              <div class="bg-light rounded p-5 text-center">
                <i class="bi bi-bar-chart-line text-secondary fs-1"></i>
                <p class="text-muted mt-3">Graph content will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>

        <!-- More Statistics Section -->
        <div class="col-lg-6 mb-4">
          <div class="card shadow h-100">
            <div class="card-body">
              <h5 class="text-info mb-3">More Campaign Statistics</h5>
              <p class="text-muted">Gain insights into your campaign performance.</p>
              <!-- Placeholder for additional stats -->
              <div class="bg-light rounded p-5 text-center">
                <i class="bi bi-pie-chart-fill text-secondary fs-1"></i>
                <p class="text-muted mt-3">Statistics content will be displayed here.</p>
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
            allCampaigns: [], // Array to store campaign data
            token: localStorage.getItem('auth-token'), // Authentication token for API calls
            error: null, // Error message to display
        };
    },

    methods: {
        /**
         * Fetches campaign data from the API and populates the `allCampaigns` array.
         */
        async fetchCampaigns() {
            try {
                const res = await fetch('/api/campaign', {
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    this.allCampaigns = data; // Assign data from the API response
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`; // Set error message
                }
            } catch (error) {
                console.error('Failed to fetch campaigns:', error);
                this.error = 'Failed to fetch campaigns.'; // Display error message
            }
        },

        /**
         * Navigates to a detailed view of a specific campaign.
         * @param {number} campaign_id - The ID of the campaign to view.
         */
        viewCampaign(campaign_id) {
            this.$router.push({ name: 'campaign-view', params: { id: campaign_id } });
        },
    },

    /**
     * Lifecycle hook that fetches campaign data when the component is mounted.
     */
    async mounted() {
        this.fetchCampaigns();
    },
};
