<script>
  import join from 'url-join';
  import {
    syncTeam, fetchTeam, submitTeam, updateTeam, fetchDriverList
  } from '../actions/team';

  export default {
    name: 'team-form',
    data() {
      return {
        name: '',
        driver: {
          name: '',
          options: {}
        },
        drivers: {},
        approveCount: '',
        totalReviewers: '',
        patterns: [],
        error: '',
        errors: {},
        readyState: 'idle'
      };
    },
    props: {
      id: String
    },
    computed: {
      driverConfig() {
        return this.drivers[this.driver.name] || {};
      },
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
          driver: this.driver,
          patterns: this.patterns.map(x => x.value),
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
      },
      handleSyncTeam() {
        syncTeam(this.id);
      },
      handleAddPattern() {
        this.patterns.push({ value: '' });
      },
      handleDeletePattern(index) {
        this.patterns.splice(index, 1);
      }
    },
    mounted() {
      if (!this.id) {
        this.readyState = 'loaded';
        return;
      }

      this.readyState = 'loading';

      Promise.all([fetchTeam(this.id), fetchDriverList()])
        .then(([team, drivers]) => {
          this.name = team.name;
          this.driver.name = team.driver.name || '';
          this.driver.options = team.driver.options || {};
          this.drivers = drivers;
          this.approveCount = team.reviewConfig.approveCount;
          this.totalReviewers = team.reviewConfig.totalReviewers;
          this.patterns = team.patterns.map(x => { return { value: x }; });
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
      </label><br />
      <label>
        Driver
        <select v-model="driver.name">
          <option v-for="(option, name) in drivers" :value="name">{{name}}</option>
        </select><br />
        <template v-for="(option, name) in driverConfig">
          <label>
            {{name}}
            <input v-model="driver.options[name]" size="25" autocomplete="off" />
          </label><br />
        </template>
      </label>
      <div>
        <h4>Patterns</h4>
        <div v-for="(pattern, index) in patterns">
          <input v-model="pattern.value" size="25" autocomplete="off" />
          <button type="button" @click="handleDeletePattern(index)">
            ✕
          </button>
        </div>
        <div>
          <button type="button" @click.prevent="handleAddPattern">
            Add pattern
          </button>
        </div>

        <div v-if="this.id">
          <button type="button" @click.prevent="handleSyncTeam">
            Sync team
          </button>
        </div>
      </div>
      <div>
        <h4>Steps</h4>
      </div>
      <div><button type="submit" :disabled="isSubmitDisabled">Save</button></div>
    </form>
  </div>
</template>

<style>
</style>
