import {TypeormDatabase} from '@subsquid/typeorm-store'
import {In} from 'typeorm'

import {Trade, Subject, BlockStats} from './model'
import {processor, FRIENDTECH_CONTRACT} from './processor'
import * as friendTechAbi from './abi/friendTechAbi'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const trades: Trade[] = []
    const blockStats: BlockStats[] = []

    for (let block of ctx.blocks) {
        let involvedSubjects: Set<string> = new Set()
        let currentBlockStats: BlockStats = new BlockStats({
            id: `${block.header.height}`,
            block: block.header.height,
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
            tradeSubject.supply = trade.supply
            tradeSubject.totalTrades += 1
            tradeSubject.totalEthVolume += trade.ethAmount,
            tradeSubject.totalEthBuyVolume += trade.isBuy ? trade.ethAmount : 0n,
            tradeSubject.totalEthSellVolume += trade.isBuy ? 0n : trade.ethAmount,
            tradeSubject.totalShareVolume += trade.shareAmount,
            tradeSubject.totalShareBuyVolume += trade.isBuy ? trade.shareAmount : 0n,
            tradeSubject.totalShareSellVolume += trade.isBuy ? 0n : trade.shareAmount,
            tradeSubject.subjectEthTotal += trade.subjectEthAmount
        }
        else {
            subjects.set(trade.subject, new Subject({
                id: trade.subject,
                address: trade.subject,
                firstTradeBlock: trade.block,
                supply: trade.supply,
                totalTrades: 1,
                totalEthVolume: trade.ethAmount,
                totalEthBuyVolume: trade.isBuy ? trade.ethAmount : 0n,
                totalEthSellVolume: trade.isBuy ? 0n : trade.ethAmount,
                totalShareVolume: trade.shareAmount,
                totalShareBuyVolume: trade.isBuy ? trade.shareAmount : 0n,
                totalShareSellVolume: trade.isBuy ? 0n : trade.shareAmount,
                subjectEthTotal: trade.subjectEthAmount
            }))
        }
    }

    await ctx.store.upsert(trades)
    await ctx.store.upsert([...subjects.values()])
    await ctx.store.upsert(blockStats)
})
