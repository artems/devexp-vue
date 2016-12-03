<script>
  import UserAdd from 'components/UserAdd';
  import { fetchUserList, deleteUser } from '../actions/user';

  export default {
    name: 'user-list',
    components: { UserAdd },
    data() {
      return {
        list: [],
        readyState: 'idle'
      };
    },
    methods: {
      update() {
        this.readyState = 'loading';

        fetchUserList()
          .then(users => {
            this.list = users;
            this.readyState = 'loaded';
          })
          .catch(() => {
            this.readyState = 'failed';
          });
      },
      deleteUser(login) {
        deleteUser(login)
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
    <h4>New user</h4>
    <user-add @user-add="update" />
    <h5>Users:</h5>
    <p v-if="readyState === 'loading'">Loading...</p>
    <p v-if="readyState === 'failed'">Failed to fetch users</p>
    <ul v-if="readyState === 'loaded'">
      <li v-for="user in list">
        <a :href="'users/' + user.login + '/'">{{user.login}}</a>
        &mdash;
        <span @click.prevent="deleteUser(user.login)">[✕]</span>
      </li>
    </ul>
  </div>
</template>

<style>
</style>
