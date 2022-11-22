<template>
    <div class="sbp__quar">
        <qrcode-vue :value="link" :size="size" level="H" render-as="svg" />
    </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
export default {
    components: {
        QrcodeVue,
    }
}

</script>

<style>

</style>