import Home from './components/Home.js'
import Welcome from './components/Welcome.js'
import Login from './components/Login.js'
import Signup from './components/Signup.js'

import AdminInfo from './components/AdminInfo.js'
import AdminUsers from './components/AdminUsers.js'
import AdminFind from './components/AdminFind.js'
import AdminStats from './components/AdminStats.js'

import SponsorHome from './components/SponsorHome.js'
import SponsorCampaigns from './components/SponsorCampaigns.js'
import SponsorFind from './components/SponsorFind.js'
import SponsorStats from './components/SponsorStats.js'
import SponsorAdRequestForm from './components/SponsorAdRequestForm.js'

import InfluencerHome from './components/InfluencerHome.js'
import InfluencerFind from './components/InfluencerFind.js'
import InfluencerStats from './components/InfluencerStats.js'

import CampaignForm from './components/CampaignForm.js'
import CampaignView from './components/CampaignView.js'
import CampaignEdit from './components/CampaignEdit.js'

import AdRequestForm from './components/AdRequestForm.js'
import AdRequestEdit from './components/AdRequestEdit.js'

// Define routes for the application
const routes = [
    // General routes
    { path: '/', component: Home, name: 'Home' }, // Home page
    { path: '/welcome', component: Welcome, name: 'Welcome' }, // Welcome page
    { path: '/login', component: Login, name: 'Login' }, // Login page
    { path: '/sign-up', component: Signup, name: 'Signup' }, // Sign-up page

    // Admin routes
    { path: '/admin-info', component: AdminInfo }, // Admin info page
    { path: '/admin-users', component: AdminUsers }, // Admin users management page
    { path: '/admin-find', component: AdminFind }, // Admin find feature
    { path: '/admin-stats', component: AdminStats }, // Admin stats dashboard

    // Sponsor routes
    { path: '/sponsor-home', component: SponsorHome }, // Sponsor home page
    { path: '/sponsor-campaigns', component: SponsorCampaigns }, // Sponsor campaigns management
    { path: '/sponsor-find', component: SponsorFind }, // Sponsor find feature
    { path: '/sponsor-stats', component: SponsorStats }, // Sponsor stats dashboard
    { path: '/sponsor-adRequest-form/:id', name: 'sponsor-adRequest-form', component: SponsorAdRequestForm }, // Sponsor ad request form

    // Influencer routes
    { path: '/influencer-home', component: InfluencerHome }, // Influencer home page
    { path: '/influencer-find', component: InfluencerFind }, // Influencer find feature
    { path: '/influencer-stats', component: InfluencerStats }, // Influencer stats dashboard

    // Campaign-related routes
    { path: '/campaign-form', component: CampaignForm }, // Campaign creation form
    { path: '/campaign-view', component: CampaignView }, // Campaign viewing page
    { path: '/campaign-view/:id', name: 'campaign-view', component: CampaignView }, // View specific campaign by ID
    { path: '/campaign-edit/:id', name: 'campaign-edit', component: CampaignEdit }, // Edit specific campaign by ID

    // Ad request-related routes
    { path: '/adRequest-form/:id', name: 'adRequest-form', component: AdRequestForm }, // Ad request form for specific ad
    { path: '/adRequest-edit/:id', name: 'adRequest-edit', component: AdRequestEdit }, // Edit specific ad request by ID
]

// Export the VueRouter instance
export default new VueRouter({
    routes, // Pass the defined routes
})
