# AsyncValidator
表单验证器

    new AsyncValidator('.js-async-form', [{
        selector: '.js-username',
        rules: ['required','min_length:2'],
        events: ['blur', 'keyup'],
        validateType: 'all', // one
        handler: function(result) {
            // 验证结果处理函数，优先级高于 commonHandler
            result = {
                element: ''
                status: true,
                data: [{
                    status: true,
                    rule: 'required',
                    message: ''
                }, {
                    status: false,
                    rule: 'min_length',
                    message: '最少输入2个字'
                }]
            }
        }
    }, {
        selector: '.js-idcard',
        rules: ['idcard'],
        
    }], {
        validateType: 'all', // one
        commonHandler: function(result) {
            // 通用验证结果处理函数，和每个验证对象的 handler 处理逻辑一致

            result = {
                element: ''
                status: true,
                data: [{
                    status: true,
                    rule: 'required',
                    message: ''
                }, {
                    status: false,
                    rule: 'min_length',
                    message: '最少输入2个字'
                }]
            }

        }
    })