import Vue from 'vue'
import Router from 'vue-router'
import Home from 'admin/components/Home.vue'
import Link from 'admin/components/Link.vue'
import Settings from 'admin/views/Settings.vue'

Vue.use(Router)

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/detail/:id?',
            name: 'Link',
            component: Link
        },
        {
            path: '/settings',
            name: 'Settings',
            component: Settings
        },
    ]
})
