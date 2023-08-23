import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class Trade {
    constructor(props?: Partial<Trade>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    block!: number

    @Index_()
    @Column_("text", {nullable: false})
    trader!: string

    @Index_()
    @Column_("text", {nullable: false})
    subject!: string

    @Column_("bool", {nullable: false})
    isBuy!: boolean

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    shareAmount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    ethAmount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    protocolEthAmount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    subjectEthAmount!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    supply!: bigint

    @Index_()
    @Column_("text", {nullable: false})
    txnHash!: string
}
