<script>
  import TeamForm from 'components/TeamForm';

  export default {
    name: 'page-team-edit',
    components: { TeamForm }
  };
</script>

<template>
  <team-form :id="$route.params.id" />
</template>
