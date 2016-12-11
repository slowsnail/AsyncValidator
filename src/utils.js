let utils = {}

utils.extend = function (target, source) {
    for (let p in source) {
        if (source.hasOwnProperty(p)) {
            target[p] = source[p]
        }
    }

    return target
}

/**
 * promie.then().then() 连续调用
 * 一个验证对象有多个验证规则时，某个规则不通过时，后面规则不再执行
 * 最后一个 then 返回验证过的规则的结果，包括验证通过和不通过的结果
 */
utils.promiseSeq = function(promiseCreatorList) {
    let ret = []
    let promise = Promise.resovle()
    promiseCreatorList.forEach(function(promiseCreator) {
        promise = promise.then(function(data) {
            
        })
    })


}

export default utils