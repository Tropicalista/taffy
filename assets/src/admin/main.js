import Vue from 'vue'
import App from './App.vue'
import router from './router'
import menuFix from './utils/admin-menu-fix'
import store from './store'

import axios from 'axios'

window.axios = axios 

axios.defaults.headers.common = {
	/* eslint-disable no-undef */
	'X-WP-Nonce': _nonce
}

// apply interceptor on response
/*axios.interceptors.response.use(
	response => response,
	errorResponseHandler
);*/

axios.defaults.baseURL = window.taffy.baseUrl + '/wp-json/taffy/api'


Vue.config.productionTip = false

	axios
		.get('/config')
		.then(r => r.data)
		.then(config => {
			store.commit('setConfig', config)

			/* eslint-disable no-new */
			new Vue({
			    el: '#vue-admin-app',
			    router,
			    store,
			    render: h => h(App)
			});

		})


// fix the admin menu for the slug "vue-app"
menuFix('taffy');
