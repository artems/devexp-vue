<script>
  import join from 'url-join';
  import draggable from 'vuedraggable';

  import {
    fetchTeam, submitTeam, updateTeam, fetchDriverList, fetchReviewStepList
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
        steps: [],
        drivers: {},
        reviewSteps: [],
        notification: '',
        notifications: [
          'mail',
          'slack',
          'jabber'
        ],
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
    components: {
      draggable
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
            steps: this.reviewSteps,
            approveCount: this.approveCount,
            notification: this.notification,
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
      handleAddPattern() {
        this.patterns.push({ value: '' });
      },
      handleDeletePattern(index) {
        this.patterns.splice(index, 1);
      },
      deleteStep(index) {
        this.reviewSteps.splice(index, 1);
      }
    },
    mounted() {
      this.readyState = 'loading';

      if (!this.id) {
        Promise.all([fetchDriverList(), fetchReviewStepList()])
          .then(([drivers, steps]) => {
            this.steps = Object.keys(steps);
            this.drivers = drivers;
            this.readyState = 'loaded';
          })
          .catch(() => {
            this.readyState = 'failed';
          });

        return;
      }

      Promise.all([fetchTeam(this.id), fetchDriverList(), fetchReviewStepList()])
        .then(([team, drivers, steps]) => {
          this.name = team.name;
          this.driver.name = team.driver && team.driver.name || '';
          this.driver.options = team.driver && team.driver.options || {};
          this.steps = Object.keys(steps);
          this.drivers = drivers;
          this.reviewSteps = team.reviewConfig.steps;
          this.approveCount = team.reviewConfig.approveCount;
          this.notification = team.reviewConfig.notification;
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
      <label>
        Notification
        <select v-model="notification">
          <option v-for="name in notifications" :value="name">{{name}}</option>
        </select><br />
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

      </div>
      <div>
        <h4>Steps</h4>
        <table>
          <tr>
            <th>Current</th>
            <th>Available</th>
          </tr>
          <tr>
            <td>
              <draggable element="ul" class="dropZone" :list="reviewSteps" :options="{group:{name:'steps'}}">
                <li v-for="(element, index) in reviewSteps" :key="index">
                  {{element}}
                  <span @click.prevent="deleteStep(index)">[✕]</span>
                  </li>
              </draggable>
            </td>
            <td>
              <draggable element="ul" :list="steps" :options="{sort:false,group:{name:'steps',pull:'clone',put:false}}">
                <li v-for="(element, index) in steps" :key="index">{{element}}</li>
              </draggable>
            </td>
          </tr>
        </table>
      </div>
      <div><button type="submit" :disabled="isSubmitDisabled">Save</button></div>
    </form>
  </div>
</template>

<style>
  td
  {
    vertical-align: top;
  }

  .dropZone
  {
    min-height: 100px;
  }
</style>
