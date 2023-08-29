import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class VolumeByBlock {
    constructor(props?: Partial<VolumeByBlock>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("int4", {nullable: false})
    block!: number

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    totalEthAmount!: bigint
}
