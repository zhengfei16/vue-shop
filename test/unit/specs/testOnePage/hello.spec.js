import {max,min} from '@/testOnePage/components/hello'

describe('hello.js', () => {
	it('1和2中的最大值应该是2', () => {
		expect(max(1,2)).to.equal(2)
	})

	it('1和2中的最小值应该是1', () => {
		expect(min(1,2)).to.equal(1)
	})
})
