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
          '',
          'email',
          'jabber',
          'slack-rasp',
          'slack-serp',
          'slack-search-duty',
          'slack-multimedia',
          'slack-adv',
          'slack-partner',
          'telegram'
        ],
        approveCount: '',
        totalReviewers: '',
        autoAssignReviewers: true,
        setGitHubReviewStatus: false,
        setGitHubReviewAssignees: false,
        fixReviewByAnyone: false,
        pingReviewByAnyone: false,
        stopReviewByAnyone: false,
        startReviewByAnyone: false,
        changeReviewerByAnyone: false,
        patterns: [],
        startrek: {
          queues: '',
          fields: {
            reviewers: ''
          },
          status: {
            notstarted: '',
            inprogress: '',
            changesneeded: '',
            complete: ''
          }
        },
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
            totalReviewers: this.totalReviewers,
            autoAssignReviewers: this.autoAssignReviewers,
            setGitHubReviewStatus: this.setGitHubReviewStatus,
            setGitHubReviewAssignees: this.setGitHubReviewAssignees,
            fixReviewByAnyone: this.fixReviewByAnyone,
            pingReviewByAnyone: this.pingReviewByAnyone,
            stopReviewByAnyone: this.stopReviewByAnyone,
            startReviewByAnyone: this.startReviewByAnyone,
            changeReviewerByAnyone: this.changeReviewerByAnyone,
            startrek: {
              queues: this.startrek.queues.split(',').map(x => x.trim()).filter(Boolean),
              fields: this.startrek.fields,
              status: this.startrek.status
            }
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
            this.steps = Object.keys(steps.allSteps);
            this.reviewSteps = steps.defaultSteps;
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
          this.steps = Object.keys(steps.allSteps);
          this.drivers = drivers;
          this.reviewSteps = team.reviewConfig.steps;
          this.approveCount = team.reviewConfig.approveCount;
          this.notification = team.reviewConfig.notification;
          this.totalReviewers = team.reviewConfig.totalReviewers;
          this.autoAssignReviewers = team.reviewConfig.autoAssignReviewers;
          this.setGitHubReviewStatus = team.reviewConfig.setGitHubReviewStatus;
          this.setGitHubReviewAssignees = team.reviewConfig.setGitHubReviewAssignees;
          this.fixReviewByAnyone = team.reviewConfig.fixReviewByAnyone;
          this.pingReviewByAnyone = team.reviewConfig.pingReviewByAnyone;
          this.stopReviewByAnyone = team.reviewConfig.stopReviewByAnyone;
          this.startReviewByAnyone = team.reviewConfig.startReviewByAnyone;
          this.changeReviewerByAnyone = team.reviewConfig.changeReviewerByAnyone;
          this.startrek.queues = (team.reviewConfig.startrek.queues || []).join(',');
          this.startrek.fields = team.reviewConfig.startrek.fields || {};
          this.startrek.status = team.reviewConfig.startrek.status || {};

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
    <h2>
      <span v-if="!id">Add team</span>
      <span v-if="id">Edit team</span>
    </h2>

    <form class="team-form" @submit.prevent="handleSubmit">
      <div>{{error}}</div>

      <div>
        <label class="input">
          <span class="input__label">Name:</span>
          <input class="input__control" v-model="name" autocomplete="off" />
        </label>
        <label class="select">
          <span class="select__label">Notification:</span>
          <select class="select__control" v-model="notification">
            <option v-for="name in notifications" :value="name">{{name}}</option>
          </select><br />
        </label>
        <label class="select">
          <span class="select__label">Syncronization:</span>
          <select class="select__control" v-model="driver.name">
            <option v-for="(option, name) in drivers" :value="name">{{name}}</option>
          </select>
        </label>
        <template v-for="(option, name) in driverConfig">
          <label class="input">
            <span class="input__label">{{name}}</span>
            <input class="input__control" v-model="driver.options[name]" autocomplete="off" />
          </label>
        </template>
      </div>

      <div>
        <h3>Review options</h3>
        <label class="input">
          <span class="input__label">Approve count:</span>
          <input class="input__control" v-model="approveCount" autocomplete="off" />
        </label>
        <label class="input">
          <span class="input__label">Total reviewers:</span>
          <input class="input__control" v-model="totalReviewers" autocomplete="off" />
        </label>
        <label class="checkbox">
          <input class="checkbox__control" v-model="setGitHubReviewStatus" type="checkbox" />
          <span class="checkbox__label">Set and Update GitHub deploy status</span>
        </label>
        <label class="checkbox">
          <input class="checkbox__control" v-model="setGitHubReviewAssignees" type="checkbox" />
          <span class="checkbox__label">Set and Update GitHub assignees</span>
        </label>

        <label class="checkbox">
          <input class="checkbox__control" v-model="autoAssignReviewers" type="checkbox" />
          <span class="checkbox__label">Assign reviewers when a pull request created</span>
        </label>
      </div>

      <div>
        <h3>Review steps</h3>
        <table class="review-steps-table">
          <tr>
            <th>Current</th>
            <th>Available</th>
          </tr>
          <tr class="review-steps-row">
            <td class="review-steps-cell">
              <draggable element="ul" class="menu dropZone" :list="reviewSteps" :options="{group:{name:'steps'}}">
                <li class="menu__item" v-for="(element, index) in reviewSteps" :key="index">
                  {{element}}
                  <span @click.prevent="deleteStep(index)">[✕]</span>
                </li>
              </draggable>
            </td>
            <td class="review-steps-cell">
              <draggable element="ul" class="menu cloneZone" :list="steps" :options="{sort:false,group:{name:'steps',pull:'clone',put:false}}">
                <li class="menu__item" v-for="(element, index) in steps" :key="index">{{element}}</li>
              </draggable>
            </td>
          </tr>
        </table>
      </div>

      <div>
        <h3>Patterns</h3>
        <div class="input-with-clear" v-for="(pattern, index) in patterns">
          <label class="input">
            <input class="input__control" v-model="pattern.value" size="25" autocomplete="off" />
          </label>
          <button class="button" type="button" @click="handleDeletePattern(index)">
            ✕
          </button>
        </div>
        <div>
          <button class="button" type="button" @click.prevent="handleAddPattern">
            Add pattern
          </button>
        </div>
      </div>

      <div>
        <h3>Startrek</h3>
        <label class="input">
          <span class="input__label">Queues:</span>
          <input class="input__control" v-model="startrek.queues" type="text" />
        </label>
        <label class="input">
          <span class="input__label">Fields "reviewers":</span>
          <input class="input__control" v-model="startrek.fields.reviewers" type="text" />
        </label>
        <label class="input">
          <span class="input__label">Status for "not started"</span>
          <input class="input__control" v-model="startrek.status.notstarted" type="text" />
        </label>
        <label class="input">
          <span class="input__label">Status for "in progress"</span>
          <input class="input__control" v-model="startrek.status.inprogress" type="text" />
        </label>
        <label class="input">
          <span class="input__label">Status for "changes needed"</span>
          <input class="input__control" v-model="startrek.status.changesneeded" type="text" />
        </label>
        <label class="input">
          <span class="input__label">Status for "complete"</span>
          <input class="input__control" v-model="startrek.status.complete" type="text" />
        </label>
      </div>

      <div class="form-submit">
        <button class="button" type="submit" :disabled="isSubmitDisabled">Save</button>
      </div>
    </form>
  </div>
</template>

<style>
  .review-steps-table
  {
    border-collapse: collapse;
  }

  .review-steps-cell
  {
    margin: 0;
    padding: 0;

    border: 0;
    vertical-align: top;
  }

  .review-steps-cell:first-child
  {
    border-right: 10px solid transparent;
  }

  .dropZone
  {
    width: 200px;
    min-height: 100px;
  }

  .cloneZone
  {
    width: 200px;
  }

  .menu
  {
    margin: 0;
    padding: 0;
    list-style: none;

    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .menu__item
  {
    line-height: 1;

    padding: 8px 8px;
    border-bottom: 1px solid #ccc;
  }

  .menu__item:last-child
  {
    border-bottom: 0;
  }

  .menu__item.sortable-drag
  {
    border: 1px solid #ccc;
  }

  .team-form .input,
  .team-form .select
  {
    width: 250px
  }

  .input
  {
    line-height: 24px;

    display: block;

    margin-bottom: 10px;
  }

  .input__label
  {
    font-size: 0.9em;
    display: block;
  }

  .input__control
  {
    font-size: 100%;

    width: 100%;

    box-sizing: border-box;
  }

  .input-with-clear .input
  {
    display: inline-block;

    width: 220px;
  }

  .input-with-clear .input__control
  {
  }

  .input-with-clear .button
  {
  }

  .checkbox
  {
    line-height: 24px;

    display: block;

    margin-bottom: 10px;
  }

  .select
  {
    line-height: 24px;

    display: block;

    margin-bottom: 10px;
  }

  .select__label
  {
    font-size: 0.9em;
    display: block;
  }

  .select__control
  {
    font-size: 100%;
    width: 100%;
  }

  .button
  {
    font-size: 100%;
  }

  .form-submit
  {
    margin: 30px 0;
  }
</style>
