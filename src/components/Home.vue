<script>
  import MainNavigation from './MainNavigation';

  export default {
    name: 'home',
    components: { MainNavigation }
  };
</script>

<template>
  <div class="home">
    <div class="home__left">
      <MainNavigation />
    </div>
    <div class="home__right">
      <router-view></router-view>
    </div>
  </div>
</template>

<style>
html, body
{
  margin: 0;
  padding: 0;
}

.home h1
{
  font-size: 18px;
  font-family: sans-serif;
  font-weight: 100;

  color:  rgb(134, 154, 176);
  text-transform: uppercase;
}

.home
{
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;

  min-height: 100vh;
}

.home__left
{
  background-color: rgb(91, 110, 127);
}

.home__right
{
  flex-grow: 1;

  padding: 24px;

  background-color: rgb(249, 249, 249);
}
</style>
