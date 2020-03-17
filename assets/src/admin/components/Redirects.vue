<template>
    <div class="app-settings">
        
        <h1>Settings</h1>

        <form class="pure-form pure-form-aligned">
            <fieldset>

                <div class="pure-control-group">
                    <label for="foo">.htaccess</label>
                    <textarea class="pure-input-1-2" placeholder="Your redirects.txt content" v-model="redirects" rows="15"></textarea>
                    <span class="pure-form-message-inline">This is the content of your redirects.txt.</span>
                </div>

            </fieldset>
        </form>    

    </div>
</template>

<script>
export default {

    name: 'Redirects',
    props: ['redirects'],
    data () {
        return {
        };
    },
    mounted () {
    },
    methods: {
    }
};
</script>