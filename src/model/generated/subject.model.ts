import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Subject {
    constructor(props?: Partial<Subject>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    address!: string

    @Index_()
    @Column_("int4", {nullable: false})
    firstTradeBlock!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    supply!: bigint

    @Column_("int4", {nullable: false})
    totalTrades!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalEthVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalEthBuyVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalEthSellVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalShareVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalShareBuyVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalShareSellVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    subjectEthTotal!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ownShareVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ownShareBought!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ownShareSold!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ethPaidForOwnShare!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ethReceivedForOwnShare!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ownShareTradingProfit!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ultimateSubjectProfit!: bigint
}
