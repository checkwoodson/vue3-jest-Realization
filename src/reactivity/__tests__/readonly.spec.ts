import { readonly, isReadOnly } from '../reactivity'
describe('readonly', () => {
    it('只读操作，不可修改', () => {
        const original = { foo: 1, bar: { baz: 2 } }
        const wrapped = readonly(original)

        expect(wrapped).not.toBe(original)
        expect(wrapped.foo).toBe(1)
        wrapped.foo = 2
        expect(wrapped.foo).toBe(1)

        expect(isReadOnly(wrapped)).toBe(true)
        expect(isReadOnly(original)).toBe(false)

    })
    it('should call console.warn when set', () =>{
        console.warn = jest.fn()
        const user = readonly({ age :10})
        user.age =11;
        expect(console.warn).toBeCalled()
    })
})