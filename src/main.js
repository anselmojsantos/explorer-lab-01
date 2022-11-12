import "./css/index.css";
import IMask from 'imask';

const ccBgColor01 = document.querySelector('.cc-bg svg > g g:nth-child(1) path');
const ccBgColor02 = document.querySelector('.cc-bg svg > g g:nth-child(2) path');
const ccBgCard = document.querySelector('.cc');
const ccLogo = document.querySelector('.cc-logo span:nth-child(2) img');

function setCardtype(cardType){
    const colors = {
        visa:['#436D99','#2D57F2'],
        mastercard:['#DF6F29','#C69347'],
        default:['black','gray']
    }

    const card = {
        visa:'visa',
        mastercard:'mastercard'
    }

    ccBgColor01.setAttribute('fill',colors[cardType][0])
    ccBgColor02.setAttribute('fill',colors[cardType][1])
    ccLogo.setAttribute("src", `cc-${cardType}.svg`);
   
   if(cardType == card.visa){
    ccBgCard.classList.add('cc-visa');
   }else 
   
    if(cardType == card.mastercard){
        ccBgCard.classList.remove('cc-visa');
   }else{
        ccBgCard.classList.remove('cc-visa');
   }
}

const securityCode = document.querySelector('#security-code');
const securityCodePattern = {
    mask: "0000"
}
const securityCodeMasked = IMask(securityCode, securityCodePattern);

securityCodeMasked.on('accept', ()=>{
    updatesecurityCode(securityCodeMasked.value)
});

function updatesecurityCode(code){
    const ccSecurity = document.querySelector('.cc-security .value');

    ccSecurity.innerText = code.length === 0 ? "123" : code;
}

const expirationDate = document.querySelector('#expiration-date');
const  expirationDatePattern = {
    mask: "MM{/}YY",
    blocks:{
       MM:{
            mask: IMask.MaskedRange,
            from: 1,
            to: 12
       },
       YY:{
        mask: IMask.MaskedRange,
        from: String(new Date().getFullYear()).slice(2),
        to: String( new Date().getFullYear() + 10).slice(2)
       }
    }
}
const expirationDateMask = IMask(expirationDate, expirationDatePattern);

expirationDateMask.on('accept', ()=>{
    updateDateMask(expirationDateMask.value)
});

function updateDateMask (exDate){
    const ccDate = document.querySelector('.cc-extra .value');
    ccDate.innerText = exDate.length === 0 ? "02/32" : exDate;
}

const cardNumber = document.querySelector('#card-number');
const cardNumberPattern = {
    mask :[
        {
            mask: '0000 0000 0000 0000',
            regex: /^4\d{0,15}/,
            type: 'visa',
        },
        {
            mask: '0000 0000 0000 0000',
            regex: /(^5[1-5]\d{0,2}|^22[2-9]\d|2[3-7]\d{0,2})\d{0,12}/,
            type: 'mastercard',
        },
        {
            mask: '0000 0000 0000 0000',
            type: 'default',
        },
    ],
    dispatch: function (appended, dynamicMasked){
        const number = (dynamicMasked.value + appended).replace(/\D/g, '');
        const foundMask = dynamicMasked.compiledMasks.find(function(item){
            return number.match(item.regex);
        });
        return foundMask;
    },
}
const cardNumberMask = IMask(cardNumber, cardNumberPattern);

cardNumberMask.on('accept', () =>{
    const cardType = cardNumberMask.masked.currentMask.type;
    setCardtype(cardType); 
    updadteCardNumber(cardNumberMask.value)
});

function updadteCardNumber(number){
    const ccNumber = document.querySelector('.cc-number');
    ccNumber.innerText = number.length === 0 ? "1234 5678 9012 3456" : number;

}

const cardHolder = document.querySelector('#card-holder');
cardHolder.addEventListener('input',() => {
    const ccholder = document.querySelector('.cc-holder .value')

    ccholder.innerText = cardHolder.value.length === 0 ? "Fulano da Silva" : cardHolder.value
});

const fields = document.querySelectorAll('[required]');

function customValidation(event){
    const field = event.target;

    function verifyErrors(){
        let foundError = false;

        for( let error in field.validity){
            if (error != 'customError' && field.validity[error]){
                foundError = true;
            }
        }
        return foundError
    }

    const error = verifyErrors();

    if(error){
        field.setCustomValidity('Campo obrigatório!')
    }else{
        field.setCustomValidity('')
    }
    
}

for(let field of fields){
    field.addEventListener('invalid', customValidation)
}


document.querySelector('form').addEventListener('submit', (event)=>{
    event.preventDefault();
    ccModal();
    cardNumber.value = "";
    cardHolder.value = "";
    expirationDate.value = "";
    securityCode.value = "";

})

function ccModal(){
    const  cModal = document.querySelector('#cc-modal');
    const  ctModal = document.querySelector('#cc-ct-modal');

    cModal.classList.toggle('modal');
    ctModal.classList.toggle('ct-modal');

    const classModalRemove = document.querySelector('.modal');
    const ctModalRemove = document.querySelector('.ct-modal');
    ctModalRemove.innerText = `Cartão cadastrado com sucesso!.\n Aproveite todos os benefícios.\n Click em qualquer parte da tela para sair.`
    
    cModal.addEventListener('click', ()=>{
        ctModalRemove.innerText=''
        classModalRemove.classList.remove('modal');
        ctModalRemove.classList.remove('ct-modal')
    });
}


