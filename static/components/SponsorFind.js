export default {
    template: `
    <div class="container mt-5">
      <!-- Header Section -->
      <div class="row justify-content-center mb-4">
        <div class="col-md-8 text-center">
          <h2 class="text-primary mb-3">Find Influencers</h2>
        </div>
      </div>

      <!-- Search Form Section -->
      <div class="row mb-4">
        <div class="col-md-8 offset-md-2">
          <form class="d-flex" @submit.prevent="searchItems">
            <input 
              v-model="searchQuery"
              class="form-control me-2 shadow-sm"
              type="search"
              placeholder="Search for influencers..."
              aria-label="Search"
            />
            <button class="btn btn-outline-success shadow-sm" type="submit">
              Search
            </button>
          </form>
        </div>
      </div>

      <!-- Search Results Section -->
      <div v-if="searchResults.influencers.length > 0" class="card mb-4">
        <div class="card-body">
          <h4 class="card-title text-primary">Search Results</h4>
          <div v-for="influencer in searchResults.influencers" :key="influencer.id" class="row mb-3">
            <div class="col-md-8">
              <p class="fw-bold">{{ influencer.username }}</p>
              <p class="text-muted">{{ influencer.niche }}</p>
            </div>
            <div class="col-md-4 text-end">
              <button 
                class="btn btn-success mt-3 shadow-sm"
                @click="adRequestForm(influencer.user_id)"
              >
                Send AdRequest
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Error Section -->
      <div v-if="error" class="alert alert-danger mt-4 text-center">
        <strong>Error:</strong> {{ error }}
      </div>
    </div>
  `,

    data() {
        return {
            searchQuery: '', // User input for search
            searchResults: {
                influencers: [] // Array to store search results
            },
            token: localStorage.getItem('auth-token'), // Token for authentication
            error: null, // Error message if any
        };
    },

    methods: {
        /**
         * Navigate to the ad request form with the influencer's ID.
         * @param {number} influencer_id - The ID of the influencer.
         */
        adRequestForm(influencer_id) {
            this.$router.push({ name: 'sponsor-adRequest-form', params: { id: influencer_id } });
        },

        /**
         * Handle the search for influencers.
         * If no query is entered, show an error message.
         * Fetch search results from the API.
         */
        async searchItems() {
            if (!this.searchQuery) {
                this.error = 'Please enter a search query.';
                return;
            }

            try {
                // Fetch search results from the API
                const response = await fetch(`/api/search?search=${encodeURIComponent(this.searchQuery)}`, {
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    // Set the search results
                    this.searchResults = {
                        influencers: data.influencers || []
                    };
                    if (this.searchResults.influencers.length === 0) {
                        this.error = 'No influencers found.';
                    }
                } else {
                    this.error = `Error fetching data: ${response.statusText}`;
                }
            } catch (error) {
                console.error('Failed to fetch search results:', error);
                this.error = 'Failed to fetch search results.';
            }
        },

        /**
         * View a specific item (campaign or ad request).
         * @param {object} item - The item to view.
         * @param {string} type - The type of item (campaign or ad-request).
         */
        viewItem(item, type) {
            const routeName = type === 'campaign' ? 'campaign-view' : 'ad-request-view';
            this.$router.push({ name: routeName, params: { id: item.id } });
        },

        /**
         * Placeholder function to request a campaign (Not implemented).
         * @param {number} campaign_id - ID of the campaign.
         */
        requestCampaign(campaign_id) {
            // Implement the request campaign logic here
        },
    },
};
