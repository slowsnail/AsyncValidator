import FieldValidator from './FieldValidator'
import utils from './utils'

function EmptyFunc() {}

export default class FormValidator {
    constructor(formSelector, fields, options) {
        this.formElement = document.querySelector(formSelector)
        this.fields = fields
        this.validateType = (options && options.validateType) || 'one'
        this.commonHandler = (options && options.commonHandler) || EmptyFunc

        if(!this.formElement) throw 'FormValidator - no formElement'
    }

    createFieldList() {
        let promiseList = []
        for (let i = 0; i < this.fields.length; i++) {
            let field = this.fields[i]
            let fieldElement = this.formElement.querySelector(field.selector)
            if(fieldElement) {
                let fieldValidator = new FieldValidator( this.formElement, field, this.commonHandler )
                promiseList.push( fieldValidator )
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
        // 验证结果，status 初始值为 false，表示未验证通过
        let ret = {
            element: this.formElement,
            status: false,
        }
        let fieldList = this.createFieldList()
        let promiseList = []
        for(let i = 0; i < fieldList.length; i++) {
            promiseList.push(fieldList[i].validate())
        }

        return Promise.all(promiseList).then(function(retList) {
            ret.status = retList.every((ret) => ret.status)
            ret.data = retList

            return ret
        })
    }

    _validateOne() {
        let fieldList = this.createFieldList()
        let promiseCreatorList = this.promiseCreatorList(fieldList)

        return utils.promiseSeq(promiseCreatorList)
    }

    promiseCreatorList(fieldList) {
        // 验证结果，status 初始值为 false，表示未验证通过
        let ret = {
            element: this.formElement,
            status: false,
            data: []
        }

        let creators = []

        for(let i = 0; i < fieldList.length; i++) {
            creators.push(
                (data) => {
                    // 忽略 promiseSeq 初始值 { status: true }
                    if(data.element && data.element != this.formElement) {
                        ret.data.push(data)
                    }
                    if(!data.status) {
                        return new Promise((resolve) => resolve(ret) )
                    } else {
                        return fieldList[i].validate().then((data) => {
                            if(i === fieldList.length - 1) {
                                
                                ret.data.push(data)
                                ret.status = ret.data.every( (item) => item.status )

                                return ret
                            } else {
                                return data
                            }
                        })
                    }
                }                    
            )
        }

        return creators
    }
}