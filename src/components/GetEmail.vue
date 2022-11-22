<template>
    <label for="getEmail">
        <sbp-input class="visually-hidden" />        
        <sbp-toggle>Отправить чек по операции</sbp-toggle>
    </label>
</template>

<script>
export default {
    data() {
        return {

        }
    }
}
</script>

<style scoped>
.visually-hidden:not(:focus):not(:active), input[type="checkbox"].visually-hidden, input[type="radio"].visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    border: 0;
    padding: 0;
    white-space: nowrap;
    -webkit-clip-path: inset(100%);
    clip-path: inset(100%);
    clip: rect(0 0 0 0);
    overflow: hidden;
}
</style>