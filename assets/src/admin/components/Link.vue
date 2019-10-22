<template>
    <div class="home">
        <h1 v-show="!$route.params.id">New Affiliate Link</h1>
        <h1 v-show="$route.params.id">Edit Affiliate Link</h1>

        <div class="pure-g">

            <div class="pure-u-1">

                <form class="form-settings pure-form pure-form-stacked">
                    <fieldset>

                        <label for="name">Name</label>
                        <input id="name" type="text" placeholder="Name" v-model="taffylink.title" class="pure-input-2-3">
                        <span class="pure-form-message">Add a name for your affiliate link.</span>

                        <label for="url">Destination URL</label>
                        <input id="url" type="url" placeholder="Destination url to be cloked" v-model="taffylink.content" class="pure-input-2-3">
                        <span class="pure-form-message">This is the link that will be cloaked. Paste here your affiliate link</span>

                        <label for="name">Link redirect type</label>
                        <select v-model="taffylink.redirect_type" class="pure-input-1-4">
                            <option value="">Default globally defined</option>
                            <option v-for="r in redirects" v-bind:value="r.value">
                            {{ r.text }}
                            </option>
                        </select>
                        <span class="pure-form-message">This is the type of redirect Taffy will use to redirect the user to your affiliate link.</span>

                        <button class="pure-button" @click.prevent="$router.go(-1)">Cancel</button>
                        <button type="submit" class="pure-button pure-button-primary" @click.prevent="save()">Save link</button>
                    </fieldset>
                </form>  

            </div>

        </div>

    </div>
</template>

<script>
export default {

    name: 'Link',

    data () {
        return {
            id: this.$route.params.id ? this.$route.params.id : '',
            taffylink: {
                title: '',
                content: '',
                redirect_type: '',
            },
            redirects: [
              { text: '301 Permanent', value: 301 },
              { text: '302 Temporary', value: 302 },
              { text: '307 Temporary (alternative)', value: 307 },
            ]
        }
    },
    mounted () {
        let id = this.$route.params.id;
        if(this.$route.params.id){
            axios({
                method:'get',
                url:'/wp-json/wp/v2/taffylinks/' + this.id,
                baseURL: '/',
            })
            .then(response => {
                this.taffylink.title = response.data.title.rendered
                this.taffylink.content = response.data.content
                this.taffylink.redirect_type = response.data.redirect_type
            })
            .catch(error => {
                console.log(error)
            })            
        }

    },
    methods: {
        save () {
            let method = 'post'
            if(this.id){
                method = 'put'
            }
            axios({
                method:'post',
                url:'/wp-json/wp/v2/taffylinks/' + this.id,
                baseURL: '/',
                data: {
                    id: this.$route.params.id,
                    title: this.taffylink.title,
                    status: 'publish',
                    redirect_type: this.taffylink.redirect_type,
                    content: this.taffylink.content
                }
            })
            .then(response => {
                console.log(response)
                this.update(response.data)
            })
            .catch(error => {
                console.log(error)
            })

        },
        update (data) {
            axios({
                method:'put',
                url:'/wp-json/taffy/api/redirects',
                baseURL: '/',
                data: data
            })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })

        }
    },
	components: {

	}
}
</script>