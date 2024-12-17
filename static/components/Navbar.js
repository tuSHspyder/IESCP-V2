export default {
    template: `
    <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm border-bottom">
      <div class="container-fluid">
        <!-- Brand -->
        <a class="navbar-brand text-primary fw-bold" >
          <i class="fa-solid fa-lemon me-2"></i>IESCP V2
        </a>

        <!-- Toggle Button for Small Screens -->
        <button 
          class="navbar-toggler border-0" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Navbar Links -->
        <div class="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul class="navbar-nav align-items-center">
            <!-- Admin Links -->
            <template v-if="role === 'admin'">
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/admin-info">Info</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/admin-users">Users</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/admin-find">Find</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/admin-stats">Stats</router-link>
              </li>
            </template>

            <!-- Influencer Links -->
            <template v-if="role === 'influencer'">
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/influencer-home">Profile</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/influencer-find">Find</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/influencer-stats">Stats</router-link>
              </li>
            </template>

            <!-- Sponsor Links -->
            <template v-if="role === 'sponsor'">
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/sponsor-home">Profile</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/sponsor-campaigns">Campaigns</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/sponsor-find">Find</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/sponsor-stats">Stats</router-link>
              </li>
            </template>

            <!-- Public Links -->
            <template v-if="!is_login">
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/login">Login</router-link>
              </li>
              <li class="nav-item">
                <router-link class="nav-link text-secondary fw-semibold" to="/sign-up">Sign-up</router-link>
              </li>
            </template>

            <!-- Logout Button -->
            <li class="nav-item" v-if="is_login">
              <button class="btn btn-outline-danger fw-semibold nav-link" @click="logout">Logout</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  `,
    data() {
        return {
            // Fetch user role and authentication status from localStorage
            role: localStorage.getItem('role'),
            is_login: localStorage.getItem('auth-token'),
        };
    },
    methods: {
        // Logout function to clear user session and redirect to home
        logout() {
            localStorage.removeItem('auth-token');
            localStorage.removeItem('role');
            this.$router.push({ path: '/' });
        },
    },
};
