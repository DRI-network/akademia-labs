const Color_V1 = artifacts.require('Color_V1')
const Color_V2 = artifacts.require('Color_V2')
const Proxy = artifacts.require('UpgradeableProxy')

contract('Upgradeable', function (accounts) {
    it('should work', async function () {
        const color_v1 = await Color_V1.new()
        const color_v2 = await Color_V2.new()
        const proxy = await Proxy.new()

        await proxy.updateImplementation(color_v1.address)

        await Color_V1.at(proxy.address).setColor(1, 10, 100)
        
        const red = await Color_V1.at(proxy.address).getR()
        console.log("red: ", red.toNumber())

        assert.equal(red.toNumber(), 1)
    })

})
