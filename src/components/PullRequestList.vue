<script>
  import { fetchPullRequestList } from '../actions/pulls';
  import UserAvatar from '../components/UserAvatar';

  export default {
    name: 'pull-request-list',
    components: { UserAvatar },
    data() {
      return {
        list: [],
        readyState: 'idle'
      };
    },
    mounted() {
      this.readyState = 'loading';

      fetchPullRequestList()
        .then(pulls => {
          this.list = pulls;
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
    <h1>Pull Requests</h1>
    <p v-if="readyState === 'loading'">Loading...</p>
    <p v-if="readyState === 'failed'">Failed to fetch pulls</p>
    <div v-if="readyState === 'loaded'">
      <table class="pulls__table">
        <tr>
          <th class="pulls__number">NUMBER</th>
          <th class="pulls__title">TITLE</th>
          <th class="pulls__author">AUTHOR</th>
          <th class="pulls__reviewers">REVIEWERS</th>
        </tr>
        <tr v-for="pull in list">
          <td class="pulls__number">{{pull.repository.full_name}}/{{pull.number}}</td>
          <td class="pulls__title"><a :href="pull.html_url">{{pull.title}}</a></td>
          <td class="pulls__author"><UserAvatar :user="pull.user" /></td>
          <td class="pulls__reviewers">
            <span v-for="user in pull.review.reviewers">
              <UserAvatar :user="user"/>
            </span>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<style>
.pulls__table
{
  font: 14px/16px monospace;

  background: #fff;
  border-radius: 8px;
  border-collapse: collapse;
}

.pulls__table th
{
  font-size: 12px;
  font-weight: normal;

  padding: 12px;
  padding-bottom: 20px;

  color: #999;
  text-align: left;
}

.pulls__table td
{
  padding: 12px;

  border-bottom: 1px solid #eee;
}

.pulls__table .pulls__author
{
  text-align: center;
}
</style>
