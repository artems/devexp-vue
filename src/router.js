import Vue from 'vue';
import VueRouter from 'vue-router';

import Home from 'components/Home';
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
      { path: 'users', component: UserList },
      { path: 'user/:id', component: UserInfo },
      { path: 'user/:id/edit', component: UserEdit }
    ]
  }
];

const router = new VueRouter({ mode: 'history', routes });

export default router;
