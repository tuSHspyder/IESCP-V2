import router from './router.js';
import Navbar from './components/Navbar.js';

// Global Navigation Guard
router.beforeEach((to, from, next) => {
    // Currently, all routes are allowed. Customize this logic for authentication or other checks.
    next();
});

// Root Vue Instance
new Vue({
    el: '#app',

    // Main Template
    template: `
    <div class="app-container">
      <!-- Navbar Component -->
      <Navbar :key="hasChanged" />
      
      <!-- Main View for Routing -->
      <div class="content-container p-3">
        <router-view />
      </div>
    </div>
  `,

    router, // Inject the router instance

    components: {
        Navbar, // Register the Navbar component
    },

    data() {
        return {
            hasChanged: true, // State to trigger Navbar re-render on route change
        };
    },

    watch: {
        /**
         * Watch for route changes to toggle the `hasChanged` state.
         * This ensures the Navbar re-renders when the route changes.
         */
        $route(to, from) {
            this.hasChanged = !this.hasChanged;
        },
    },
});
