<script>
  import join from 'url-join';
  import { fetchTeam } from '../actions/team';

  export default {
    name: 'team-info',
    data() {
      return {
        team: {},
        readyState: 'idle'
      };
    },
    methods: {
      editUrl() {
        return join('/teams', this.$route.params.id, 'edit');
      },
      handleEdit() {
        this.$router.push(this.editUrl());
      }
    },
    mounted() {
      this.readyState = 'loading';

      fetchTeam(this.$route.params.id)
        .then(team => {
          this.team = team;
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
    <p v-if="readyState === 'loading'">Loading...</p>
    <p v-if="readyState === 'failed'">Failed to fetch team</p>
    <div v-if="readyState === 'loaded'">
      <ul>
        <li>Name: {{team.name}}</li>
        <li>Approve count: {{team.reviewConfig.approveCount}}</li>
        <li>Total reviewers: {{team.reviewConfig.totalReviewers}}</li>
        <li>
          Patterns:
          <ul v-if="team.patterns.length">
            <li v-for="pattern in team.patterns">{{ pattern }}</li>
          </ul>
        </li>
        <li>
          <router-link to='members'>Members</router-link>
        </li>
      </ul>
      <button type="button" @click="handleEdit">Edit</button>
    </div>
  </div>
</template>

<style>
</style>
