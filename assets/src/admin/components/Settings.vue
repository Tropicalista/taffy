<template>
    <div class="app-settings">
        
        <h1>Settings</h1>

        <form class="pure-form pure-form-aligned">
            <fieldset>
                <div class="pure-control-group">
                    <label for="name">Is home writeable?</label>
                    <span>{{ checker ? "Yes" : "No" }}</span>
                    <span class="pure-form-message-inline">Taffy needs to make changes to your robots.txt file.</span>
                </div>

                <div class="pure-control-group">
                    <label for="name">Link prefix</label>
                    <select v-model="path" @change="setFolder($event)" class="pure-input-1-4">
                        <option v-for="option in options" v-bind:value="option.value">
                        {{ option.text }}
                        </option>
                    </select>
                    <span class="pure-form-message-inline">The prefix that comes before your cloaked link's slug. eg. http://myplugintest.com/{{path}}/your-affiliate-link-name.</span>
                </div>

                <div class="pure-control-group" v-show="custom">
                    <label for="foo">Custom Link prefix</label>
                    <input type="text" v-model="customPath" class="pure-input-1-4">
                    <span class="pure-form-message-inline">Enter your preferred link prefix.</span>
                </div>

                <div class="pure-control-group">
                    <label for="name">Link redirect type</label>
                    <select v-model="redirect" class="pure-input-1-4">
                        <option v-for="r in redirects" v-bind:value="r.value">
                        {{ r.text }}
                        </option>
                    </select>
                    <span class="pure-form-message-inline">This is the type of redirect Taffy will use to redirect the user to your affiliate link.</span>
                </div>

                <div>
                    <button type="submit" class="pure-button pure-button-primary" @click.prevent="create" :disabled="!checker">Save settings <i class=""></i></button>
                </div>

            </fieldset>
        </form>    

        <robots :robots="robots" />

    </div>
</template>

<script>
import Robots from './Robots.vue'
export default {

    name: 'Settings',

    data () {
        return {
            robots: '',
        	checker: false,
            customPath: '',
            custom: false,
        	path: 'recommends',
            redirect: '302',
            options: [
              { text: '-- custom --', value: '-- custom --' },
              { text: 'recommends', value: 'recommends' },
              { text: 'go', value: 'go' },
              { text: 'out', value: 'out' },
              { text: 'review', value: 'review' },
              { text: 'suggests', value: 'suggests' },
              { text: 'follow', value: 'follow' },
              { text: 'goto', value: 'goto' },
              { text: 'click', value: 'click' },
              { text: 'move', value: 'move' },
              { text: 'offer', value: 'offer' },
            ],
            redirects: [
              { text: '301 Permanent', value: '301' },
              { text: '302 Temporary', value: '302' },
              { text: '307 Temporary (alternative)', value: '307' },
            ]
        };
    },
    mounted () {
		axios.get('/check')
			.then((result) => {
                console.log(result)
                this.checker = result.data.is_home_writeable
                this.robots = result.data.robots
			})
    },
    methods: {
    	setFolder (event) {
            this.custom = false
    		if(event.target.value == '-- custom --'){
                this.custom = true
                this.path = ''
    		}
    	},
    	create () {
    		axios.post('/robots', {
    			path: this.path ? this.path : this.customPath
    		})
    	}
    },
    components: {
        Robots
    }
};
</script>

<style lang="css" scoped>
</style>