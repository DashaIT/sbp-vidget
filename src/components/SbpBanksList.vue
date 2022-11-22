<template>
    <ul v-if="banks.length > 0">
        <sbp-banks-list-item 
            v-for="bank in banks"
            :bank="bank"
            :key='bank.schema'
        /> 
    </ul>

    
</template>

<script>
import SbpBankListItem from '@/components/SbpBankListItem';
export default {
    components: {SbpBankListItem},
    props: {
        banks: {
            type: Array,
            required: true
        }
    }
}
</script>

<style>

</style>