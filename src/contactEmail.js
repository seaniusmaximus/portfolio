/**
 * Email is not stored as one contiguous literal to reduce trivial harvesting.
 * (Does not stop a determined attacker or a browser that runs your JS.)
 */
const _0 = ['c2Vh', 'bkBz', 'ZWFu', 'b2Nv', 'bm5v', 'ci5p', 'bmZv']

export function getContactEmail() {
    if (typeof atob !== 'function') return ''
    try {
        return atob(_0.join(''))
    } catch {
        return ''
    }
}
