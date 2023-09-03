import {TypeormDatabase} from '@subsquid/typeorm-store'
import {In} from 'typeorm'

import {Trade, Subject, BlockStats, AllTimeStats} from './model'
import {processor, FRIENDTECH_CONTRACT, Block} from './processor'
import * as friendTechAbi from './abi/friendTechAbi'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const trades: Trade[] = []
    const blockStats: BlockStats[] = []
    const allTimeStats: AllTimeStats = await ctx.store.findOneBy(AllTimeStats, {id: '0'}).then(ats => ats ?? getInitialAllTimeStats())

    for (let block of ctx.blocks) {
        let involvedSubjects: Set<string> = new Set()
        let currentBlockStats: BlockStats = getInitialBlockStats(block.header)

        for (let log of block.logs) {
            if (log.address === FRIENDTECH_CONTRACT &&
                log.topics[0] === friendTechAbi.events.Trade.topic) {

                let {
                    trader,
                    subject,
                    isBuy,
                    shareAmount,
                    ethAmount,
                    protocolEthAmount,
                    subjectEthAmount,
                    supply,
                } = friendTechAbi.events.Trade.decode(log)

                trades.push(new Trade({
                    id: log.id,
                    block: block.header.height,
                    trader,
                    subject,
                    isBuy,
                    shareAmount,
                    ethAmount,
                    protocolEthAmount,
                    subjectEthAmount,
                    supply,
                    txnHash: log.transactionHash,
                }))

                involvedSubjects.add(subject)
                currentBlockStats.trades += 1
                currentBlockStats.ethVolume += ethAmount
                currentBlockStats.ethBuyVolume += isBuy ? ethAmount : 0n
                currentBlockStats.ethSellVolume += isBuy ? 0n : ethAmount
                currentBlockStats.shareVolume += shareAmount
                currentBlockStats.shareBuyVolume += isBuy ? shareAmount : 0n
                currentBlockStats.shareSellVolume += isBuy ? 0n : shareAmount
                currentBlockStats.subjectEthTotal += subjectEthAmount
                currentBlockStats.protocolEthTotal += protocolEthAmount

                allTimeStats.trades += 1
                allTimeStats.ethVolume += ethAmount
                allTimeStats.ethBuyVolume += isBuy ? ethAmount : 0n
                allTimeStats.ethSellVolume += isBuy ? 0n : ethAmount
                allTimeStats.shareVolume += shareAmount
                allTimeStats.shareBuyVolume += isBuy ? shareAmount : 0n
                allTimeStats.shareSellVolume += isBuy ? 0n : shareAmount
                allTimeStats.subjectEthTotal += subjectEthAmount
                allTimeStats.protocolEthTotal += protocolEthAmount


            }
        }

        currentBlockStats.numInvolvedSubjects = involvedSubjects.size
        blockStats.push(currentBlockStats)
    }

    const subjectIds = new Set(trades.map(t => t.subject))
    const subjects: Map<string, Subject> = await ctx.store.findBy(Subject, {address: In([...subjectIds])}).then(subjs => new Map(subjs.map(s => [s.address, s])))
    for (let trade of trades) {
        if (subjects.has(trade.subject)) {
            const tradeSubject = subjects.get(trade.subject)!
            updateSubject(tradeSubject, trade)
        }
        else {
            subjects.set(trade.subject, getInitialSubject(trade))
            allTimeStats.numSubjects += 1
        }
    }

    await ctx.store.upsert(trades)
    await ctx.store.upsert([...subjects.values()])
    await ctx.store.upsert(blockStats)
    await ctx.store.upsert([allTimeStats])
})

function getInitialBlockStats(blockHeader: Block) {
    return new BlockStats({
        id: `${blockHeader.height}`,
        block: blockHeader.height,
        trades: 0,
        ethVolume: 0n,
        ethBuyVolume: 0n,
        ethSellVolume: 0n,
        shareVolume: 0n,
        shareBuyVolume: 0n,
        shareSellVolume: 0n,
        subjectEthTotal: 0n,
        protocolEthTotal: 0n
    })
}

function getInitialAllTimeStats() {
    return new AllTimeStats({
        id: '0',
        trades: 0,
        numSubjects: 0,
        ethVolume: 0n,
        ethBuyVolume: 0n,
        ethSellVolume: 0n,
        shareVolume: 0n,
        shareBuyVolume: 0n,
        shareSellVolume: 0n,
        subjectEthTotal: 0n,
        protocolEthTotal: 0n
    })
}

function getInitialSubject(t: Trade): Subject {
    const s = new Subject({
        id: t.subject,
        address: t.subject,
        firstTradeBlock: t.block,
        supply: t.supply,
        totalTrades: 1,
        totalEthVolume: t.ethAmount,
        totalShareVolume: t.shareAmount,
        subjectEthTotal: t.subjectEthAmount,
    })

    if (t.isBuy) {
        s.totalEthBuyVolume = t.ethAmount
        s.totalEthSellVolume = 0n
        s.totalShareBuyVolume = t.shareAmount
        s.totalShareSellVolume = 0n
    }
    else {
        s.totalEthBuyVolume = 0n
        s.totalEthSellVolume = t.ethAmount
        s.totalShareBuyVolume = 0n
        s.totalShareSellVolume = t.shareAmount
    }
    if (t.subject===t.trader) {
        s.ownShareVolume = t.shareAmount
        if (t.isBuy) {
            s.ownShareBought = t.shareAmount
            s.ownShareSold = 0n
            s.ethPaidForOwnShare = t.ethAmount
            s.ethReceivedForOwnShare = 0n
            s.ownShareTradingProfit = -t.ethAmount
            s.ultimateSubjectProfit = t.subjectEthAmount - t.ethAmount
        }
        else {
            console.error(`A sell triggered a subject creation`, t)
            process.exit(1)
        }
    }
    else {
        console.error(`Trade involving non-own shares triggered a subject creation`, t)
        process.exit(1)
    }

    return s
}

function updateSubject(s: Subject, t: Trade): void {
    s.supply = t.supply
    s.totalTrades += 1
    s.totalEthVolume += t.ethAmount
    s.totalShareVolume += t.shareAmount
    s.subjectEthTotal += t.subjectEthAmount

    if (t.isBuy) {
        s.totalEthBuyVolume += t.ethAmount
        s.totalShareBuyVolume += t.shareAmount
    }
    else {
        s.totalEthSellVolume += t.ethAmount
        s.totalShareSellVolume += t.shareAmount
    }
    if (t.subject===t.trader) {
        s.ownShareVolume += t.shareAmount
        if (t.isBuy) {
            s.ownShareBought += t.shareAmount
            s.ethPaidForOwnShare += t.ethAmount
        }
        else {
            s.ownShareSold += t.shareAmount
            s.ethReceivedForOwnShare += t.ethAmount - t.subjectEthAmount - t.protocolEthAmount
        }
        s.ownShareTradingProfit = s.ethReceivedForOwnShare - s.ethPaidForOwnShare
        s.ultimateSubjectProfit = s.subjectEthTotal + s.ownShareTradingProfit
    }
}
