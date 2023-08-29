module.exports = class Data1693282513188 {
    name = 'Data1693282513188'

    async up(db) {
        await db.query(`CREATE TABLE "trade" ("id" character varying NOT NULL, "block" integer NOT NULL, "trader" text NOT NULL, "subject" text NOT NULL, "is_buy" boolean NOT NULL, "share_amount" numeric NOT NULL, "eth_amount" numeric NOT NULL, "protocol_eth_amount" numeric NOT NULL, "subject_eth_amount" numeric NOT NULL, "supply" numeric NOT NULL, "txn_hash" text NOT NULL, CONSTRAINT "PK_d4097908741dc408f8274ebdc53" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_c4d177ef22a72a103adb206ab7" ON "trade" ("block") `)
        await db.query(`CREATE INDEX "IDX_8782e523050ad117640677be17" ON "trade" ("trader") `)
        await db.query(`CREATE INDEX "IDX_9e00c3c01798dce17b45421f76" ON "trade" ("subject") `)
        await db.query(`CREATE INDEX "IDX_d2201e8e0ddcb79dc9df0b7380" ON "trade" ("txn_hash") `)
        await db.query(`CREATE TABLE "volume_by_block" ("id" character varying NOT NULL, "block" integer NOT NULL, "total_eth_amount" numeric NOT NULL, CONSTRAINT "PK_70e26abc9af55bbe0e6a58b5fe8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d5317241b3ce57016685d85c14" ON "volume_by_block" ("block") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "trade"`)
        await db.query(`DROP INDEX "public"."IDX_c4d177ef22a72a103adb206ab7"`)
        await db.query(`DROP INDEX "public"."IDX_8782e523050ad117640677be17"`)
        await db.query(`DROP INDEX "public"."IDX_9e00c3c01798dce17b45421f76"`)
        await db.query(`DROP INDEX "public"."IDX_d2201e8e0ddcb79dc9df0b7380"`)
        await db.query(`DROP TABLE "volume_by_block"`)
        await db.query(`DROP INDEX "public"."IDX_d5317241b3ce57016685d85c14"`)
    }
}
