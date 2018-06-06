const Color_V1 = artifacts.require('Color_V1')
const Color_V2 = artifacts.require('Color_V2')
const Proxy = artifacts.require('UpgradeableProxy')

contract('Upgradeablity', function (accounts) {
    let sender = accounts[0]
    var proxy = null;
    var color = null;

    beforeEach(async () => {
        const color_v1 = await Color_V1.new()
        proxy = await Proxy.new()
        await proxy.updateImplementation(color_v1.address)
        color = Color_V1.at(proxy.address)
        console.log("# Contracts");
        console.log("-- Proxy Address: "+proxy.address);
        console.log("-- Version1 Address: "+color_v1.address);
    });

    it('First version', async () => {
        await color.setMyColor(1, 10, 100)
        const rgb = await color.getColor(sender)
        console.log("Color: R%d, G%d, B%d", rgb[0].toNumber(), rgb[1].toNumber(), rgb[2].toNumber())

        assert.equal(rgb[0].toNumber(), 1)
        assert.equal(rgb[1].toNumber(), 10)
        assert.equal(rgb[2].toNumber(), 100)
    })

    it('Upgrade', async () => {
        const color_v2 = await Color_V2.new()
        await proxy.updateImplementation(color_v2.address)
        color = Color_V2.at(proxy.address)
        console.log("-- Version2 Address: "+color_v2.address);

        await color.setMyColor(1, 10, 100)
        const rgb = await color.getColor(sender)
        console.log("Color: R%d, G%d, B%d", rgb[0].toNumber(), rgb[1].toNumber(), rgb[2].toNumber())

        assert.equal(rgb[0].toNumber(), 1)
        assert.equal(rgb[1].toNumber(), 10)
        assert.equal(rgb[2].toNumber(), 100)
    })

})
