import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class AllTimeStats {
    constructor(props?: Partial<AllTimeStats>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("int4", {nullable: false})
    trades!: number

    @Column_("int4", {nullable: false})
    numSubjects!: number

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
