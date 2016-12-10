let PATTERNS = {
    required: {
        message: '该项不能为空',
        validate: function(value, resolve) {
           resolve( value !== "" )
        }
    }
}

function extend(target, source) {
    for (let p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p]
        }
    }

    return target
}

export function addPattern(name,options) {
    if(!name) throw new Error('add pattern - no name')
    if(!options) throw new Error('add pattern - no options')
    if(!options.message) throw new Error('add paattern - no options.message')
    if(!options.validate) throw new Error('add pattern - no options.validate')

    PATTERNS[name] = extend({
        name: name
    }, options)

    console.log(PATTERNS)
    return this
}

export function FormValidator() {
    
}