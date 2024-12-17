export default {
    template: `
    <div class="d-flex justify-content-center align-items-center vh-100 bg-light">
      <!-- Login Card -->
      <div class="card p-4 shadow-lg rounded" style="max-width: 30%; width: 100%; height: auto;">
        <div class="d-flex flex-column justify-content-center p-4">
          <h3 class="text-center mb-4 text-primary">Login</h3>
          <!-- Error Message -->
          <div v-if="error" class="alert alert-danger text-center">{{ error }}</div>
          <form>
            <!-- Email Input -->
            <div class="mb-3">
              <label for="user-email" class="form-label">Email Address</label>
              <input 
                type="email" 
                class="form-control" 
                id="user-email" 
                placeholder="name@example.com" 
                v-model="cred.email">
            </div>
            <!-- Password Input -->
            <div class="mb-3">
              <label for="user-password" class="form-label">Password</label>
              <input 
                type="password" 
                class="form-control" 
                id="user-password" 
                placeholder="Enter your password" 
                v-model="cred.password">
            </div>
            <!-- Login Button -->
            <button 
              type="button" 
              class="btn btn-primary w-100 mt-2" 
              @click="login">Login</button>
          </form>
        </div>
      </div>
    </div>
  `,
    data() {
        return {
            // Credentials for login
            cred: {
                email: null,
                password: null,
            },
            // Error message for failed login attempts
            error: null,
        };
    },
    methods: {
        // Login method to handle user authentication
        async login() {
            try {
                // Send login data to the server
                const res = await fetch('/user-login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.cred),
                });
                const data = await res.json();

                // Handle successful response
                if (res.ok) {
                    if (data.message === "User is not approved") {
                        this.error = data.message;
                        alert(data.message);
                        this.$router.push({ path: '/' });
                    } else {
                        // Save authentication token and role in localStorage
                        localStorage.setItem('auth-token', data.token);
                        localStorage.setItem('role', data.role);

                        // Redirect user based on role
                        switch (data.role) {
                            case 'influencer':
                                this.$router.push({ path: '/influencer-home' });
                                break;
                            case 'sponsor':
                                this.$router.push({ path: '/sponsor-home' });
                                break;
                            case 'admin':
                                this.$router.push({ path: '/admin-info' });
                                break;
                            default:
                                this.error = data.message;
                                alert(data.message);
                                this.$router.push({ path: '/' });
                        }
                    }
                } else {
                    // Display error message on failed login
                    this.error = data.message;
                }
            } catch (err) {
                console.error('Login error:', err);
                this.error = 'Something went wrong. Please try again.';
            }
        },
    },
};
