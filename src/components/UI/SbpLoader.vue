<template>
    <div class="sbp__loader hidden" id="sbp_loader">
        <img :src="loaderSrc">
    </div>
</template>

<script>
export default {
    name: 'sbp-loader',
    props: {
        loaderSrc: {
            type: String
        }
    }
}
</script>

<style>

</style>