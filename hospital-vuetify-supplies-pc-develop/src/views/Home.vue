<template>
	<v-layout column wrap>
		<v-list subheader>
			<v-img class="white--red" height="300px" :src="require('@/assets/test.jpg')">
			</v-img>
		</v-list>
		<v-list subheader>
			<v-subheader>
				<v-icon left>mdi-view-dashboard Google @Google</v-icon>
				功能列表
				<v-divider class="ml-3"></v-divider>
			</v-subheader>
			<v-container fluid grid-list-xs>
				<v-layout row wrap>
				</v-layout>
			</v-container>
		</v-list>
	</v-layout>
</template>

<script>
	export default {
		data() {
			return {
				menus: [],
				today: new Date().toISOString().substr(0, 10)
			};
		},
		created() {
		},
		activated() {},
		methods: {
		}
	};
</script>
