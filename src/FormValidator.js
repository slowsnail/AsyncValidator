import FieldValidator from './FieldValidator'

function EmptyFunc() {}

export default class FormValidator {
    constructor(formSelector, fields, options) {
        this.formElement = document.querySelector(formSelector)
        this.fields = fields
        this.validateType = (options && options.validateType) || 'all'
        this.commonHandler = (options && options.commonHandler) || EmptyFunc

        if(!this.formElement) throw 'FormValidator - no formElement'
    }

    createPromiseList() {
        let promiseList = []
        for (let i = 0; i < this.fields.length; i++) {
            let field = this.fields[i]
            let fieldElement = this.formElement.querySelector(field.selector)
            if(fieldElement) {
                let fieldValidator = new FieldValidator( this.formElement, field, this.commonHandler )
                promiseList.push(
                    fieldValidator.validate()
                )
            }
        }

        return promiseList
    }

    validate() {
        if(this.validateType === 'all') {
            return this._validateAll()
        } else if(this.validateType === 'one') {
            return this._validateOne()
        }
    }

    _validateAll() {
        // 验证结果，status 初始值为 false，标示未验证通过
        let ret = {
            element: this.formElement,
            status: false,
        }
        let promiseList = this.createPromiseList()

        return Promise.all(promiseList).then(function(retList) {
            ret.status = retList.every((ret) => ret.status)
            ret.data = retList

            return ret
        })
    }

    _validateOne() {

    }
}