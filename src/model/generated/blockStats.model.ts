import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class BlockStats {
    constructor(props?: Partial<BlockStats>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    block!: number

    @Column_("int4", {nullable: false})
    trades!: number

    @Column_("int4", {nullable: false})
    numInvolvedSubjects!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ethVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ethBuyVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ethSellVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    shareVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    shareBuyVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    shareSellVolume!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    subjectEthTotal!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    protocolEthTotal!: bigint
}
