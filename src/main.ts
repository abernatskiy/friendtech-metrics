import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Trade, VolumeByBlock} from './model'
import {processor, FRIENDTECH_CONTRACT} from './processor'
import * as friendTechAbi from './abi/friendTechAbi'

processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {
    const trades: Trade[] = []
    const volumes: VolumeByBlock[] = []

    for (let block of ctx.blocks) {
        let totalEthAmount = 0n

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

                totalEthAmount += ethAmount
            }
        }

        volumes.push(new VolumeByBlock({
            id: `${block.header.height}`,
            block: block.header.height,
            totalEthAmount
        }))
    }

    await ctx.store.upsert(trades)
    await ctx.store.upsert(volumes)
})
