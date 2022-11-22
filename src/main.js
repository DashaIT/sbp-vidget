import { createApp } from 'vue'
import App from './App.vue';
import components from '@/components/UI';

components.forEach(component => {
    SBPVidget.component(component.name, component)
})

const SBPVidget = createApp(App);
SBPVidget.mount('#sbp-vidget')
