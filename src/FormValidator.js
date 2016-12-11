import FieldValidator from './FieldValidator'

function EmptyFunc() {}

export default class FormValidator {
    constructor(formSelector, fields, options) {
        this.formElement = document.querySelector(formSelector)
        this.fields = fields
        this.validateType = (options && options.validateType) || 'all'
        this.commonHandler = (options && options.commonHandler) || EmptyFunc

        if(!this.formElement) throw 'FormValidator - no formElement'

        this.promiseList = []

        this.createPromiseList()
    }

    createPromiseList() {
        for (let i = 0; i < this.fields.length; i++) {
            let field = this.fields[i]
            let subElement = this.formElement.querySelector(field.selector)
            if(subElement) {
                let fieldValidator = new FieldValidator( this.formElement, field, this.commonHandler )
                this.promiseList.push(
                    fieldValidator.validate()
                )
            }
        }
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
            status: false
        }

        return Promise.all(this.promiseList).then(function(retList) {
            console.log(retList)

            // ret.status = retList.every((ret) => ret.status)
            // ret.data = retList

            // console.log('form-ret: ', ret)
            // return ret

            return retList
        })
    }

    _validateOne() {

    }
}