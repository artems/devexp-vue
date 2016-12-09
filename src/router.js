import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from 'components/Home';
import TeamAdd from 'pages/TeamAdd';
import TeamEdit from 'pages/TeamEdit';
import TeamList from 'pages/TeamList';
import TeamInfo from 'pages/TeamInfo';
import TeamMemberList from 'components/TeamMemberList';
import UserList from 'components/UserList';
import UserInfo from 'components/UserInfo';
import UserEdit from 'components/UserEdit';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Home,
    redirect: 'users',
    children: [
      { path: 'teams', component: TeamList },
      { path: 'teams/add', component: TeamAdd },
      { path: 'teams/:id', component: TeamInfo },
      { path: 'teams/:id/edit', component: TeamEdit },
      { path: 'teams/:id/members', component: TeamMemberList },
      { path: 'users', component: UserList },
      { path: 'users/:id', component: UserInfo },
      { path: 'users/:id/edit', component: UserEdit }
    ]
  }
];

const router = new VueRouter({ mode: 'history', routes });

export default router;
