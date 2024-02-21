const bip32 = require('bip32')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const fs = require('fs')
const pathF = require('path');

//bitcoin - rede principal - mainnet
//testnet - rede de teste - tesnet
const network = bitcoin.networks.testnet

//derivação de carteiras HD
const path = `m/49'/1'/0'/0` 

//criando o mnemonic para a seed
let mnemonic = bip39.generateMnemonic()
const seed = bip39.mnemonicToSeedSync(mnemonic)

//criando a raiz da cartiera HD
let root = bip32.fromSeed(seed, network)

//criando uma conta - par pvt-pub keys
let account = root.derivePath(path)
let node = account.derive(0).derive(0)

let btcAddress = bitcoin.payments.p2pkh({
    pubkey: node.publicKey,
    network: network,
}).address

console.log("Carteira gerada")
console.log("Endereço: ", btcAddress)
console.log("Chave privada:", node.toWIF())
console.log("Seed:", mnemonic)

// Save the address, private key and seed in a file
let data = {
    "Wallet": "Bitcoin",
    "Network": "Testnet",
    "Address": btcAddress,
    "Private Key": node.toWIF(),
    "Seed": mnemonic
}

const folderPath = pathF.join(__dirname, '..', 'data')

if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true })
}

const filePath = pathF.join(folderPath, 'wallet.json')

try {    
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
    console.log('The file has been saved!')
} catch (err) {
    console.log('Error writing file: ', err)
}