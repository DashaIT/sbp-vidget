<template>
    <div class="sbp__loader" id="sbp_loader">
        <img :src="this.loaderSrc">
    </div>
</template>

<script>
    export default {
        name: 'sbp-loader',
        props: {
            loaderSrc: ''
        }
    }
</script>

<style>

</style>