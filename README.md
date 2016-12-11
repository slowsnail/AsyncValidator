# AsyncValidator
表单验证器

    new AsyncValidator('.js-async-form', [{
        selector: '.js-username',
        rules: ['required','min_length:2'],
        events: ['blur', 'keyup'],
        validateType: 'all', // one
        handler: function(result) {
            // 验证结果处理函数
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
            // 通用验证结果处理函数

            result = {
                status: true,       // 整个表单是否验证通过
                data: [{           // 每个验证对象的验证结果
                    element: '',
                    status: true,
                    data: [{
                        status: true,
                        rule: 'required',
                        message: ''
                    }]
                }]
            }

        }
    })