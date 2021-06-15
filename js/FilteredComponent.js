Vue.component('filters', {
   props: ['filtered', 'img'],
   template: ` <form action="#" class="search-form" @submit.prevent="$root.filter(filter)">
   <input type="text" class="search-field" v-model="$root.userSearch">
   <button type="submit" class="btn-search">
       <i class="fas fa-search"></i>
   </button>
</form>`
});