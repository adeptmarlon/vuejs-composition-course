<template>
  <nav class="is-primary panel">
      <p class="panel-tabs">
          <a v-for="period in periods" :key="period" data-test="period"
            :class="[period === selectedPeriod ? 'is-active' : '']"
            @click="setPeriod(period)">
              {{ period }}
          </a>
      </p>

      <TimelinePost v-for="post in posts" :key="post.id" :post="post" />
  </nav>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";

import { Period, Post } from "./types";
import { useStore } from "./store";
import moment from "moment";

import TimelinePost from './TimelinePost.vue'

export default defineComponent({
    components: {
        TimelinePost
    },
    async setup() {
        const periods: Period[] = ['today', 'this week', 'this month']
        const selectedPeriod = ref<Period>("today");

        const store = useStore()
        if(!store.getState().posts.loaded) {
            await store.fetchPosts()
        }

        const allPosts = store.getState().posts.ids.reduce<Post[]>((acc, id) => {
            const post = store.getState().posts.all[id]
            return acc.concat(post)
        }, [])

        const posts = computed(() => allPosts.filter(post => {
            return selectedPeriod.value === 'today' &&
                post.created.isAfter(moment().subtract(1, 'day')) || 
                selectedPeriod.value === 'this week' &&
                post.created.isAfter(moment().subtract(7, 'day')) ||
                selectedPeriod.value === 'this month' &&
                post.created.isAfter(moment().subtract(1, 'month'))
            })
        )

        const setPeriod = (period: Period) => {
            selectedPeriod.value = period;
        }

        return {
            periods,
            selectedPeriod,
            setPeriod,
            posts
        }
    }
})
</script>

<style>

</style>