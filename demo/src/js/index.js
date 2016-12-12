import AsyncValidator from '../../../src/index'

var validator = new AsyncValidator('.js-async-form', [{
    selector: '.js-username',
    rules: ['required','max_length:2', 'min_length:1'],
    events: ['blur', 'keyup'],
    handler: function(result) {
        if(!result.status) {
            result.element.style.backgroundColor = 'red'
        } else {
            result.element.style.backgroundColor = 'green'
        }
    }
}, {
    selector: '.js-idcard',
    rules: ['idcard'],
    events: ['blur', 'keyup']
}, {
    selector: '.js-period',
    rules: ['min_length:2', 'max_length:5'],
    events: ['keyup']
}], {
    validateType: 'all',
    commonHandler: function(result) {
        // 通用验证结果处理函数
        if(!result.status) {
            result.element.style.backgroundColor = 'red'
        } else {
            result.element.style.backgroundColor = 'green'
        }
    }
})

validator.validate().then(function(ret) {
    console.log('asyncValidator-ret: ', ret)
})