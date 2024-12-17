export default {
    template: `
    <div class="container mt-5">
      <!-- Page Header -->
      <h1 class="text-center text-primary mb-4">Admin Dashboard</h1>

      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger text-center mb-4">
        <strong>Error:</strong> {{ error }}
      </div>

      <!-- Charts Section -->
      <div class="row">
        <!-- Bar Chart -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">Campaigns vs Ad Requests</h5>
            </div>
            <div class="card-body">
              <canvas id="barChart"></canvas>
            </div>
          </div>
        </div>

        <!-- Pie Chart -->
        <div class="col-md-6 mb-4">
          <div class="card shadow-sm">
            <div class="card-header bg-primary text-white">
              <h5 class="mb-0">User Roles Distribution</h5>
            </div>
            <div class="card-body">
              <canvas id="pieChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,

    data() {
        return {
            allCampaigns: [], // Stores fetched campaigns
            allAdRequests: [], // Stores fetched ad requests
            allUsers: [], // Stores fetched users
            token: localStorage.getItem('auth-token'), // Authentication token
            error: null, // Error message for API calls
            barChart: null, // Chart.js instance for bar chart
            pieChart: null, // Chart.js instance for pie chart
        };
    },

    methods: {
        /**
         * Fetch campaigns from the API and update charts.
         */
        async fetchCampaigns() {
            try {
                const res = await fetch('/api/campaign', {
                    headers: { 'Authentication-Token': this.token },
                });

                if (res.ok) {
                    this.allCampaigns = await res.json();
                    this.updateCharts();
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (err) {
                console.error('Failed to fetch campaigns:', err);
                this.error = 'Failed to fetch campaigns.';
            }
        },

        /**
         * Fetch ad requests from the API and update charts.
         */
        async fetchAdRequests() {
            try {
                const res = await fetch('/api/ad_request', {
                    headers: { 'Authentication-Token': this.token },
                });

                if (res.ok) {
                    this.allAdRequests = await res.json();
                    this.updateCharts();
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (err) {
                console.error('Failed to fetch ad requests:', err);
                this.error = 'Failed to fetch ad requests.';
            }
        },

        /**
         * Fetch users from the API and update charts.
         */
        async fetchUsers() {
            try {
                const res = await fetch('/api/user', {
                    headers: { 'Authentication-Token': this.token },
                });

                if (res.ok) {
                    this.allUsers = await res.json();
                    this.updateCharts();
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (err) {
                console.error('Failed to fetch users:', err);
                this.error = 'Failed to fetch users.';
            }
        },

        /**
         * Update the bar and pie charts with fetched data.
         */
        updateCharts() {
            // Bar Chart: Campaigns vs Ad Requests
            const ctxBar = document.getElementById('barChart').getContext('2d');
            if (this.barChart) this.barChart.destroy(); // Destroy old chart instance
            this.barChart = new Chart(ctxBar, {
                type: 'bar',
                data: {
                    labels: ['Campaigns', 'Ad Requests'],
                    datasets: [{
                        label: 'Count',
                        data: [this.allCampaigns.length, this.allAdRequests.length],
                        backgroundColor: 'rgba(54, 162, 235, 0.7)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: { beginAtZero: true },
                    },
                },
            });

            // Pie Chart: User Roles Distribution
            const roleCounts = this.allUsers.reduce((counts, user) => {
                user.roles.forEach(role => {
                    counts[role] = (counts[role] || 0) + 1;
                });
                return counts;
            }, {});

            const roleLabels = Object.keys(roleCounts);
            const roleData = Object.values(roleCounts);
            const ctxPie = document.getElementById('pieChart').getContext('2d');
            if (this.pieChart) this.pieChart.destroy(); // Destroy old chart instance
            this.pieChart = new Chart(ctxPie, {
                type: 'pie',
                data: {
                    labels: ['Admin','Influencer','Sponser'],
                    datasets: [{
                        label: 'User Roles',
                        data: roleData,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.7)',
                            'rgba(54, 162, 235, 0.7)',
                            'rgba(75, 192, 192, 0.7)',
                            'rgba(255, 205, 86, 0.7)',
                            'rgba(153, 102, 255, 0.7)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(75, 192, 192, 1)',
                            'rgba(255, 205, 86, 1)',
                            'rgba(153, 102, 255, 1)',
                        ],
                        borderWidth: 1,
                    }],
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                },
            });
        },
    },

    /**
     * Fetch all data when the component is mounted.
     */
    mounted() {
        this.fetchCampaigns();
        this.fetchAdRequests();
        this.fetchUsers();
    },
};
