<template>
    <div class="sbp__banks container__inner">
        <sbp-button class="sbp__pick-bank _placeholder">
            Выбрать банк для открытия QR
        </sbp-button>
        <div class="sbp__banks-overlay">
            <sbp-banks-content :banks="banks" />
        </div>
    </div>

</template>

<script>
import SbpBanksContent from '@/components/SbpBanksContent';
export default {
    components: { SbpBanksContent },
    props: {
        banks: {
            type: Array
        }
    }
}
</script>

<style scoped>
.sbp__pick-bank::after {
    content: '';
    position: absolute;
    right: 24px;
    top: 50%;
    width: 24px;
    height: 24px;
    margin-top: -12px;
    background-color: #E6DFF8;
    /* background-image: url(/static/common/img/enigma/purple-arrow-icon.svg); */
    background-repeat: no-repeat;
    border-radius: 50%;
    background-position: 50% 50%;
    transform: rotate(180deg);
    transition: transform 0.3s ease;
}
</style>