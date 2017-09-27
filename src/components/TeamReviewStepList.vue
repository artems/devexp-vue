<script>
  import join from 'url-join';
  import { fetchTeam, updateTeam, fetchReviewStepList } from '../actions/team';

  export default {
    name: 'team-review-step-list',
    data() {
      return {
        team: null,
        errors: {},
        stepsOptions: {},
        readyState: 'idle'
      };
    },
    computed: {
      id() {
        return this.$route.params.id;
      },
      isSubmitDisabled() {
        return this.readyState === 'submiting';
      }
    },
    methods: {
      update() {
        this.readyState = 'loading';

        Promise.all([fetchTeam(this.id), fetchReviewStepList()])
          .then(([team, steps]) => {
            this.team = team;
            this.steps = steps.allSteps;
            this.stepsOptions = this.steps2string(team.reviewConfig.stepsOptions) || {};
            this.readyState = 'loaded';
          })
          .catch(() => {
            this.readyState = 'failed';
          });
      },
      hasConfig(step) {
        return Object.keys(this.steps[step]).length > 0;
      },
      handleSubmit() {
        this.errors = {};
        this.readyState = 'submiting';

        const form = {
          name: this.team.name,
          driver: this.team.driver,
          patterns: this.team.patterns,
          reviewConfig: {
            steps: this.team.reviewConfig.steps,
            stepsOptions: this.steps2json(this.stepsOptions),
            approveCount: this.team.reviewConfig.approveCount,
            totalReviewers: this.team.reviewConfig.totalReviewers
          }
        };

        updateTeam(this.id, form)
          .then(team => {
            this.readyState = 'submited';
            this.$router.push(join('/teams', team.name));
          })
          .catch(error => {
            this.error = error.reason;
            this.errors = error.errors;
            this.readyState = 'failed';
          });
      },
      steps2string(steps) {
        const newSteps = {};
        for (let i in steps) {
          newSteps[i] = JSON.stringify(steps[i]);
        }
        return newSteps;
      },
      steps2json(steps) {
        const newSteps = {};
        for (let i in steps) {
          newSteps[i] = JSON.parse(steps[i]);
        }
        return newSteps;
      }
    },
    mounted() {
      this.update();
    }
  };
</script>

<template>
  <div>
    <h5>Steps:</h5>
    <p v-if="readyState === 'loading'">Loading...</p>
    <p v-if="readyState === 'failed'">Failed to fetch users</p>
    <form @submit.prevent="handleSubmit" v-if="readyState === 'loaded'">
      <ul>
        <li v-for="step in team.reviewConfig.steps">
          <span>{{step}}</span>
          <div v-if="hasConfig(step)">
            <textarea v-model="stepsOptions[step]"></textarea><br />
            {{steps[step]}}
          </div>
        </li>
      </ul>
      <div><button type="submit" :disabled="isSubmitDisabled">Save</button></div>
    </form>
  </div>
</template>

<style>
</style>
