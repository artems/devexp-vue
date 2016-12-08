<script>
  export default {
    name: 'home'
  };
</script>

<template>
  <div>
    <nav>
      <ul>
        <li><router-link to="/users">Users</router-link></li>
        <li><router-link to="/teams">Teams</router-link></li>
      </ul>
    </nav>

    <router-view></router-view>
  </div>
</template>

<style>
</style>
