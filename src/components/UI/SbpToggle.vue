<template>
    <span class="checkbox-body">
    </span>
    <span class="checkbox-label">
        <scope></scope>
    </span>
</template>

<script>
export default {
    name: 'sbp-toggle',
}
</script>

<style scoped>
.checkbox__body {
    position: relative;
    width: 58px;
    height: 32px;
    background-color: #E1E1E1;
    box-sizing: border-box;
    border-radius: 100px;
    cursor: pointer;
}

.checkbox__body::after {
    content: "";
    position: absolute;
    top: 50%;
    margin-top: -12px;
    left: 3px;
    width: 24px;
    height: 24px;
    background: #FFFFFF;
    border-radius: 100px;
    transition: all 0.3s ease;
}

.checkbox__label {
    width: auto;
    height: auto;
    margin-left: 16px;
    font-size: 14px;
    line-height: 18px;
    font-weight: 400;
    color: #806C90;
}
</style>
