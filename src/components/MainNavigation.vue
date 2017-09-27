<script>
  export default {
    name: 'main-navigation'
  };
</script>

<template>
  <nav class="nav">
    <ul class="nav__list">
      <li class="nav__item"><router-link to="/pulls">Pulls</router-link></li>
      <li class="nav__item"><router-link to="/teams">Teams</router-link></li>
      <li class="nav__item"><router-link to="/users">Users</router-link></li>
    </ul>
  </nav>
</template>

<style>
.nav
{
}

.nav__list
{
  margin: 0;
  padding: 0;

  list-style: none;
}

.nav__item :link,
.nav__item :visited
{
  display: block;

  padding: 24px;

  color: rgb(164, 176, 191);
  text-transform: uppercase;
  text-decoration: none;
}

.nav__item:hover :link,
.nav__item:hover :visited
{
  color: #fff;

  background-color: rgb(66, 87, 106);
}
</style>
