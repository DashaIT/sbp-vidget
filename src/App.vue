<template>
    <div class="form-container">
        <div class="payment-method__group">
            <button class="payment-method__button payment-method__button--sbpn" @click="getLink">
                <img :src="this.sbpTabButtonImg" alt="sbp" />
            </button>
        </div>

        <div class="sbp" id="sbp_root">
            <div class="sbp__qr" id="qr">
                <sbp-loader id="sbp_loader" />
                <sbp-qr v-if="this.sbpQRLink" :sbpQRLink="this.sbpQRLink" :size="size" />
            </div>

            <sbp-banks-container :banks="this.banks" />

            <div class="email">
                <sbp-input v-if="emailState === 0 || emailState === 2 || emailState === 3" />
            </div>

            <div class="amount-block">
                <div class="amount-title">
                    Сумма к оплате
                </div>
                <div class="totalAmount">
                    10 руб
                </div>
            </div>
            <div class="button-container">
                <sbp-button>
                    Оплатить
                </sbp-button>
            </div>

        </div>
    </div>
</template>

<script>
import SbpQr from '@/components/SbpQr';
import SbpBanksContainer from './components/SbpBanksContainer';
import SbpLoader from './components/UI/SbpLoader';

export default {
    components: {
        SbpQr, SbpBanksContainer, SbpLoader
    },
    data() {
        return {
            sbpQRLink: '',
            size: 200,
            banks: [],
            sbpTabButtonImg: 'https://dev3.best2pay.net/static/common/img/enigma/sbp-logo-text.svg',
            emailState: 1
        }
    },
    methods: {
        getLink() {
            fetch('http://localhost:3000/links')
                .then(res => res.json())
                .then(json => {
                    console.log('link', json[0].link)
                    this.sbpQRLink = json[0].link;
                })
        },
        getBanks() {
            fetch('http://localhost:3000/banks')
                .then(res => res.json())
                .then(json => {
                    console.log(json);
                    this.banks = json
                })
        }
    },

    mounted() {
        this.getLink();
        this.getBanks();
    }

}

</script>

<style>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

.form-container {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
}

.amount-block {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.button-container {
    display: flex;
    justify-content: center;
}
</style>