export default {
    template: `
    <div class="container mt-4">
      <!-- Search Section -->
      <div class="row">
        <div class="col-md-8 mx-auto">
          <!-- Search Header -->
          <div class="card shadow mb-4">
            <div class="card-body text-center">
              <h3 class="card-title text-primary">Explore Campaigns, Ad Requests, and Users</h3>
              <p class="text-muted">Search for opportunities or users in one place.</p>
            </div>
          </div>

          <!-- Search Bar -->
          <form class="d-flex mb-4" @submit.prevent="searchItems">
            <input 
              v-model="searchQuery" 
              class="form-control me-2 shadow-sm" 
              type="search" 
              placeholder="Type a keyword..." 
              aria-label="Search">
            <button class="btn btn-outline-primary" type="submit">Search</button>
          </form>

          <!-- Search Results -->
          <div v-if="hasResults" class="card shadow mb-4">
            <div class="card-body">
              <h4 class="card-title">Search Results</h4>
              
              <!-- Campaign Results -->
              <div v-if="searchResults.campaigns.length">
                <h5 class="text-success">Campaigns</h5>
                <div v-for="campaign in searchResults.campaigns" :key="campaign.id" class="row mb-3 align-items-center">
                  <div class="col">
                    <p class="m-0"><strong>{{ campaign.title }}</strong></p>
                    <small class="text-muted">{{ campaign.description }}</small>
                  </div>
                  <div class="col-auto">
                    <button 
                      class="btn btn-sm btn-primary" 
                      @click="viewItem(campaign, 'campaign')">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              <!-- Ad Request Results -->
              <div v-if="searchResults.ad_requests.length">
                <h5 class="text-info">Ad Requests</h5>
                <div v-for="adRequest in searchResults.ad_requests" :key="adRequest.id" class="row mb-3 align-items-center">
                  <div class="col">
                    <p class="m-0"><strong>{{ adRequest.messages }}</strong></p>
                    <small class="text-muted">{{ adRequest.requirements }}</small>
                  </div>
                  <div class="col-auto">
                    <button 
                      class="btn btn-sm btn-primary me-2" 
                      @click="viewItem(adRequest, 'adRequest')">
                      View Details
                    </button>
                    <button 
                      v-if="adRequest.campaign_id" 
                      class="btn btn-sm btn-success" 
                      @click="requestCampaign(adRequest.campaign_id)">
                      Request Campaign
                    </button>
                  </div>
                </div>
              </div>

              <!-- User Results -->
              <div v-if="searchResults.users.length">
                <h5 class="text-warning">Users</h5>
                <div v-for="user in searchResults.users" :key="user.id" class="row mb-3 align-items-center">
                  <div class="col">
                    <p class="m-0"><strong>{{ user.username }}</strong></p>
                    <small class="text-muted">{{ user.email }}</small>
                  </div>
                  <div class="col-auto">
                    <button 
                      class="btn btn-sm btn-primary" 
                      @click="viewItem(user, 'user')">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="alert alert-danger mt-3 text-center">
            {{ error }}
          </div>
        </div>
      </div>
    </div>
  `,
    data() {
        return {
            searchQuery: '', // User's search query
            searchResults: {
                campaigns: [],
                ad_requests: [],
                users: [],
            },
            token: localStorage.getItem('auth-token'), // Authentication token
            error: null, // Error message
        };
    },
    computed: {
        hasResults() {
            // Check if any search results exist
            return (
                this.searchResults.campaigns.length > 0 ||
                this.searchResults.ad_requests.length > 0 ||
                this.searchResults.users.length > 0
            );
        },
    },
    methods: {
        /**
         * Perform a search using the query entered by the user.
         */
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
                        users: data.users || [],
                    };
                    this.error = null; // Clear any previous error
                } else {
                    this.error = `Error fetching data: ${response.statusText}`;
                }
            } catch (error) {
                console.error('Failed to fetch search results:', error);
                this.error = 'Failed to fetch search results.';
            }
        },

        /**
         * Navigate to the detailed view of a selected item.
         * @param {Object} item - The item to view.
         * @param {String} type - The type of the item (campaign, adRequest, user).
         */
        viewItem(item, type) {
            const routeName = type === 'campaign' ? 'campaign-view' : type === 'adRequest' ? 'ad-request-view' : 'user-view';
            this.$router.push({ name: routeName, params: { id: item.id } });
        },

        /**
         * Request to join a campaign.
         * @param {Number} campaign_id - The ID of the campaign to request.
         */
        requestCampaign(campaign_id) {
            alert(`Requested campaign with ID: ${campaign_id}`);
        },
    },
};
