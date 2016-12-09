<script>
  import TeamMemberAdd from 'components/TeamMemberAdd';
  import { fetchTeamMemberList, deleteMember } from '../actions/team';

  export default {
    name: 'team-member-list',
    components: { TeamMemberAdd },
    data() {
      return {
        list: [],
        readyState: 'idle'
      };
    },
    computed: {
      id() {
        return this.$route.params.id;
      }
    },
    methods: {
      update() {
        this.readyState = 'loading';

        fetchTeamMemberList(this.id)
          .then(users => {
            this.list = users;
            this.readyState = 'loaded';
          })
          .catch(() => {
            this.readyState = 'failed';
          });
      },
      deleteMember(login) {
        deleteMember(this.id, login)
          .then(() => {
            this.list = this.list.filter(user => user.login !== login);
          });
      }
    },
    mounted() {
      this.update();
    }
  };
</script>

<template>
  <div>
    <h4>New member</h4>
    <team-member-add :id="id" @member-add="update" />
    <h5>Members:</h5>
    <p v-if="readyState === 'loading'">Loading...</p>
    <p v-if="readyState === 'failed'">Failed to fetch users</p>
    <ul v-if="readyState === 'loaded'">
      <li v-for="user in list">
        <span>{{user.login}}</span>
        &mdash;
        <span @click.prevent="deleteMember(user.login)">[✕]</span>
      </li>
    </ul>
  </div>
</template>

<style>
</style>
