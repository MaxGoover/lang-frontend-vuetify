<template>
  <v-app>
    <!--Хеадер-->
    <app-header v-if="false"/>

    <!--Контент-->
    <v-content>
      <router-view/>
    </v-content>

    <!--Футер-->
    <app-footer v-if="false"/>
  </v-app>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'App',
  components: {
    AppHeader: () => import('./components/app/AppHeader'),
    AppFooter: () => import('./components/app/AppFooter')
  },
  computed: {
    ...mapState('menu', [
      'showAppHeader',
      'showAppFooter'
    ])
  },
  created () {
    this.$store.dispatch('books/getBooks')
  }
}
</script>
