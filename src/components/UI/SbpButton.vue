<template>
    <button :type="type">
        <slot></slot>
    </button>
</template>

<script>
export default {
    name: 'sbp-button',
    props: {
        type: {
            type: String
        }
    }
}
</script>

<style scoped>
.sbp-payment-btn {
    width: 50px;
    height: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border: 1px solid #eb4c0c;
    border-radius: 10px;
    margin-bottom: 20px;
}

.payment-method__button {
    margin-bottom: 30px;
}

button {
    text-align: center;
    color: #fff;
    border-radius: 20px;
}
</style>
