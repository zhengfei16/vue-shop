import Vue from 'vue';
import Hello from '../components/Hello';

/* eslint-disable no-undef */
Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Hello',
            component: Hello
        }
    ]
});
