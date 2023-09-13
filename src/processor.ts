import {lookupArchive} from '@subsquid/archive-registry'
import {
    BlockHeader,
    DataHandlerContext,
    EvmBatchProcessor,
    EvmBatchProcessorFields,
    Log as _Log,
    Transaction as _Transaction,
} from '@subsquid/evm-processor'
import * as friendTechAbi from './abi/friendTechAbi'
import { assertNotNull } from '@subsquid/util-internal'

export const FRIENDTECH_CONTRACT = '0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4'.toLowerCase()

export const processor = new EvmBatchProcessor()
    .setDataSource({
        archive: lookupArchive('base-mainnet'),
        chain: {
            url: assertNotNull(process.env.RPC_BASE_HTTP),
            rateLimit: 10,
        }
    })
    .setFinalityConfirmation(75)
    .setBlockRange({
        from: 2_430_440,
    })
    .addLog({
        address: [FRIENDTECH_CONTRACT],
        topic0: [friendTechAbi.events.Trade.topic],
    })
    .setFields({
        log: {
            transactionHash: true,
        },
    })

export type Fields = EvmBatchProcessorFields<typeof processor>
export type Block = BlockHeader<Fields>
export type Log = _Log<Fields>
export type Transaction = _Transaction<Fields>
export type ProcessorContext<Store> = DataHandlerContext<Store, Fields>
