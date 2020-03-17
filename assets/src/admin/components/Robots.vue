<template>
    <div class="app-settings">
        
        <h1>Settings</h1>

        <form class="pure-form pure-form-aligned">
            <fieldset>

                <div class="pure-control-group">
                    <label for="foo">robots.txt</label>
                    <textarea class="pure-input-1-2" placeholder="Your robots.txt content" v-model="robots" rows="15"></textarea>
                    <span class="pure-form-message-inline">This is the content of your <a :href="robotsUrl" target="_blank">robots.txt</a>.</span>
                </div>

                <div v-show="false">
                    <button type="submit" class="pure-button pure-button-primary" @click.prevent="create">Save robots.txt</button>
                </div>

            </fieldset>
        </form>    

    </div>
</template>

<script>
export default {

    name: 'Robots',
    props: ['robots'],
    data () {
        return {
            robotsUrl: window.taffy.baseUrl + '/robots.txt'
        };
    },
    mounted () {

    },
    methods: {
    	create () {
    		axios.post('/robots', {
    			path: this.path
    		})
    	}
    }
};
</script>