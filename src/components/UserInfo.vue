<script>
  import join from 'url-join';
  import { fetchUser } from '../actions/user';

  export default {
    name: 'user-info',
    data() {
      return {
        user: {},
        readyState: 'idle'
      };
    },
    methods: {
      editUrl() {
        return join('/user', this.$route.params.id, 'edit');
      },
      handleEdit() {
        this.$router.push(this.editUrl());
      },
      hasContacts() {
        return this.user.contacts && this.user.contacts.length > 0;
      }
    },
    mounted() {
      this.readyState = 'loading';

      fetchUser(this.$route.params.id)
        .then(user => {
          this.user = user;
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
    <p v-if="readyState === 'failed'">Failed to fetch user</p>
    <div v-if="readyState === 'loaded'">
      <ul>
        <li>Name: {{user.login}}</li>
      </ul>
      <ul v-if="hasContacts">
        <li v-for="item in user.contacts">{{item.id}} &mdash; {{item.account}}</li>
      </ul>
      <button type="button" @click="handleEdit">Edit</button>
    </div>
  </div>
</template>

<style>
</style>
