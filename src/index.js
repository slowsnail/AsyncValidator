import { polyfill } from 'es6-promise'
polyfill()

import FormValidator from './FormValidator'
import * as v from './FieldValidator'

let validFunc = {
    
    /***
     * 值:
     * 1 无错误 
     * -1 长度错误
     * -2 验证错误 
     */
    ID : function( num ) {

        num = num.toUpperCase();  
        
        //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X。   
        if (!(/(^\d{15}$)|(^\d{17}(\d|X)$)/.test(num))) { 
            return -1; 
        }
        
        //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
        //下面分别分析出生日期和校验位 
        
        var len, re; 
        len = num.length; 
        if (len == 15) {
            
            re = new RegExp(/^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/); 
            var arrSplit = num.match(re); 

            //检查生日日期是否正确 
            var dtmBirth = new Date('19' + arrSplit[2] + '/' + arrSplit[3] + '/' + arrSplit[4]); 
            var bGoodDay = (dtmBirth.getYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4])); 
            
            if (!bGoodDay) { 
                return -2; 
            } else {                
                return 1;
            }   
        }
        
        if (len == 18) {
            
            re = new RegExp(/^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})(\d|X)$/); 
            var arrSplit = num.match(re); 

            //检查生日日期是否正确 
            var dtmBirth = new Date(arrSplit[2] + "/" + arrSplit[3] + "/" + arrSplit[4]); 
            var bGoodDay = (dtmBirth.getFullYear() == Number(arrSplit[2])) && ((dtmBirth.getMonth() + 1) == Number(arrSplit[3])) && (dtmBirth.getDate() == Number(arrSplit[4])); 

            if (!bGoodDay) { 
                return -2; 
            } else { 
                //检验18位身份证的校验码是否正确。 
                //校验位按照ISO 7064:1983.MOD 11-2的规定生成，X可以认为是数字10。 
                var valnum; 
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); 
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'); 
                var nTemp = 0, i; 
                for(i = 0; i < 17; i ++) { 
                    nTemp += num.substr(i, 1) * arrInt[i]; 
                } 
                
                valnum = arrCh[nTemp % 11];
                
                if (valnum != num.substr(17, 1)) { 
                    return -2; 
                } 
                
                return 1; 
            } 
        }
        
        return -2; 
        
    }
    
}

v.addPattern('required', {
    message: '该项不能为空',
    validate: function(value, resolve) {
        resolve( value !== '' )
    }
})
.addPattern('non-required', {
    message: '允许为空',
    validate: function(value, resolve) {
        resolve( value === '' )
    }
})
.addPattern('numeric', {
    message: '必须为数字',
    validate: function(value, resolve) {
        resolve( (/^\d+$/).test(value) )
    }
})
.addPattern('alpha', {
    message: '必须为字母',
    validate: function(value, resolve) {
        resolve( (/^[a-z]+$/i).test(value) )
    }
})
.addPattern('alpha_numeric', {
    message: '必须为字母或数字',
    validate: function(value, resolve) {
        resolve( (/^[a-z0-9]+$/i).test(value) )
    }
})
.addPattern('idcard', {
    message: '身份证格式错误',
    validate: function(value, resolve) {
        resolve( validFunc.ID(value) === 1 )
    }
})
.addPattern('email', {
    message: '邮件地址错误',
    validate: function(value, resolve) {
        let emailReg = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        resoleve( emailReg.test(value) )
    }
})
.addPattern('min_length', {
    argument: true,
    message: '最少输入%argu个字',
    validate: function(value, resolve) {
        let len = parseInt(this.rule.split(':')[1], 10)
        resolve( value.length >= len)
    }
})
.addPattern('max_length', {
    argument: true,
    message: '最多输入%argu个字',
    validate: function(value, resolve) {
        let len = parseInt(this.rule.split(':')[1], 10)
        resolve( value.length <= len )
    }
})

export default class AsyncValidator {
    constructor(formSelector, fields, options) {
        this.form = new FormValidator(formSelector, fields, options)
        this.addPattern = v.addPattern
    }

    validate() {
       return this.form.validate().then( (ret) => ret ).catch((err) => err )
    }
}