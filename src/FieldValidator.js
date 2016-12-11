import utils from './utils'

let PATTERNS = {}

export function addPattern(name, options) {
    if(!name) throw 'add pattern - no name'
    if(!options) throw 'add pattern - no options'
    if(!options.message) throw 'add paattern - no options.message'
    if(!options.validate) throw 'add pattern - no options.validate'

    PATTERNS[name] = utils.extend({
        name: name
    }, options)

    return this
}

function EmptyFunc() {}


export default class FieldValidator {
    constructor(container, field, commonHandler) {
        this.container = container
        this.field = field
        this.commonHandler = commonHandler || EmptyFunc

        if(!this.container) throw 'FieldValidator - no container'
        if(!this.field) throw 'FieldValidator - no field'

        this.selector = field.selector
        this.rules = field.rules || []
        this.events = field.events || []
        this.validateType = field.validateType || 'all'
        this.handler = field.handler || EmptyFunc

        this.element = this.container.querySelector(this.selector)

        this.promiseList = []

        this.createPromiseList()

        this.bindEvents()
    }

    bindEvents() {
        if(this.events.length > 0) {
            for(let i = 0; i < this.events.length; i++) {
                let event = this.events[i]
                this.element.addEventListener(event, () => {
                    // 调用 handler，或者 commonHandler
                    this.validate()
                }, false)
            }
        }
    }

    createPromiseList() {
        if(this.rules.length > 0) {
            for(let i = 0; i < this.rules.length; i++) {
                let rule = this.rules[i]
                this.promiseList.push(
                    this.createPromise(rule)
                )
            }
        }
        
    }

    createPromise(rule) {
        return new Promise((resolve, reject) => {
            let name = rule.split(':')[0]
            let argu = rule.split(':')[1]
            let message = PATTERNS[name] && PATTERNS[name]['message']
            let argument = PATTERNS[name] && PATTERNS[name]['argument']

            if(argument) {
                message = message && message.replace(/%argu/, argu)
            }

            let ret = {
                rule: rule,
                status: false,
                message: message
            }
           
            let validate = PATTERNS[name] && PATTERNS[name]['validate']

            function resolveStatus(status) {
                resolve(utils.extend(ret, {
                    status: status
                }))
            }

            if(typeof validate === 'function') {
                validate.call(ret, this.element.value, resolveStatus)
            } else {
                // 如果 validate 不能存在或者不是函数，验证失败
                resolve(utils.extend(ret, {
                    status: false,
                    message: '无效的验证规则，验证不通过'
                }))
            }
        })
    }

    validate() {
       if(this.validateType === 'all') {
           return this._validateAll()
       } else if(this.validateType === 'one') {
           return this._validateOne()
       }
    }

    _validateAll() {
        let ret = {
            element: this.element,
            value: this.element.value
        }

        return Promise.all(this.promiseList).then((retList) => {
            // retList 为空，返回值为 true，表示验证通过，复合逻辑
            ret.status = retList.every((ret) => ret.status)
            ret.data = retList

            return ret
        })    
    }

    _validateOne() {

    }
}