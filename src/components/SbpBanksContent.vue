<template>
    <h3 class="sbp__banks-title">Выберите банк</h3>
    <sbp-input class="sbp__banks-search"/>
    <sbp-banks-list v-if="banks.length" />
    <sbp-banks-no-result v-else/>
</template>

<script>
import SbpBanksList from './SbpBanksList';
import SbpBanksNoResult from '@/components/SbpBanksNoResult';
export default {
    components: {
        SbpBanksList,
        SbpBanksNoResult,
    }
}
</script>

<style>

</style>