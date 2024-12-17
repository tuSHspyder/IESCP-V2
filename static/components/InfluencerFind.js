export default {
    template: `
    <div class="container mt-5">
      <!-- Header Section -->
      <div class="row justify-content-center">
        <div class="col-md-10">
          <div class="card shadow mb-4">
            <div class="card-body text-center">
              <h2 class="card-title">Find Campaigns</h2>
              <p class="text-muted">Search for campaigns or ad requests that match your interests.</p>
            </div>
          </div>

          <!-- Search Form -->
          <form class="input-group mb-4" @submit.prevent="searchItems">
            <input 
              v-model="searchQuery" 
              class="form-control shadow-sm" 
              type="search" 
              placeholder="Enter keywords to search..." 
              aria-label="Search">
            <button class="btn btn-success shadow-sm" type="submit">Search</button>
          </form>

          <!-- Search Results Section -->
          <div v-if="searchResults.campaigns.length || searchResults.ad_requests.length" class="card shadow mb-4">
            <div class="card-body">
              <h4 class="card-title text-center">Search Results</h4>

              <!-- Campaign Results -->
              <div v-if="searchResults.campaigns.length" class="mt-4">
                <h5 class="text-success">Campaigns</h5>
                <div v-for="campaign in searchResults.campaigns" :key="campaign.id" class="row align-items-center mb-3">
                  <div class="col-md-8">
                    <p><strong>{{ campaign.title }}</strong><br>{{ campaign.description }}</p>
                  </div>
                  <div class="col-md-4 text-end">
                    <button class="btn btn-warning btn-sm" @click="viewItem(campaign, 'campaign')">View</button>
                  </div>
                </div>
              </div>

              <!-- Ad Request Results -->
              <div v-if="searchResults.ad_requests.length" class="mt-4">
                <h5 class="text-primary">Ad Requests</h5>
                <div v-for="adRequest in searchResults.ad_requests" :key="adRequest.id" class="row align-items-center mb-3">
                  <div class="col-md-8">
                    <p><strong>{{ adRequest.messages }}</strong><br>{{ adRequest.requirements }}</p>
                  </div>
                  <div class="col-md-4 text-end">
                    <button class="btn btn-warning btn-sm" @click="viewItem(adRequest, 'adRequest')">View</button>
                    <button 
                      v-if="adRequest.campaign_id" 
                      class="btn btn-success btn-sm ms-2" 
                      @click="requestCampaign(adRequest.campaign_id)">
                      Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="alert alert-danger text-center mt-4">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  `,

    data() {
        return {
            searchQuery: '', // Holds the user's search input
            searchResults: {
                campaigns: [], // Stores fetched campaigns
                ad_requests: [] // Stores fetched ad requests
            },
            token: localStorage.getItem('auth-token'), // Authentication token
            error: null, // Error message, if any
        };
    },

    methods: {
        // Fetch search results from the API based on the search query
        async searchItems() {
            if (!this.searchQuery) {
                this.error = 'Please enter a search query.';
                return;
            }

            try {
                const response = await fetch(`/api/search?search=${encodeURIComponent(this.searchQuery)}`, {
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    this.searchResults = {
                        campaigns: data.campaigns || [],
                        ad_requests: data.ad_requests || [],
                    };
                    this.error = null; // Clear error on successful fetch
                } else {
                    this.error = `Error fetching data: ${response.statusText}`;
                }
            } catch (error) {
                console.error('Failed to fetch search results:', error);
                this.error = 'Failed to fetch search results.';
            }
        },

        // Navigate to the detailed view of the selected campaign or ad request
        viewItem(item, type) {
            const routeName = type === 'campaign' ? 'campaign-view' : 'ad-request-view';
            this.$router.push({ name: routeName, params: { id: item.id } });
        },

        // Request to associate with a specific campaign
        requestCampaign(campaign_id) {
            // Implement the request logic here
            console.log(`Requesting association with campaign ID: ${campaign_id}`);
        },
    },
};
