<template>
  <v-container grid-list-md v-if="book">
    <v-layout row wrap>
      <v-flex xs12 sm10 offset-sm1>
        <book-details :book="book"/>
      </v-flex>

      <!--Части книги-->
      <v-flex
        v-for="part in book.parts"
        :key="part.id"
        xs12 sm10 offset-sm1>
        <book-part-list-item
          :bookId="book._id"
          :part="part"
        />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Book',
  components: {
    BookDetails: () => import('./BookDetails'),
    BookPartListItem: () => import('./BookPartListItem')
  },
  props: { bookId: { type: String } },
  computed: {
    book () {
      return this.$store.getters['books/books'].find(book => book._id === this.bookId)
    }
  }
}
</script>

<style scoped>

</style>
