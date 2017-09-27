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

  font-size: 16px;
  font-family: Helvetica, Verdana, sans-serif;
}

.home h1
{
  font-size: 1.2em;
  font-weight: 100;

  margin: 1em 0 2em;

  color:  rgb(134, 154, 176);
  text-transform: uppercase;
  letter-spacing: 0.05em;
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

.button-link:link,
.button-link:visited
{
  text-decoration: none;
}

.button-link:hover
{
  text-decoration: underline
}
</style>
