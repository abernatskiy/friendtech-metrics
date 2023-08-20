module.exports = class Data1692544143860 {
    name = 'Data1692544143860'

    async up(db) {
        await db.query(`CREATE TABLE "trade" ("id" character varying NOT NULL, "block" integer NOT NULL, "trader" text NOT NULL, "subject" text NOT NULL, "is_buy" boolean NOT NULL, "share_amount" numeric NOT NULL, "eth_amount" numeric NOT NULL, "protocol_eth_amount" numeric NOT NULL, "subject_eth_amount" numeric NOT NULL, "supply" numeric NOT NULL, "txn_hash" text NOT NULL, CONSTRAINT "PK_d4097908741dc408f8274ebdc53" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_8782e523050ad117640677be17" ON "trade" ("trader") `)
        await db.query(`CREATE INDEX "IDX_9e00c3c01798dce17b45421f76" ON "trade" ("subject") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "trade"`)
        await db.query(`DROP INDEX "public"."IDX_8782e523050ad117640677be17"`)
        await db.query(`DROP INDEX "public"."IDX_9e00c3c01798dce17b45421f76"`)
    }
}
