<script>
  import Pager from 'components/ui/pager';
  import UserAdd from 'components/UserAdd';
  import { fetchUserList, deleteUser } from '../actions/user';

  export default {
    name: 'user-list',
    components: { Pager, UserAdd },
    data() {
      return {
        list: [],
        pager: {
          skip: this.$route.query.skip || 0,
          limit: this.$route.query.limit || 0,
          count: 0
        },
        readyState: 'idle'
      };
    },
    methods: {
      update() {
        this.readyState = 'loading';

        fetchUserList(this.pager.skip, this.pager.limit)
          .then(result => {
            this.list = result.result;
            this.pager = {
              skip: result.skip,
              limit: result.limit,
              count: result.count
            };
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
    <div v-if="readyState === 'loaded'">
      <pager :skip="pager.skip" :limit="pager.limit" :count="pager.count" url="/users" />
      <ul>
        <li v-for="user in list">
          <router-link :to="'users/' + user.login + '/'">{{user.login}}</router-link>
          &mdash;
          <span @click.prevent="deleteUser(user.login)">[✕]</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<style>
</style>
