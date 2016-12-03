<script>
  import join from 'url-join';
  import { fetchTeam, submitTeam, updateTeam } from '../actions/team';

  export default {
    name: 'team-form',
    data() {
      return {
        name: '',
        approveCount: '',
        totalReviewers: '',
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
        return this.readyState === 'submiting';
      }
    },
    methods: {
      handleSubmit() {
        this.errors = {};
        this.readyState = 'submiting';

        const form = {
          name: this.name,
          reviewConfig: {
            approveCount: this.approveCount,
            totalReviewers: this.totalReviewers
          }
        };
        let action;
        if (!this.id) {
          action = submitTeam(form);
        } else {
          action = updateTeam(this.id, form);
        }

        action
          .then(team => {
            this.readyState = 'submited';
            this.$router.push(join('/teams', team.name));
          })
          .catch(error => {
            this.error = error.reason;
            this.errors = error.errors;
            this.readyState = 'failed';
          });
      }
    },
    mounted() {
      console.info(this);

      if (!this.id) {
        this.readyState = 'loaded';
        return;
      }

      this.readyState = 'loading';

      fetchTeam(this.id)
        .then(team => {
          this.name = team.name;
          this.approveCount = team.reviewConfig.approveCount;
          this.totalReviewers = team.reviewConfig.totalReviewers;
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
      <label>
        Name
        <input v-model="name" size="25" autocomplete="off" />
      </label><br />
      <label>
        Approve count
        <input v-model="approveCount" size="25" autocomplete="off" />
      </label><br />
      <label>
        Total reviewers
        <input v-model="totalReviewers" size="25" autocomplete="off" />
      </label>

      <div><button type="submit" :disabled="isSubmitDisabled">Save</button></div>
    </form>
  </div>
</template>

<style>
</style>
