<script>
  import { fetchTeamList, deleteTeam } from '../actions/team';

  export default {
    name: 'team-list',
    data() {
      return {
        list: [],
        readyState: 'idle'
      };
    },
    methods: {
      deleteTeam(name) {
        deleteTeam(name)
          .then(() => {
            this.list = this.list.filter(team => team.name !== name);
          });
      }
    },
    mounted() {
      this.readyState = 'loading';

      fetchTeamList()
        .then(teams => {
          this.list = teams;
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
    <router-link to="/teams/add">Add new team</router-link>
    <h5>Teams:</h5>
    <p v-if="readyState === 'loading'">Loading...</p>
    <p v-if="readyState === 'failed'">Failed to fetch teams</p>
    <ul v-if="readyState === 'loaded'">
      <li v-for="team in list">
        <router-link :to="'teams/' + team.name + '/'">{{team.name}}</router-link>
        &mdash;
        <span @click.prevent="deleteTeam(team.name)">[✕]</span>
      </li>
    </ul>
  </div>
</template>

<style>
</style>
