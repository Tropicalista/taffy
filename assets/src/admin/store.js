import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		settings: {
			redirect_type: 302,
			path: 'go',
			rebrandly: '',
			bitly: ''
		}
	},
	mutations: {
		setConfig (state, settings) {
			state.settings = Object.assign(state.settings, settings)
		}
	},
	getters: {
		settings: state => state.settings,
	},
	actions: {
		storeSettings () {
			axios
				.post('/settings', {
					settings: state.settings
				})				
		}

	}
})

export default store