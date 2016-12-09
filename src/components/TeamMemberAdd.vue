<script>
  import { submitMember } from '../actions/team';

  export default {
    name: 'team-member-add',
    data() {
      return {
        login: '',
        error: '',
        errors: {},
        readyState: 'idle'
      };
    },
    props: {
      id: String
    },
    computed: {
      isSubmitDisabled() {
        return this.login === '' || this.readyState === 'submiting';
      }
    },
    methods: {
      onSubmit(e) {
        this.error = '';
        this.errors = {};
        this.readyState = 'submiting';

        const form = { login: this.login };
        submitMember(this.id, form)
          .then(this.onSuccess.bind(this))
          .then(() => this.$emit('member-add'))
          .catch(this.onFailure.bind(this));
      },
      onSuccess() {
        this.login = '';
        this.error = '';
        this.errors = {};
        this.readyState = 'submited';
      },
      onFailure(error) {
        this.error = error.reason;
        this.errors = error.errors || {};
        this.readyState = 'failed';
      }
    }
  };
</script>

<template>
  <form @submit.prevent="onSubmit">
    <div v-if="error">{{error}}</div>
    <input v-model="login" size="25" autocomplete="off" />
    <div v-if="errors.login">{{errors.login.message}}</div>
    <div><button type="submit" :disabled="isSubmitDisabled">Add</button></div>
  </form>
</template>

<style>
</style>
