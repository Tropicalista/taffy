<template>
    <div class="home">
        <h1 v-show="!$route.params.id">New Affiliate Link</h1>
        <h1 v-show="$route.params.id">Edit Affiliate Link</h1>

        <Notification :msg="noticeMsg" :type="noticeType" v-show="showNotice" />

        <div class="pure-g">

            <div class="pure-u-1">

                <form class="form-settings pure-form pure-form-stacked">
                    <fieldset>

                        <label for="name">Link type</label>
                        <select v-model="taffylink.link_type" class="pure-input-1-4" @change="changeLink">
                            <option v-for="l in links" v-bind:value="l.value">
                            {{ l.text }}
                            </option>
                        </select>
                        <span class="pure-form-message">This is the link type you want to add.</span>

                        <label for="name">Name</label>
                        <input id="name" type="text" placeholder="Name" v-model="taffylink.title" class="pure-input-2-3">
                        <span class="pure-form-message">Add a name for your affiliate link.</span>

                        <div v-if="taffylink.link_type != 'custom'">
                        <label for="name">Rebrandly links</label>
                        <select v-model="taffylink.content" class="pure-input-1-4" @change="changeRebrandly()">
                            <option v-for="l in rebrandlinks" :value="l">
                            {{ l.title }}
                            </option>
                        </select>
                        <span class="pure-form-message">This is the type of redirect Taffy will use to redirect the user to your affiliate link.</span>
                        </div>

                        <div v-if="taffylink.link_type == 'custom'">
                        <label for="url">Destination URL</label>
                        <input id="url" type="url" placeholder="Destination url to be cloaked" v-model="taffylink.content" class="pure-input-2-3">
                        <span class="pure-form-message">This is the link that will be cloaked. Paste here your affiliate link</span>
                        </div>

                        <div v-if="taffylink.link_type == 'custom'">
                        <label for="name">Link redirect type</label>
                        <select v-model="taffylink.redirect_type" class="pure-input-1-4">
                            <option value="">Default globally defined</option>
                            <option v-for="r in redirects" v-bind:value="r.value">
                            {{ r.text }}
                            </option>
                        </select>
                        <span class="pure-form-message">This is the type of redirect Taffy will use to redirect the user to your affiliate link.</span>
                        </div>

                        <button class="pure-button" @click.prevent="$router.push('/')">Go back</button>
                        <button type="submit" class="pure-button pure-button-primary" @click.prevent="save()">Save link <i v-if="spin" class="dashicons dashicons-update spin"></i></button>
                    </fieldset>
                </form>  

            </div>

        </div>

    </div>
</template>

<script>
import Notification from './Notification.vue'
export default {

    name: 'Link',

    data () {
        return {
            id: this.$route.params.id ? this.$route.params.id : '',
            spin: false,
            showNotice: false,
            noticeType: 'success',
            noticeMsg: '',
            rebrandlinks: {},
            taffylink: {
                title: '',
                content: '',
                redirect_type: '',
                link_type: 'custom'
            },
            redirects: [
              { text: '301 Permanent', value: 301 },
              { text: '302 Temporary', value: 302 },
              { text: '307 Temporary (alternative)', value: 307 },
            ],
            links: [
              { text: 'Custom', value: 'custom' },
              { text: 'Rebrandly', value: 'rebrandly' },
            ]
        }
    },
    mounted () {
        let id = this.$route.params.id;
        if(this.$route.params.id){
            axios({
                method:'get',
                url:'taffylinks/' + this.id,
                baseURL: window.taffy.baseUrl + '/wp-json/wp/v2/'
            })
            .then(response => {
                this.taffylink.title = response.data.title.rendered
                this.taffylink.content = response.data.content
                this.taffylink.redirect_type = response.data.redirect_type
                this.taffylink.link_type = response.data.link_type
                this.changeLink()
            })
            .catch(error => {
                console.log(error)
            })            
        }

    },
    methods: {
        save () {

            this.spinner()

            axios({
                method:'post',
                url:'taffylinks/' + this.id,
                baseURL: window.taffy.baseUrl + '/wp-json/wp/v2/',
                data: {
                    id: this.$route.params.id,
                    title: this.taffylink.title,
                    status: 'publish',
                    redirect_type: this.taffylink.redirect_type,
                    link_type: this.taffylink.link_type,
                    //content: this.taffylink.link_type == 'custom' ? this.taffylink.content : 'http://' + this.taffylink.content
                    content: this.taffylink.content
                }
            })
            .then(response => {
                console.log(response)
                this.spinner()
                this.showNotice = true
                this.noticeMsg = 'Link saved'
                this.update(response.data)
                this.noticeType = 'success'
            })
            .catch(error => {
                console.log(error)
                this.noticeType = 'error'
            })


        },
        update (data) {
            axios({
                method:'put',
                url:'/redirects',
                data: data
            })
            .then(response => {
                console.log(response)
            })
            .catch(error => {
                console.log(error)
            })

        },
        changeLink () {
            if(this.taffylink.link_type == 'rebrandly'){

                fetch('https://api.rebrandly.com/v1/links?orderBy=createdAt&orderDir=desc&limit=100&favourite=false&status=active',
                {
                    method: 'GET', 
                    headers:{
                        //this what's exactly look in my postman
                        'apikey': this.$store.getters.settings.rebrandly
                    },
                })
                .then( response => response.json())
                .then( responseJson => {
                    this.rebrandlinks = responseJson
                    console.log(responseJson)
                }).catch( error => {
                    console.log(error)
                })

            }
        },
        changeRebrandly () {
            this.taffylink.title = this.taffylink.content.slashtag
            this.taffylink.content = (this.taffylink.content.https ? 'https://' : 'http://')  + this.taffylink.content.shortUrl
        },
        spinner () {
            this.spin = !this.spin
        }
    },
	components: {
        Notification
	}
}
</script>