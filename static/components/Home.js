import Welcome from './Welcome.js';
import SponsorHome from './SponsorHome.js';
import InfluencerHome from './InfluencerHome.js';
import AdminHome from './AdminInfo.js';
import Campaign from './SponsorCampaigns.js';

export default {
    template: `
    <div class="app-container">
      <!-- Main Welcome Component -->
      <div class="welcome-section">
        <Welcome />
      </div>

      <!-- User-Specific Section Based on Role -->
      <div v-if="isAuthenticated" class="user-role-section mt-4">
        <div v-if="userRole === 'sponsor'">
          <SponsorHome />
        </div>
        <div v-else-if="userRole === 'influencer'">
          <InfluencerHome />
        </div>
        <div v-else-if="userRole === 'admin'">
          <AdminHome />
        </div>
        <div v-else>
          <p class="text-center text-muted">Role not recognized. Please contact support.</p>
        </div>
      </div>

      <!-- Campaign Section Example (Optional for Specific Role) -->
      <div class="campaign-section mt-5" v-if="userRole === 'sponsor'">
        <h3 class="text-center">Your Campaigns</h3>
        <Campaign />
      </div>
    </div>
  `,

    data() {
        return {
            // Store user role from local storage
            userRole: localStorage.getItem('role'),

            // Store authentication token
            authToken: localStorage.getItem('auth-token'),

            // Check if user is authenticated
            isAuthenticated: !!localStorage.getItem('auth-token'),
        };
    },

    components: {
        Welcome,
        SponsorHome,
        InfluencerHome,
        AdminHome,
        Campaign,
    },
};
