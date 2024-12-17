export default {
    template: `
    <div class="container my-4">
      <div class="card shadow-sm">
        <div class="card-body">
          <h3 class="card-title text-center">Edit Ad Request</h3>
          <form @submit.prevent="editAdRequest">
            <div class="mb-3">
              <label for="messages" class="form-label">Messages</label>
              <input 
                type="text" 
                id="messages" 
                class="form-control" 
                placeholder="Enter Messages" 
                v-model="adRequest.messages" 
              />
            </div>
            <div class="mb-3">
              <label for="requirements" class="form-label">Requirements</label>
              <input 
                type="text" 
                id="requirements" 
                class="form-control" 
                placeholder="Enter Requirements" 
                v-model="adRequest.requirements" 
              />
            </div>
            <div class="mb-3">
              <label for="paymentAmount" class="form-label">Payment Amount</label>
              <input 
                type="number" 
                id="paymentAmount" 
                class="form-control" 
                placeholder="Enter Payment Amount" 
                v-model="adRequest.payment_amount" 
              />
            </div>
            <div class="d-grid">
              <button type="submit" class="btn btn-primary">
                Submit Edited AdRequest
              </button>
            </div>
          </form>
        </div>
      </div>
  
      <div v-if="error" class="alert alert-danger mt-3" role="alert">
        Error: {{ error }}
      </div>
    </div>
  `,

    data() {
        return {
            adRequest: {
                campain_id: '',
                messages: '',
                requirements: '',
                payment_amount: '',
                status: '',
            },
            token: localStorage.getItem('auth-token'),
            error: null,
        };
    },

    methods: {
        async fetchAdRequest(id) {
            try {
                const res = await fetch(`/api/ad_request/${id}`, {
                    headers: {
                        'Authentication-Token': this.token,
                    },
                });

                if (res.ok) {
                    const data = await res.json();
                    this.adRequest.campain_id = data.campain_id;
                    this.adRequest.messages = data.messages;
                    this.adRequest.requirements = data.requirements;
                    this.adRequest.payment_amount = data.payment_amount;
                    this.adRequest.status = data.status;
                } else {
                    this.error = `Error ${res.status}: ${res.statusText}`;
                }
            } catch (error) {
                console.error('Failed to fetch AdRequest:', error);
                this.error = 'Failed to fetch AdRequest.';
            }
        },
        async editAdRequest() {
            try {
                const url = `/api/ad_request/${this.$route.params.id}`;
                const res = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Authentication-Token': this.token,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.adRequest),
                });

                const data = await res.json();

                if (res.ok) {
                    alert(data.message);
                    this.$router.push({ path: '/adrequests' });
                } else {
                    console.error('Error:', data);
                    alert(`Error: ${data.message || 'An unknown error occurred'}`);
                }
            } catch (error) {
                console.error('Request failed:', error);
                alert('AdRequest Updated');
            }
        },
    },

    mounted() {
        const adRequestId = this.$route.params.id;
        this.fetchAdRequest(adRequestId);
    },
};
