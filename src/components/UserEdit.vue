<script>
  import { fetchUser, updateUser } from '../actions/user';

  export default {
    name: 'user-edit',
    data() {
      return {
        error: '',
        errors: {},
        contacts: [],
        readyState: 'idle'
      };
    },
    computed: {
      isSubmitDisabled() {
        return this.readyState === 'submiting';
      }
    },
    methods: {
      handleSubmit() {
        this.errors = {};
        this.readyState = 'submiting';

        const form = { contacts: this.contacts };
        updateUser(this.$route.params.id, form)
          .then(result => {
            this.error = '';
            this.errors = {};
            this.readyState = 'submited';
          })
          .catch(error => {
            this.error = error.reason;
            this.errors = error.errors;
            this.readyState = 'failed';
          });
      },
      handleAddContact() {
        this.contacts.push({ id: 'email', account: '' });
      },
      handleDeleteContact(index) {
        this.contacts.splice(index, 1);
      }
    },
    mounted() {
      this.readyState = 'loading';

      fetchUser(this.$route.params.id)
        .then(user => {
          this.contacts = user.contacts;
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
    <form @submit.prevent="handleSubmit">
      <div>{{error}}</div>
      <div v-for="(contact, index) in contacts" :key="contact.id">
        <select v-model="contact.id">
          <option value="email">email</option>
          <option value="jabber">jabber</option>
          <option value="telegram">telegram</option>
        </select>
        <input size="25" name="account" v-model="contact.account" autocomplete="off" />
        <button type="button" @click="handleDeleteContact(index)">
          ✕
        </button>
        <div v-if="errors['contacts.' + index + '.id']">{{errors['contacts.' + index + '.id'].message}}</div>
        <div v-if="errors['contacts.' + index + '.account']">{{errors['contacts.' + index + '.account'].message}}</div>
      </div>
      <div>
        <button type="button" @click.prevent="handleAddContact">
          Add contact
        </button>
      </div>

      <div><button type="submit" :disabled="isSubmitDisabled">Save</button></div>
    </form>
  </div>
</template>

<style>
</style>
