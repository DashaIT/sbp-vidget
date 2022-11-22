<template>
    <li :data-bank="bank.schema" 
        class="bank__item"
        v:style='background-image: bank.logoURL'
        >
        {{bank.bankName}}
    </li>
</template>

<script>
export default {    
    props: {
        post: {
            type: Object,
            required: true,
        }
    },
}
</script>

<style>

</style>