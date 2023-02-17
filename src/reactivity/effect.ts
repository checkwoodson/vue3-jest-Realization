// 响应式依赖副作用
let activeEffect
class ReactiveEffect {
    private _fn
    deps = []
    constructor(fn, public scheduler?) {
        this._fn = fn
    }
    run() {
        activeEffect = this
        return this._fn()
    }
    // 停止依赖收集
    stop() {
        this.deps.forEach(dep => {
            dep.delete(this)
        })
    }
}

export function effect(fn, options: any = {}) {
    const _effect = new ReactiveEffect(fn, options.scheduler)
    _effect.run()
    const runner: any = _effect.run.bind(_effect)
    runner.effect = _effect
    // 当前调用的_effect指向ReactiveEffect实例
    return runner
}
// 追踪 weakMap=>{target:{key:effect}}
/*************************捕获↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓********************* */
let targetMap = new WeakMap()
export function track(target, key) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        targetMap.set(target, (depsMap = new Map()))
    }
    let dep = depsMap.get(key)
    if (!dep) {
        depsMap.set(key, (dep = new Set()))
    }
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
}
/**↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ 调用↓↓↓↓↓↓↓↓↓↓↓↓↓↓v */
export function trigger(target, key) {
    let depsMap = targetMap.get(target) //获取目标对象
    let dep = depsMap.get(key) //取值
    // 这里挂的调度器来同步拦截的数据的改变。
    dep.forEach(effect => {
        effect.scheduler ? effect.scheduler() : effect.run()
    })
}
// 停止依赖的方法
export function stop(fn) {
    return fn.effect.stop()
}