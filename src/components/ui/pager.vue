<script>
  export default {
    name: 'pager',
    data() {
      return {
        last: Math.ceil(this.count / this.limit),
        isLast: this.skip + this.limit >= this.count,
        hasNext: this.skip + this.limit < this.count,

        isFirst: this.skip === 0,
        hasPrev: this.skip > 0,

        prev: Math.floor(this.skip / this.limit),
        next: Math.floor(this.skip / this.limit) + 2,
        current: Math.floor(this.skip / this.limit) + 1
      };
    },
    props: {
      url: String,
      skip: Number,
      limit: Number,
      count: Number
    },
    methods: {
      build(page) {
        const skip = (page - 1) * this.limit;

        return this.url + '?' + 'skip=' + skip + '&' + 'limit=' + this.limit;
      }
    }
  };
</script>

<template>

  <div class="pager">
    <a v-if="!isFirst" :href="build(1)">First</a>
    <span v-if="isFirst">First</span>

    <a v-if="hasPrev" :href="build(prev)">Prev</a>
    <span v-if="!hasPrev">Prev</span>

    <a v-if="current - 1 > 0" :href="build(current - 1)">{{current - 1}}</a>
    <span>{{current}}</span>
    <a v-if="current + 1 < last" :href="build(current + 1)">{{current + 1}}</a>
    <a v-if="current + 2 < last" :href="build(current + 2)">{{current + 2}}</a>
    <a v-if="current + 3 < last" :href="build(current + 3)">{{current + 3}}</a>

    <a v-if="hasNext" :href="build(next)">Next</a>
    <span v-if="!hasNext">Next</span>

    <a v-if="!isLast" :href="build(last)">Last</a>
    <span v-if="isLast">Last</span>
  </div>

</template>

<style>
</style>
