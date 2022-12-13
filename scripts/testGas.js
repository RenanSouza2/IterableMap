const hre = require("hardhat");

const { ethers } = hre;
const { provider } = ethers;

const adds = [
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
    '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    '0x90F79bf6EB2c4f870365E785982E1f101E93b906',
    '0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65',
    '0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc',
    '0x976EA74026E726554dB657fA54763abd0C3a0aa9',
    '0x14dC79964da2C08b23698B3D3cc7Ca32193d9955',
    '0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f',
    '0xa0Ee7A142d267C1f36714E4a8F75612F20a79720',
    '0xBcd4042DE499D14e55001CcbB24a551F3b954096',
    '0x71bE63f3384f5fb98995898A86B02Fb2426c5788',
    '0xFABB0ac9d68B0B445fB7357272Ff202C5651694a',
    '0x1CBd3b2770909D4e10f157cABC84C7264073C9Ec',
    '0xdF3e18d64BC6A983f673Ab319CCaE4f1a57C7097',
    '0xcd3B766CCDd6AE721141F452C550Ca635964ce71',
    '0x2546BcD3c84621e976D8185a91A922aE77ECEc30',
    '0xbDA5747bFD65F08deb54cb465eB87D40e51B197E',
    '0xdD2FD4581271e230360230F9337D5c0430Bf44C0',
    '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199'
];
async function getTxGas({ hash }) {
    const receipt = await provider.getTransactionReceipt(hash);
    return receipt.gasUsed.toNumber() - 21000;
}

async function insertProposal() {
    const ItMap = await ethers.getContractFactory("LibItMapDemo");

    console.log('Proposal inclusion gas');
    const itMap = await ItMap.deploy();
    await itMap.deployed();
    for(let i=0; i<adds.length; i++) {
        const tx = await itMap.insert(adds[i]);
        await tx.wait();

        const gas = await getTxGas(tx);
        console.log(i, gas);
    }
}

async function insertGnosis() {
    const Gnosis = await ethers.getContractFactory("ModuleManager");

    console.log();
    console.log('Gnosis inclusion gas');
    const gnosis = await Gnosis.deploy();
    await gnosis.deployed();

    for(let i=0; i<adds.length; i++) {
        const tx = await gnosis.enableModule(adds[i]);
        await tx.wait();
        
        const gas = await getTxGas(tx);
        console.log(i,gas);
    }
}

async function removalProposal() {
    const ItMap = await ethers.getContractFactory("LibItMapDemo");

    console.log();
    console.log('Proposal removal gas');
    for(let i=0; i<2; i++) {
        const itMap = await ItMap.deploy();
        for(let j=0; j<2; j++) {
            const tx = await itMap.insert(adds[j]);
            await tx.wait();
        }

        const tx = await itMap.remove(adds[i]);
        await tx.wait();

        const gas = await getTxGas(tx);
        console.log(gas);
    }
}

async function removalGnosis() {
    const Gnosis = await ethers.getContractFactory("ModuleManager");

    console.log();
    console.log('Gnosis removal gas');
    const gnosis = await Gnosis.deploy();
    await gnosis.deployed();

    const tx1 = await gnosis.enableModule(adds[0]);
    await tx1.wait();

    const add1 = '0x0000000000000000000000000000000000000001';
    const tx2 = await gnosis.disableModule(add1, adds[0]);
    await tx2.wait();

    const gas = await getTxGas(tx2);
    console.log(gas);
}

async function paginationProposal() {
    const ItMap = await ethers.getContractFactory("LibItMapDemo");
    const [ signer ] = await ethers.getSigners();

    console.log();
    console.log('Proposal pagination gas');
    const itMap = await ItMap.deploy();
    await itMap.deployed();
    
    for(let i=0; i<adds.length; i++) {
        const tx = await itMap.insert(adds[i]);
        await tx.wait();
    }

    const txData = await itMap.populateTransaction.getAll();
    const tx = await signer.sendTransaction(txData);
    await tx.wait();

    const gas = await getTxGas(tx);
    console.log(gas);
}

async function gnosisProposal() {
    const Gnosis = await ethers.getContractFactory("ModuleManager");
    const add1 = '0x0000000000000000000000000000000000000001';
    const [ signer ] = await ethers.getSigners();

    console.log();
    console.log('Gnosis pagination gas');
    const gnosis = await Gnosis.deploy();
    await gnosis.deployed();

    for(let i=0; i<adds.length; i++) {
        const tx = await gnosis.enableModule(adds[i]);
        await tx.wait();
    }

    const txData = await gnosis.populateTransaction.getModulesPaginated(
        add1, adds.length
    );
    const tx = await signer.sendTransaction(txData);
    await tx.wait();

    const gas = await getTxGas(tx);
    console.log(gas);
}

async function main() {
    await insertProposal();
    await insertGnosis();
    await removalProposal();
    await removalGnosis();
    await paginationProposal();
    await gnosisProposal();
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
