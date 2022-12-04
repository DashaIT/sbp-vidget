<template>
    <li :data-bank="bank.schema" class="bank__item" :style="{ 'background-image': `url(${bank?.logoURL})` }">
        {{ bank.bankName }}
    </li>
</template>

<script>
export default {
    props: {
        bank: {
            type: Object,
            required: true,
        }
    },
}
</script>

<style>

</style>