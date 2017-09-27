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

    computed: {
      loaded: function () {
        return this.readyState === 'loaded';
      },

      failed: function () {
        return this.readyState === 'failed';
      },

      loading: function () {
        return this.readyState === 'loading';
      }
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
    <h1>Teams</h1>

    <p v-if="failed">Failed to fetch teams :-(</p>

    <p v-if="loading">Loading...</p>

    <div v-if="loaded">
      <div class="add-team-list">
        <router-link class="button-link" to="/teams/add">New team</router-link>
      </div>

      <ul class="team-list">
        <li v-for="team in list" class="team-list__item">
          <span class="team-list__item-box">
            <router-link class="team-list__item-link" :to="'teams/' + team.name + '/'">{{team.name}}</router-link>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
.add-team-list
{
  margin-bottom: 15px;
}

.team-list
{
  margin: 0;
  padding: 0;
}

.team-list__item
{
  display: inline-block;

  vertical-align: top;

  margin: 20px 20px 20px 0;
}

.team-list__item-box
{
  display: block;

}

.team-list__item-link:link,
.team-list__item-link:visited
{
  display: block;

  width: 150px;
  height: 150px;

  padding: 15px 10px;
  box-sizing: border-box;

  text-align: center;

  border: 1px solid #ccc;
  border-radius: 4px;

  color: #000;
  text-decoration: none;
}

.team-list__item-link:hover
{
  border-color: #999;
}
</style>
