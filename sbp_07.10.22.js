function isDesktop() {
    return !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(navigator.userAgent))
}
let sbpSubmitButtonText = 'Оплатить через'
let emailLabelText = 'Элeктронная почта'
let emailToggleText = 'Отправить чек по операции'
let DESKTOP_ERROR_DOWNLOAD_IMG_URL = '/static/common/img/qr/error-download-qr-desktop.svg'
let MOBILE_ERROR_DOWNLOAD_IMG_URL = '/static/common/img/qr/error-download-qr-mobile.svg'
let NOT_OPEN_BANKS_BY_BUTTON_ON_MOBILE = true

function initSbp() {
    const $root = document.querySelector('#sbp_root')
    const $payBtn = document.querySelector('#sbpButton')
    if (!$root || !$payBtn) return

    const toggle = initSbpBanks()
    const $sbpBanks = document.querySelector('.sbp__banks')

    const $formContent = document.querySelector('#formContent')
    const $paymentTypeCardBtn = document.querySelector('#paymentTypeCard')
    const $loader = document.querySelector('#sbp_loader')
    const $qr = document.querySelector('#qr')
    const $getQrBtn = document.querySelector('#getQr')
    const $qrImage = document.createElement('img')
    const $help = document.querySelector('.sbp__help')
    const $qr__root = document.querySelector('#qr__root')
    const $togleTrigger = document.querySelector('.text')

    const sector = document.querySelector('input[name=sector]').value
    const id = document.querySelector('input[name=id]').value
    const signature = document.querySelector('input#serviceSignature').value

    //const isDesktop = window.screen.width > 1023
    const CHECK_STATUS_URL = '/webapi/SbpPaymentStatus'

    let qrIsLoad = false
    let checkStatusInterval;
    let checkIfEmailToSend = true;
    let nspkLink = ''
    let sbpOperationId

    let $email = null
    let $emailWrap = null
    let $emailCheckbox = null
    let $emailCheckboxWrap = null

    let qr_image;
    let qr_options = {
        text: "",
        width: 200,
        height: 200,
        colorDark: "#000000",
        colorLight: "#ffffff",
        logo: "/static/common/img/qr/sbp_logo_inner-qr.svg",
        logoWidth: 60,
        logoHeight: 48,
        logoBackgroundColor: '#ffffff',
        logoBackgroundTransparent: false,
    }

    function getErrorTemplate() {
        var isDesk = isDesktop(),
            title = isDesk ? 'Не удалось загрузить QR-код' : 'Не удалось загрузить ссылку',
            text = 'Попробуйте другие способы оплаты',
            imgSrc = isDesk ? DESKTOP_ERROR_DOWNLOAD_IMG_URL : MOBILE_ERROR_DOWNLOAD_IMG_URL
        return `
            <img class="sbp-error__img" src="${imgSrc}" />
            <h3 class="sbp-error__title">${title}</h3>
            <p class="sbp-error__text">${text}</p>
        `
    }

    const qrIsloadedHandler = (result) => {
        qrIsLoad = true
        $getQrBtn.disabled = false

        if (result.data) {
            nspkLink = result.data.nspkLink
            sbpOperationId = result.data.sbpOperationId
        } else {
            nspkLink = result.SDPayInSBPQRLink.payload
            sbpOperationId = result.SDPayInSBPQRLink.sbpOperationId
        }

        setQR(nspkLink)
        if (!isDesktop()) {
            $getQrBtn.href = nspkLink
            $getQrBtn.querySelector('.text').textContent = sbpSubmitButtonText
        } else {
            $getQrBtn.classList.add('hidden')
        }

        $loader.classList.add('hidden')
        $help.classList.remove('hidden')
        $getQrBtn.classList.remove('is-loaded')


        checkStatusInterval = setInterval(async () => {
            const checkStatusResult = await checkStatus(CHECK_STATUS_URL, {
                sector,
                id,
                signature,
                sbpOperationId,
            })

            if (checkStatusResult && checkStatusResult.success && checkStatusResult.notifyPageUrl) {
                clearInterval(checkStatusInterval)

                if (window.emailState === 2 && checkIfEmailToSend) {
                    const emailValue = $email.value

                    if (emailValue && emailValue !== window.orderEmail) {
                        sendEmailHandler(checkStatusResult.notifyPageUrl)
                        return
                    }
                }
                document.location = checkStatusResult.notifyPageUrl
            }
        }, 5000)

        setTimeout(() => {
            clearInterval(checkStatusInterval)
        }, 60000 * 15)
    }

    const getQr = async () => {
        $qr.classList.remove('hidden')
        $sbpBanks.classList.remove('hidden')
        $getQrBtn.classList.add('is-loaded')

        if (isDesktop()) {
            $getQrBtn.classList.add('hidden')
        }

        if (!qrIsLoad) {
            $getQrBtn.disabled = true
            window.emailState === 0 && $emailCheckboxWrap.classList.add('hidden')
            window.emailState === 0 && $emailWrap.classList.add('hidden')
            const result = await fetchQr()

            const PurchaseQRLink = !!(result && result.success && result.data &&  result.data.nspkLink && result.data.sbpOperationId)
            const PayInSBPQRLink = !!(result && result.SDPayInSBPQRLink && (result.SDPayInSBPQRLink.code === 'RM00000' || result.SDPayInSBPQRLink.code === 'RQ00000') && result.SDPayInSBPQRLink.payload && result.SDPayInSBPQRLink.sbpOperationId)

            if (PurchaseQRLink || PayInSBPQRLink) {
                qrIsloadedHandler(result)
                if (!isDesktop() && NOT_OPEN_BANKS_BY_BUTTON_ON_MOBILE) {
                    toggle()
                }

            } else {
                qrIsLoad = true

                if (isDesktop()) {
                    $getQrBtn.classList.add('hidden')
                    $getQrBtn.disabled = false

                    $qr__root.appendChild($qrImage)

                    $help.classList.add('hidden')
                    $getQrBtn.classList.add('hidden')
                    $sbpBanks.classList.add('hidden')
                    $emailCheckbox && $emailCheckbox.classList.add('hidden')
                } else {
                    $getQrBtn.classList.add('hidden')
                    document.querySelector('.sbp__qr').style.display = 'block'
                }
                $loader.classList.add('hidden')
                $sbpBanks.classList.add('hidden')
                $qr__root.insertAdjacentHTML('beforeend', getErrorTemplate())
                $(document).trigger('failed-load-sbp')
            }
        }
    }

    const checkStatus = async (url, data) => {
        const {sector, id, signature, sbpOperationId} = data
        return fetch(`${url}?sector=${sector}&id=${id}&sbpOperationId=${sbpOperationId}&signature=${signature}`)
            .then(res => res.json())
            .catch(e =>
                console.error(e)
            )
    }

    const fetchQr = async () => {
        const urlForFetch = ($emailCheckbox && $emailCheckbox.checked && $email && $email.value)
            ? window.GET_QR_URL + '&email=' + $email.value
            : window.GET_QR_URL

        return fetch(urlForFetch, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).catch(e => console.error(e))
    }

    const sbpClickHandler = (event) => {
        $formContent.classList.add('hidden')
        $root.classList.remove('hidden')
        $payBtn.classList.add('active')

        if (window.emailState !== 0) {
            getQrClickHandler(event)
        }
    }

    const getQrClickHandler = (event) => {
        event.preventDefault()
        if (!qrIsLoad) {
            if (window.emailState === 0 || window.emailState === 3) {
                if ($('form').valid()) {
                    try {
                        getQr()
                    } catch (e) {
                        console.error(e)
                    }
                }
            }

            if (window.emailState === 2 || window.emailState === 1) {
                try {
                    getQr()
                } catch (e) {
                    console.error(e)
                }
            }

        } else {
            if (!isDesktop() && NOT_OPEN_BANKS_BY_BUTTON_ON_MOBILE) {
                toggle()
            } else if (event.target !== $payBtn){
                toggle()
            }
        }
    }

    const renderEmail = () => {
        let templateLabel = ``
        let dafaultState = ``
        let ignoreValidation = ``

        if( window.emailState !== 3 ){
            templateLabel = `
            <label class="sbp__get-email container__inner" htmlFor="getEmail">
                <input type="checkbox" class="visually-hidden" aria-label="is need email?" id="getEmail">
                    <span class="checkbox__body"></span>
                    <span class="checkbox__label">${emailToggleText}</span>
            </label>`
            dafaultState = `closed`
            ignoreValidation = `ignore-validation`
        }
        let template =`
            <div class="input input--email input--sbp container__inner ${dafaultState}">
                <div class="input__error"></div>
                <input class="input__field ${ignoreValidation}"
                       value="${window.orderEmail ? window.orderEmail : ''}"
                       id="emailForSbp" type="text"
                       name="email"  inputmode="email"
                       required
                       placeholder=" "/>
                <label class="input__label" for="emailForSbp">${emailLabelText}</label>
            </div>
        `
        if( window.emailState !== 3 ) {
            template = templateLabel + template
        }

        if (window.emailState === 0) {
            document.querySelector('#qr').insertAdjacentHTML('afterend', template)
        } else if (window.emailState === 1 || window.emailState === 2 || window.emailState === 3) {
            document.querySelector('.sbp__banks').insertAdjacentHTML('afterend', template)
        }

        $email = document.querySelector('#emailForSbp')
        $emailCheckboxWrap = document.querySelector('.sbp__get-email')
        $emailWrap = document.querySelector('.input--email.input--sbp')
        $emailCheckbox = document.querySelector('#getEmail')

        $emailCheckbox && $emailCheckbox.addEventListener('change', onEmailCheckboxHandler)
        $email && $email.addEventListener('keypress', (event) => {
            if (event.keyCode === 13) {
                event.preventDefault()
            }
        })
    }

    const sendEmailHandler = (redirectUrl) => {
        const URL = `/webapi/mailer/SendEmailNotify?action=setEmail&email=${$email.value}&sector=${sector}&id=${id}&signature=${signature}`

        fetch(URL, {
            method: 'POST',
        }).then(res => res.json()).then(res => {
            if (res && res.success) {
                $emailCheckboxWrap.classList.add('hidden')
                $emailWrap.classList.add('hidden')

                if (redirectUrl) {
                    window.location = redirectUrl
                }
            }
            return res
        }).catch(error => {
            console.log(error)
        })
    }

    const cardClickHandler = (event) => {
        event.preventDefault()
        $root.classList.add('hidden')
        $formContent.classList.remove('hidden')
        $payBtn.classList.remove('active')
    }

    const onEmailCheckboxHandler = (event) => {
        if (event.target.checked) {
            $emailWrap.classList.remove('closed')
            $email.classList.remove('ignore-validation')
            checkIfEmailToSend = true
        } else {
            $emailWrap.classList.add('closed')
            $email.classList.add('ignore-validation')
            checkIfEmailToSend = false
        }
    }

    function setQR(text) {
        $qr__root.innerHTML = ''
        qr_options.text = text
        qr_image = new QRCode($qr__root, qr_options);
    }

    (window.emailState !== 1) && renderEmail()

    $payBtn.addEventListener('click', sbpClickHandler)
    $paymentTypeCardBtn.addEventListener('click', cardClickHandler)
    $getQrBtn.addEventListener('click', getQrClickHandler)

    $(document).on('change-sbp-bank', (event, bank) => {
        var url = bank + nspkLink.replace('https', '')
        $getQrBtn.href = url
        if (!isDesktop()) {
            location.href = url
        } else {
            setQR(url)
        }
    })
}

function initSbpBanks() {
    getBanksData()

    let banksData = null
    const $payBtn = document.querySelector('#sbpButton')
    const $getQrBtn = document.querySelector('#getQr')
    const $container = document.querySelector('.sbp__banks')
    const $noResults = document.querySelector('#noResults')
    const $banksContainer = document.querySelector('#banks')
    const $overlay = document.querySelector('.sbp__banks-overlay')
    const $pickBankbtn = document.querySelector('.sbp__pick-bank')
    const $content = document.querySelector('.sbp__banks-content')
    const $search = document.querySelector('#searchBank')
    
    $search.setAttribute('autocomplete', 'off');

    document.addEventListener('click', (event) => {
        const $target = event.target
        if (!$container.contains($target) && !$payBtn.contains($target) && !$getQrBtn.contains($target)) {
            closeBanks()
        }
    })

    $overlay.addEventListener('click', (event) => {
        const $target = event.target
        if ($target === $overlay) {
            closeBanks()
        }

        if ($target.dataset.bank) {
            $(document).trigger('change-sbp-bank', $target.dataset.bank)
            $pickBankbtn.style.backgroundImage = "url('/static/common/img/banks/" + $target.dataset.bank + ".svg')";
            $pickBankbtn.textContent = $target.textContent
            if ($pickBankbtn.classList.contains('_placeholder')) {
                $pickBankbtn.classList.remove('_placeholder')
            }
            closeBanks()
        }
    })

    $pickBankbtn.addEventListener('click', banksToggle)

    function openBanks() {
        $overlay.classList.add('open')
        $pickBankbtn.classList.add('active')
        if (!isDesktop()) {
            document.body.classList.add('_disabled-scroll')
        }
    }

    function closeBanks() {
        $overlay.classList.remove('open')
        $pickBankbtn.classList.remove('active')
        if (!isDesktop()) {
            document.body.classList.remove('_disabled-scroll')
        }
    }

    function banksToggle() {
        $overlay.classList.contains('open') ? closeBanks() : openBanks()
    }


    async function getBanksData() {
        const response = await fetch('/static/common/json/c2bmembers.json').then(res => res.json())
        if (response) {
            banksData = response
            getAllBanks(banksData.dictionary)
        }
    }

    const getBankButtonTempplate = (bank) => {
        return `
            <li data-bank="${bank.schema}"
            class="bank__item"
            style="background-image: url('${bank.logoURL}')"
            >${bank.bankName}</li>
        `
    }

    const getAllBanks = (banks) => {
        const banksItems = banks.map(getBankButtonTempplate).join('')
        $banksContainer.insertAdjacentHTML('afterbegin', banksItems)

    }


    $search.addEventListener('input', (event) => {
        $banksContainer.innerHTML = ''        
        const searchStr = event.target.value.toLowerCase()
        const banks = banksData.dictionary.filter(bank => {
            return bank.bankName.toLowerCase().indexOf(searchStr) !== -1
        })
        if (banks.length) {
            $content.classList.remove('empty')
            $noResults.classList.remove('show')
            banks.length <= 3 ? $banksContainer.style.justifyContent='start' : $banksContainer.style.justifyContent='center';            
            getAllBanks(banks);
        } else {
            $content.classList.add('empty')
            $noResults.classList.add('show')
        }
    })

    $search.addEventListener('keydown', (event) => {
        if (event.keyCode === 13) event.preventDefault()
    })

    return banksToggle
}

$(document).ready(initSbp)
