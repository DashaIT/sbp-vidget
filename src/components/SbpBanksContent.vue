<template>
    <h3 class="sbp__banks-title">Выберите банк</h3>
    <sbp-input class="sbp__banks-search" v-model="searchQuery" />
    <sbp-banks-list :banks="searchedBanks" v-if="banks.length" />
    <sbp-banks-no-result v-else />
</template>

<script>
import SbpBanksList from './SbpBanksList';
import SbpBanksNoResult from '@/components/SbpBanksNoResult';
export default {
    components: {
        SbpBanksList,
        SbpBanksNoResult,
    },
    data() {
        return {
            searchQuery: '',
        }
    },
    props: {
        banks: {
            type: Array
        }
    },
    computed: {

        searchedBanks() {
            return this.banks.filter(bank => bank.bankName.toLowerCase().includes(this.searchQuery.toLowerCase()))
        }
    }
}
</script>

<style>

</style>