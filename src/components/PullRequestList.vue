<script>
  import { fetchPullRequestList } from '../actions/pulls';

  export default {
    name: 'pull-request-list',
    data() {
      return {
        list: [],
        readyState: 'idle'
      };
    },
    mounted() {
      this.readyState = 'loading';

      fetchPullRequestList()
        .then(pulls => {
          this.list = pulls;
          this.readyState = 'loaded';
        })
        .catch(() => {
          this.readyState = 'failed';
        });
    }
  };
</script>

<template>
  <div>
    <h1>Pulls</h1>
    <p v-if="readyState === 'loading'">Loading...</p>
    <p v-if="readyState === 'failed'">Failed to fetch pulls</p>
    <div v-if="readyState === 'loaded'">
      <table>
        <tr>
          <th>ID</th>
          <th>NUMBER</th>
          <th>REPO</th>
          <th>REVIEWERS</th>
        </tr>
        <tr v-for="pull in list">
          <td>{{pull.id}}</td>
          <td>{{pull.number}}</td>
          <td>{{pull.repository.full_name}}</td>
          <td>{{pull.review.reviewers.map(x => x.login)}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style>
</style>
