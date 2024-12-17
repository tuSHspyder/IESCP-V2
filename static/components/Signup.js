export default {
    template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <!-- Sign-Up Card -->
      <div class="card p-4 shadow-lg rounded" style="max-width: 30%; width: 100%; height: auto;">
        <!-- Form Section -->
        <div class="d-flex flex-column justify-content-center p-4">
          <!-- Error Message -->
          <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
          <h2 class="text-center text-primary mb-4">Create Your Account</h2>
          <form>
            <!-- Username Input -->
            <div class="mb-3">
              <label for="user-username" class="form-label">Your Name</label>
              <input 
                type="text" 
                class="form-control" 
                id="user-username" 
                placeholder="Enter your name" 
                v-model="userData.username">
            </div>
            <!-- Email Input -->
            <div class="mb-3">
              <label for="user-email" class="form-label">Email Address</label>
              <input 
                type="email" 
                class="form-control" 
                id="user-email" 
                placeholder="name@example.com" 
                v-model="userData.email">
            </div>
            <!-- Password Input -->
            <div class="mb-3">
              <label for="user-password" class="form-label">Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="user-password" 
                placeholder="Enter a strong password" 
                v-model="userData.password">
            </div>
            <!-- Role Selection -->
            <div class="mb-3">
              <label for="user-role" class="form-label">Choose Role</label>
              <select 
                class="form-select" 
                id="user-role" 
                v-model="userData.role">
                <option value="">Select Role</option>
                <option value="influencer">Influencer</option>
                <option value="sponsor">Sponsor</option>
              </select>
            </div>
            <!-- Niche Input (Visible for Influencers Only) -->
            <div class="mb-3" v-if="userData.role === 'influencer'">
              <label for="user-niche" class="form-label">Niche</label>
              <input 
                type="text" 
                class="form-control" 
                id="user-niche" 
                placeholder="Enter your niche (e.g., Fitness, Fashion)" 
                v-model="userData.niche">
            </div>
            <!-- Sign-Up Button -->
            <button 
              type="button" 
              class="btn btn-primary w-100" 
              @click="signup">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  `,
    data() {
        return {
            // User input data
            userData: {
                username: null,
                email: null,
                password: null,
                role: "",
                niche: "",
            },
            // Error message to display if validation fails
            error: null,
        };
    },
    methods: {
        // Sign-up method to send user data to the backend
        async signup() {
            const { username, email, password, role, niche } = this.userData;

            // Basic validation to check all required fields
            if (!username || !email || !password || !role) {
                this.error = "Please fill in all fields";
                return;
            }

            try {
                // API call to sign up the user
                const res = await fetch('/signup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, email, password, role, niche }),
                });

                const data = await res.json();

                if (res.ok) {
                    // Redirect to login page on successful sign-up
                    this.$router.push({ path: '/login' });
                } else {
                    // Display error message from the server
                    this.error = data.message;
                }
            } catch (err) {
                // Handle any unexpected errors
                console.error("Error during sign-up:", err);
                this.error = "An unexpected error occurred. Please try again.";
            }
        },
    },
};
