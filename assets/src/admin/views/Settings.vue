<template>
    <div class="app-settings">
				
		<h1>Settings</h1>
		
		<h1 class="nav-tab-wrapper">
			<a v-for="tab in tabs" :key="tab" @click="selected = tab;" class="nav-tab" :class="{ 'nav-tab-active': selected == tab }">
				{{ tab }}
			</a>                
		</h1>
		<br>

		<component :is="selected"></component>

    </div>
</template>

<script>
import General from 'admin/components/Settings.vue'
import Robots from 'admin/components/Robots.vue'

export default {
    data () {
        return {
			tabs: ["General", "Robots"],
			selected: "General",
			spin: false,
			loaded: false
        };
    },
    components: {
    	General,
    	Robots
    }
};
</script>