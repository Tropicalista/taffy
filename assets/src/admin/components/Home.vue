<template>
    <div class="home">
        <h1>Taffy Links
            <a :href="'#/detail/'" class="page-title-action">New Affiliate Link</a>
        </h1>
    	<vuetable ref="vuetable"
            :api-mode="false"
            :per-page="perPage"
            :data-manager="dataManager"
    		:fields="['title', 'cloaked url', 'link destination', 'redirect_type', 'link type', 'edit']"
            :css="mycss.table"
    	>
        <div slot="title" slot-scope="props">
            <a :href="'#/detail/' + props.rowData.id">{{props.rowData.title.rendered}}</a>
        </div>            
        <div slot="link type" slot-scope="props">
            <a :href="'#/detail/' + props.rowData.id">{{props.rowData.link_type}}</a>
        </div>            
        <div slot="cloaked url" slot-scope="props">
            <input type="text" readonly :value="props.rowData.link">
        </div>            
        <div slot="redirect_type" slot-scope="props">
            {{ props.rowData.link_type == 'rebrandly' ? '301' : props.rowData.redirect_type }}
        </div>            
        <div slot="link destination" slot-scope="props">
            <input type="text" readonly :value="props.rowData.content">
        </div>            
        <div slot="edit" slot-scope="props">
            <button class="pure-button pure-button-primary" @click="onActionClicked( 'edit', props.rowData)"><i class="dashicons dashicons-welcome-write-blog"></i></button>
            <button class="pure-button button-error" @click="onActionClicked( 'delete', props.rowData)"><i class="dashicons dashicons-no"></i></button>
        </div>            
        </vuetable>

    </div>
</template>

<script>
import Vuetable from 'vuetable-2'
//import VuetablePagination from "vuetable-2/src/components/VuetablePagination";
import mycss from './vuetablecss.js'
export default {

    name: 'Home',

    data () {
        return {
            perPage: 10,
            data: [],
            mycss: mycss,
        }
    },
    watch: {
        data(newVal, oldVal) {
            console.log(newVal, oldVal)
            this.$refs.vuetable.refresh();
        }
    },
    mounted () {
            axios({
                method:'get',
                url:'taffylinks',
                baseURL: window.taffy.baseUrl + '/wp-json/wp/v2/'
            })
            .then(response => {
                //console.log(response)
                this.data = response.data
                this.update()
            })
            .catch(error => {
                //console.log(error)
            })
    },
    methods: {
        update () {
            axios({
                method:'post',
                url:'/redirects',
                data: this.data
            })
            .then(response => {
                //console.log(response)
            })
            .catch(error => {
                //console.log(error)
            })
            
        },
        delete (id) {
            let mm = this
            axios({
                method:'delete',
                url:'/taffylinks/' + id,
                baseURL: window.taffy.baseUrl + '/wp-json/wp/v2/'
            })
            .then(response => {
                mm.data.forEach( (value, index) => {
                    if(value.id === id) {
                        mm.data.splice(index, 1)
                        this.$nextTick( () => {
                            // do something cool
                            mm.$refs.vuetable.refresh();
                        })                        
                    }
                })
                if(!mm.data.length){
                    mm.data = []
                }
            })
            .catch(error => {
                //console.log(error)
            })
        },
        onActionClicked(action, data) {
            if(action == 'delete'){
                this.delete(data.id)
            }
            if(action == 'edit'){
                this.$router.push({ name: 'Link', params: { id: data.id } })
            }
        },
        onPaginationData(paginationData) {
          this.$refs.pagination.setPaginationData(paginationData);
        },
        onChangePage(page) {
          this.$refs.vuetable.changePage(page);
        },
        dataManager(sortOrder, pagination) {
          if (this.data.length < 1) return;

          let local = this.data;

          // sortOrder can be empty, so we have to check for that as well
          if (sortOrder.length > 0) {
            //console.log("orderBy:", sortOrder[0].sortField, sortOrder[0].direction);
            const sortBy = (key) => {
              return (a, b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0);
            };
            local.concat().sort(sortBy("sortOrder"));

            /*local = _.orderBy(
              local,
              sortOrder[0].sortField,
              sortOrder[0].direction
            );*/
          }

          pagination = this.$refs.vuetable.makePagination(
            local.length,
            this.perPage
          );

          //console.log('pagination:', pagination)
          let from = pagination.from - 1;
          let to = from + this.perPage;

          return {
            pagination: pagination,
            data: local.slice(from, to) // _.slice(local, from, to)
          };
        },
    },
	components: {
		Vuetable
	}
}
</script>
