export default {
    template: `
    <div class="container my-5">
      <!-- Header Section -->
      <div class="row justify-content-center mb-4">
        <div class="col-md-8 text-center">
          <h2 class="text-primary mb-3">Manage Campaigns</h2>
          <router-link to="/campaign-form" class="btn btn-primary me-2">
            Add New Campaign
          </router-link>
          <button class="btn btn-info" @click="downloadCsv">
            Download Campaigns as CSV
          </button>
        </div>
      </div>

      <!-- Campaign Cards Section -->
      <div class="row gy-4">
        <div
          v-for="campaign in allCampaigns"
          :key="campaign.id"
          class="col-md-6 col-lg-4"
        >
          <div class="card h-100 shadow-lg border-0">
            <div class="card-body">
              <h5 class="card-title text-primary">{{ campaign.title }}</h5>
              <p class="card-text text-muted">
                Manage the campaign by viewing, editing, or deleting it.
              </p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button
                class="btn btn-success"
                @click="viewCampaign(campaign.id)"
              >
                View
              </button>
              <button
                class="btn btn-warning"
                @click="editCampaign(campaign.id)"
              >
                Edit
              </button>
              <button
                class="btn btn-danger"
                @click="deleteCampaign(campaign.id)"
              >
                Delete
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
            allCampaigns: [], // List of campaigns fetched from the API
            token: localStorage.getItem('auth-token'), // Authentication token from localStorage
            error: null, // Error message, if any
        };
    },

    methods: {
        /**
         * Fetch all campaigns from the API.
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
                    this.allCampaigns = data; // Populate campaigns
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (error) {
                console.error('Failed to fetch campaigns:', error);
                this.error = 'Failed to fetch campaigns.';
            }
        },

        /**
         * Navigate to the campaign editing page.
         * @param {number} campaign_id - ID of the campaign to edit.
         */
        async editCampaign(campaign_id) {
            this.$router.push({ name: 'campaign-edit', params: { id: campaign_id } });
        },

        /**
         * Delete a specific campaign.
         * @param {number} id - ID of the campaign to delete.
         */
        async deleteCampaign(id) {
            try {
                const res = await fetch(`/api/campaign/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });

                const data = await res.json();

                if (res.ok) {
                    alert(data.message); // Show success message
                    this.fetchCampaigns(); // Refresh the campaign list
                } else {
                    console.error('Error:', data);
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Request failed:', error);
            }
        },

        /**
         * Navigate to the campaign view page.
         * @param {number} campaign_id - ID of the campaign to view.
         */
        viewCampaign(campaign_id) {
            this.$router.push({ name: 'campaign-view', params: { id: campaign_id } });
        },

        /**
         * Request to download a CSV of all campaigns.
         */
        async downloadCsv() {
            try {
                const res = await fetch('/download-csv', {
                    method: 'GET',
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });

                if (res.ok) {
                    const { 'task-id': taskId } = await res.json();
                    this.checkCsvStatus(taskId); // Check the status of the CSV generation
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (error) {
                console.error('Failed to request CSV download:', error);
                this.error = 'Failed to request CSV download.';
            }
        },

        /**
         * Check the status of the CSV file generation and download it.
         * @param {string} taskId - Task ID for the CSV generation.
         */
        async checkCsvStatus(taskId) {
            try {
                const res = await fetch(`/api/get-csv/${taskId}`, {
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });

                if (res.ok) {
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);

                    // Trigger download
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'campaigns.csv';
                    document.body.appendChild(a);
                    a.click();
                    URL.revokeObjectURL(url);
                } else if (res.status === 404) {
                    setTimeout(() => this.checkCsvStatus(taskId), 1000); // Retry after 1 second
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (error) {
                console.error('Failed to check CSV status:', error);
                this.error = 'Failed to check CSV status.';
            }
        },
    },

    async mounted() {
        this.fetchCampaigns(); // Fetch campaigns when component is mounted
    },
};
