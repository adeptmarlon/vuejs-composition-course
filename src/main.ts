import { createApp } from 'vue'
import { router } from "./router";
import axios from 'axios'
import * as mockData from './mocks'

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
//@ts-ignore
axios.get = async (url: string) => {
    if (url === '/posts') {
        await delay(1000);
        return Promise.resolve({
            data: [mockData.thisWeek, mockData.todayPost, mockData.thisMonth]
        })
    }
}

import App from './App.vue'

createApp(App).use(router).mount('#app');