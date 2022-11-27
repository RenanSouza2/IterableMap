const chai = require("chai");
const { PANIC_CODES } = require("@nomicfoundation/hardhat-chai-matchers/panic");

const { expect } = chai;

describe('Test ItMap library', async function () {
    let ItMap;
    let itMap;

    before(async function () {
        ItMap = await ethers.getContractFactory('LibItMapDemo');
    })

    beforeEach(async function () {
        itMap = await ItMap.deploy();
    })
    
    describe('Tests before', async function () {
        it('Array length', async function () {
            const length = await itMap.getLength();
            expect(length).to.equal(0);
        });
    });

    describe('Function', async function () {
        let add1, add2, add3, add4;

        before(async function () {
            [ add1, add2, add3, add4 ] = 
                (await ethers.getSigners())
                .map(signer => signer.address);
        });

        describe('insert', async function () {
            it('should insert first address', async function () {
                await itMap.insert(add1);

                const isIncluded = await itMap.isIncluded(add1);
                expect(isIncluded).to.equal(true);

                const index = await itMap.getMap(add1);
                expect(index).to.equal(1);

                const length = await itMap.getLength();
                expect(length).to.equal(1);

                const item = await itMap.getArray(0);
                expect(item).to.equal(add1);
            });

            it('should insert second address', async function () {
                await itMap.insert(add1);
                await itMap.insert(add2);

                const isIncluded = await itMap.isIncluded(add2);
                expect(isIncluded).to.equal(true);

                const index = await itMap.getMap(add2);
                expect(index).to.equal(2);

                const length = await itMap.getLength();
                expect(length).to.equal(2);

                const item = await itMap.getArray(1);
                expect(item).to.equal(add2);
            });

            it('should not insert repeaded address', async function () {
                await itMap.insert(add1);
                const tx = itMap.insert(add1);
                await expect(tx).to.revertedWith("Address already inserted");
            });
        });

        describe('remove', async function () {
            beforeEach(async function () {
                await itMap.insert(add1);
                await itMap.insert(add2);
                await itMap.insert(add3);
            });

            it('should remove first item', async function () {
                await itMap.remove(add1);

                const isIncluded = await itMap.isIncluded(add1);
                expect(isIncluded).to.equal(false);

                const index = await itMap.getMap(add1);
                expect(index).to.equal(0);

                const length = await itMap.getLength();
                expect(length).to.equal(2);

                const item = await itMap.getArray(0);
                expect(item).to.not.equal(add1);

                const index3 = await itMap.getMap(add3);
                expect(index3).to.equal(1);

                const item3 = await itMap.getArray(0);
                expect(item3).to.equal(add3);
            });

            it('should remove item in the middle', async function () {
                await itMap.remove(add2);

                const isIncluded = await itMap.isIncluded(add2);
                expect(isIncluded).to.equal(false);

                const index = await itMap.getMap(add2);
                expect(index).to.equal(0);

                const length = await itMap.getLength();
                expect(length).to.equal(2);

                const item = await itMap.getArray(1);
                expect(item).to.not.equal(add2);

                const index3 = await itMap.getMap(add3);
                expect(index3).to.equal(2);

                const item3 = await itMap.getArray(1);
                expect(item3).to.equal(add3);
            });

            it('should remove last item', async function () {
                await itMap.remove(add3);

                const isIncluded = await itMap.isIncluded(add3);
                expect(isIncluded).to.equal(false);

                const index = await itMap.getMap(add3);
                expect(index).to.equal(0);

                const length = await itMap.getLength();
                expect(length).to.equal(2);

                const tx = itMap.getArray(2);
                await expect(tx).to.revertedWithPanic(
                    PANIC_CODES.ARRAY_ACCESS_OUT_OF_BOUNDS
                );
            });

            it('should remove all items', async function () {
                await itMap.remove(add1);
                await itMap.remove(add2);
                await itMap.remove(add3);

                const length = await itMap.getLength();
                expect(length).to.equal(0);
            });

            it('should not remove item not included', async function () {
                const tx = itMap.remove(add4);
                await expect(tx).to.revertedWith('Address not inserted');
            });
        })
    });
});

