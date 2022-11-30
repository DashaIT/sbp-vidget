<template>
    <div id="qr__root">
        <qrcode-vue :value="link" :size="size" level="H" render-as="svg" />
    </div>
</template>

<script>
import QrcodeVue from 'qrcode.vue';
export default {
    props: {
        size: {
            type: Number
        }
    },
    components: {
        QrcodeVue,
    }
}

</script>

<style>

</style>