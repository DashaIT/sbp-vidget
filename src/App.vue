<template>
    <div class="form-container">
        <div class="sbp-payment-btn" @click="getLink">
            SBP
        </div>
        <div class="sbp-container">
            <sbp-quar v-if="this.link" />
            <sbp-banks-container />

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

export default {
    data() {
        return {
            link: '',
            size: 200,
        }
    },
    methods: {
        getLink() {
            fetch('http://localhost:3000/links')
                .then(res => res.json())
                .then(json => {
                    console.log('IT', json[0].link)
                    this.link = json[0].link;
                })
        }
    },

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