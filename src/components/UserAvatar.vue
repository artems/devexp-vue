<script>
  export default {
    name: 'user-avatar',
    props: {
      user: Object
    },
    computed: {
      baseClass() {
        const approved = this.user.approved ? 'user-avatar_approved' : '';
        return 'user-avatar' + (approved ? ' ' + approved : '');
      }
    }
  };
</script>

<template>
  <div :class="baseClass">
    <img class="user-avatar__image" :src="user.avatar_url" />
    <span class="user-avatar__login">{{user.login}}</span>
  </div>
</template>

<style>
.user-avatar
{
  font-size: 12px;

  display: inline-block;
  padding-right: 10px;

  color: #999;
  text-align: center;
}

.user-avatar__image
{
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #ccc;
}

.user-avatar_approved .user-avatar__image
{
  border: 2px solid #0f0;
}

.user-avatar__login
{
  display: block;
}
</style>
