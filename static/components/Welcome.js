const Welcome = {
    template: `
        <div class="d-flex justify-content-center align-items-center min-vh-100 bg-light">
            <!-- Card Container -->
            <div class="card p-4 shadow-lg rounded-lg" style="max-width: 90%; width: 100%; height: 70%;">
                <div class="row g-0 h-100">
                    <!-- Left Section: Image -->
                    <div class="col-md-6 d-flex justify-content-center align-items-center bg-secondary rounded-start">
                        <img src="static/images/Login_image.jpg" class="img-fluid rounded-start shadow-sm" alt="Login Illustration">
                    </div>
                    <!-- Right Section: Content -->
                    <div class="col-md-6 d-flex flex-column justify-content-center align-items-center bg-white rounded-end p-4">
                        <h3 class="card-title text-center mb-4 fw-bold text-primary">Welcome to IESCP V2!</h3>
                        <div v-if="!isAuthenticated" class="w-100">
                            <!-- Login Button -->
                            <router-link 
                                class="btn btn-primary btn-lg w-75 mb-3 d-block mx-auto fw-semibold" 
                                to="/login">
                                Login
                            </router-link>
                            <!-- Signup Button -->
                            <router-link 
                                class="btn btn-outline-secondary btn-lg w-75 d-block mx-auto fw-semibold" 
                                to="/sign-up">
                                Signup
                            </router-link>
                        </div>
                        <!-- If User is Already Logged In -->
                        <div v-if="isAuthenticated" class="text-center">
                            <h5 class="text-success">You are already Logged-in</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    data() {
        return {
            role: localStorage.getItem('role'), // Fetch the user's role from localStorage
            isAuthenticated: !!localStorage.getItem('Authentication-Token'), // Check if the user is authenticated
        };
    },
};

export default Welcome;
