<template>
    <div id="qr__root">
        <figure>
            <qrcode-vue :value="link" :size="size" level="H" render-as="svg" />
            <img
                class="qrcode__image"
                src="https://avatars.githubusercontent.com/u/3456749"
                alt="Chen Fengyuan"
            />
        </figure>

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
.qrcode__image {
    background-color: #fff;
    border: 0.25rem solid #fff;
    border-radius: 0.25rem;
    box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.25);
    height: 30px;
    left: 50%;
    overflow: hidden;
    position: absolute;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
  }
</style>