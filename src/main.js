import { createApp } from 'vue'
import App from './App.vue';
import components from '@/components/UI';
import '@/css/default140322.min.css';
import '@/css/sbp.css';


const SBPVidget = createApp(App);

components.forEach(component => {
    SBPVidget.component(component.name, component)
})


SBPVidget.mount('#sbp-vidget')
