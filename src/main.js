import { createApp } from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Cookies from 'js-cookie'
import Vue3Toastify from 'vue3-toastify'
import 'flowbite'

import App from './App.vue'
import router from '@utils/router.js'

import 'vue3-toastify/dist/index.css'
import 'vue-multiselect/dist/vue-multiselect.css'
import './style.css'

axios.defaults.baseURL = 'https://aiwprtonshop.site/support/api/'

axios.interceptors.request.use(config => {
  const token = Cookies.get('access')
  config.headers.Authorization = token ? `Bearer ${token}` : ''
  return config
})

createApp(App)
  .use(router)
  .use(VueAxios, { ax: axios })
  .use(Vue3Toastify, {
    multiple: false,
    limit: 1,
    autoClose: 3500,
    // closeButton: false,
    closeOnClick: false,
    style: {
      opacity: '1',
      userSelect: 'initial',
    },
  })
  .mount('#app')
