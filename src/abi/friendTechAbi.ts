import * as ethers from 'ethers'
import {LogEvent, Func, ContractBase} from './abi.support'
import {ABI_JSON} from './friendTechAbi.abi'

export const abi = new ethers.Interface(ABI_JSON);

export const events = {
    OwnershipTransferred: new LogEvent<([previousOwner: string, newOwner: string] & {previousOwner: string, newOwner: string})>(
        abi, '0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0'
    ),
    Trade: new LogEvent<([trader: string, subject: string, isBuy: boolean, shareAmount: bigint, ethAmount: bigint, protocolEthAmount: bigint, subjectEthAmount: bigint, supply: bigint] & {trader: string, subject: string, isBuy: boolean, shareAmount: bigint, ethAmount: bigint, protocolEthAmount: bigint, subjectEthAmount: bigint, supply: bigint})>(
        abi, '0x2c76e7a47fd53e2854856ac3f0a5f3ee40d15cfaa82266357ea9779c486ab9c3'
    ),
}

export const functions = {
    buyShares: new Func<[sharesSubject: string, amount: bigint], {sharesSubject: string, amount: bigint}, []>(
        abi, '0x6945b123'
    ),
    getBuyPrice: new Func<[sharesSubject: string, amount: bigint], {sharesSubject: string, amount: bigint}, bigint>(
        abi, '0x4635256e'
    ),
    getBuyPriceAfterFee: new Func<[sharesSubject: string, amount: bigint], {sharesSubject: string, amount: bigint}, bigint>(
        abi, '0x0f026f6d'
    ),
    getPrice: new Func<[supply: bigint, amount: bigint], {supply: bigint, amount: bigint}, bigint>(
        abi, '0x5cf4ee91'
    ),
    getSellPrice: new Func<[sharesSubject: string, amount: bigint], {sharesSubject: string, amount: bigint}, bigint>(
        abi, '0x9ae71781'
    ),
    getSellPriceAfterFee: new Func<[sharesSubject: string, amount: bigint], {sharesSubject: string, amount: bigint}, bigint>(
        abi, '0x2267a89c'
    ),
    owner: new Func<[], {}, string>(
        abi, '0x8da5cb5b'
    ),
    protocolFeeDestination: new Func<[], {}, string>(
        abi, '0x4ce7957c'
    ),
    protocolFeePercent: new Func<[], {}, bigint>(
        abi, '0xd6e6eb9f'
    ),
    renounceOwnership: new Func<[], {}, []>(
        abi, '0x715018a6'
    ),
    sellShares: new Func<[sharesSubject: string, amount: bigint], {sharesSubject: string, amount: bigint}, []>(
        abi, '0xb51d0534'
    ),
    setFeeDestination: new Func<[_feeDestination: string], {_feeDestination: string}, []>(
        abi, '0xfbe53234'
    ),
    setProtocolFeePercent: new Func<[_feePercent: bigint], {_feePercent: bigint}, []>(
        abi, '0xa4983421'
    ),
    setSubjectFeePercent: new Func<[_feePercent: bigint], {_feePercent: bigint}, []>(
        abi, '0x5a8a764e'
    ),
    sharesBalance: new Func<[_: string, _: string], {}, bigint>(
        abi, '0x020235ff'
    ),
    sharesSupply: new Func<[_: string], {}, bigint>(
        abi, '0xf9931be0'
    ),
    subjectFeePercent: new Func<[], {}, bigint>(
        abi, '0x24dc441d'
    ),
    transferOwnership: new Func<[newOwner: string], {newOwner: string}, []>(
        abi, '0xf2fde38b'
    ),
}

export class Contract extends ContractBase {

    getBuyPrice(sharesSubject: string, amount: bigint): Promise<bigint> {
        return this.eth_call(functions.getBuyPrice, [sharesSubject, amount])
    }

    getBuyPriceAfterFee(sharesSubject: string, amount: bigint): Promise<bigint> {
        return this.eth_call(functions.getBuyPriceAfterFee, [sharesSubject, amount])
    }

    getPrice(supply: bigint, amount: bigint): Promise<bigint> {
        return this.eth_call(functions.getPrice, [supply, amount])
    }

    getSellPrice(sharesSubject: string, amount: bigint): Promise<bigint> {
        return this.eth_call(functions.getSellPrice, [sharesSubject, amount])
    }

    getSellPriceAfterFee(sharesSubject: string, amount: bigint): Promise<bigint> {
        return this.eth_call(functions.getSellPriceAfterFee, [sharesSubject, amount])
    }

    owner(): Promise<string> {
        return this.eth_call(functions.owner, [])
    }

    protocolFeeDestination(): Promise<string> {
        return this.eth_call(functions.protocolFeeDestination, [])
    }

    protocolFeePercent(): Promise<bigint> {
        return this.eth_call(functions.protocolFeePercent, [])
    }

    sharesBalance(arg0: string, arg1: string): Promise<bigint> {
        return this.eth_call(functions.sharesBalance, [arg0, arg1])
    }

    sharesSupply(arg0: string): Promise<bigint> {
        return this.eth_call(functions.sharesSupply, [arg0])
    }

    subjectFeePercent(): Promise<bigint> {
        return this.eth_call(functions.subjectFeePercent, [])
    }
}
