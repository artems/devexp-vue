<script>
  import { submitUser } from '../actions/user';

  export default {
    name: 'user-add',
    data() {
      return {
        login: '',
        errors: {},
        readyState: 'idle'
      };
    },
    computed: {
      isSubmitDisabled() {
        return this.login === '' || this.readyState === 'submiting';
      }
    },
    methods: {
      onSubmit(e) {
        this.errors = {};
        this.readyState = 'submiting';

        const form = { login: this.login };
        submitUser(form)
          .then(this.onSuccess.bind(this))
          .then(() => this.$emit('user-add'))
          .catch(this.onFailure.bind(this));
      },
      onSuccess() {
        this.login = '';
        this.errors = {};
        this.readyState = 'submited';
      },
      onFailure(error) {
        this.errors = error.errors;
        this.readyState = 'failed';
      }
    }
  };
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input v-model="login" size="25" autocomplete="off" />
    <div v-if="errors.login">{{errors.login.message}}</div>
    <div><button type="submit" :disabled="isSubmitDisabled">Add</button></div>
  </form>
</template>

<style>
</style>
