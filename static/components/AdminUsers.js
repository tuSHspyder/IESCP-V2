export default {
    template: `
    <div class="container mt-5">
      <!-- Error Message -->
      <div v-if="error" class="alert alert-danger text-center">
        <strong>Error:</strong> {{ error }}
      </div>

      <!-- Users Section -->
      <div class="card shadow-sm mb-5">
        <div class="card-header bg-primary text-white">
          <h3 class="mb-0">Manage Users</h3>
        </div>
        <div class="card-body">
          <div v-if="allUsers.length === 0" class="text-center">
            <p class="text-muted">No users found.</p>
          </div>
          <ul class="list-group">
            <li 
              v-for="user in allUsers" 
              :key="user.id" 
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <!-- User Info -->
              <div>
                <strong>{{ user.email }}</strong>
                <span class="badge" 
                      :class="{'bg-success': user.active, 'bg-secondary': !user.active}">
                  {{ user.active ? 'Active' : 'Inactive' }}
                </span>
              </div>

              <!-- Action Buttons -->
              <div>
                <button 
                  v-if="!user.active" 
                  class="btn btn-sm btn-success me-2" 
                  @click="approve(user.id)"
                >
                  Approve
                </button>
                <button 
                  class="btn btn-sm btn-danger" 
                  @click="deleteUser(user.id)"
                >
                  Delete
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `,

    data() {
        return {
            allUsers: [], // Stores all user data fetched from the API
            token: localStorage.getItem('auth-token'), // Auth token for API requests
            error: null, // Error message to display in case of an issue
        };
    },

    methods: {
        /**
         * Fetches the list of users from the API.
         */
        async fetchUsers() {
            try {
                const res = await fetch('/users', {
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    this.allUsers = data; // Update the user list on success
                } else {
                    this.error = `Failed to fetch users: ${data.message}`;
                }
            } catch (e) {
                console.error('Error fetching users:', e);
                this.error = 'An error occurred while fetching users.';
            }
        },

        /**
         * Approves a user by sending a request to the API.
         * @param {number} userId - ID of the user to approve.
         */
        async approve(userId) {
            try {
                const res = await fetch(`/activate/sponsor/${userId}`, {
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.message); // Notify success
                    this.fetchUsers(); // Refresh the user list
                } else {
                    this.error = `Failed to approve user: ${data.message}`;
                }
            } catch (e) {
                console.error('Error approving user:', e);
                this.error = 'An error occurred while approving the user.';
            }
        },

        /**
         * Deletes a user by sending a DELETE request to the API.
         * @param {number} userId - ID of the user to delete.
         */
        async deleteUser(userId) {
            try {
                const res = await fetch(`/api/user/${userId}`, {
                    method: 'DELETE',
                    headers: { 'Authentication-Token': this.token },
                });
                const data = await res.json();
                if (res.ok) {
                    alert(data.message); // Notify success
                    this.fetchUsers(); // Refresh the user list
                } else {
                    this.error = `Failed to delete user: ${data.message}`;
                }
            } catch (e) {
                console.error('Error deleting user:', e);
                this.error = 'An error occurred while deleting the user.';
            }
        },
    },

    /**
     * Fetch the users when the component is mounted.
     */
    mounted() {
        this.fetchUsers();
    },
};
