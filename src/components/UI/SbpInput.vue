<template>
    <input 
        type="text"
        :value = "modelValue"
        @input = "updateInput"
        class = 'input'
    >
</template>

<script>
    export default {
        name: 'sbp-input',
        props: {
            modelValue: {String},
        },
        methods: {
            updateInput(event) {
                this.$emit('update: modelValue', event.target.value)
            }
        }
    }
</script>

<style>


</style>
