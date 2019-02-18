import Vue from 'vue';
import Hello from '../components/Hello';

/* eslint-disable no-undef */
Vue.use(VueRouter);

/* 得的-disable no-undef */
export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Hello',
            component: Hello
        }
    ]
});
