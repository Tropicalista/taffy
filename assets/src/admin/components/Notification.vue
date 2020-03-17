<template>
	<div class="alert" :class="[type]" v-show="show">
		<span class="closebtn"><i @click="hide" class="dashicons dashicons-no"></i></span> 
		<strong>{{msg}}</strong> 
	</div>
</template>
<script>
export default {
	props: [ 'msg', 'type' ],
    name: 'Notification',
    data () {
    	return {
    		show: false
    	}
    },
	methods: {
		hide() {
			this.show = !this.show
		}
	}
}
</script>