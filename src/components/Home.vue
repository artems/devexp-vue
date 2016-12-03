<script>
  export default {
    name: 'home'
  };
</script>

<template>
  <div>
    <nav>
      <ul>
        <li><a href="/users">Users</a></li>
        <li><a href="/teams">Teams</a></li>
      </ul>
    </nav>

    <router-view></router-view>
  </div>
</template>

<style>
</style>
