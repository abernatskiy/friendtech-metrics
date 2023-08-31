module.exports = class Data1693492520799 {
    name = 'Data1693492520799'

    async up(db) {
        await db.query(`CREATE TABLE "trade" ("id" character varying NOT NULL, "block" integer NOT NULL, "trader" text NOT NULL, "subject" text NOT NULL, "is_buy" boolean NOT NULL, "share_amount" numeric NOT NULL, "eth_amount" numeric NOT NULL, "protocol_eth_amount" numeric NOT NULL, "subject_eth_amount" numeric NOT NULL, "supply" numeric NOT NULL, "txn_hash" text NOT NULL, CONSTRAINT "PK_d4097908741dc408f8274ebdc53" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_c4d177ef22a72a103adb206ab7" ON "trade" ("block") `)
        await db.query(`CREATE INDEX "IDX_8782e523050ad117640677be17" ON "trade" ("trader") `)
        await db.query(`CREATE INDEX "IDX_9e00c3c01798dce17b45421f76" ON "trade" ("subject") `)
        await db.query(`CREATE INDEX "IDX_d2201e8e0ddcb79dc9df0b7380" ON "trade" ("txn_hash") `)
        await db.query(`CREATE TABLE "subject" ("id" character varying NOT NULL, "address" text NOT NULL, "first_trade_block" integer NOT NULL, "supply" numeric NOT NULL, "total_trades" integer NOT NULL, "total_eth_volume" numeric NOT NULL, "total_eth_buy_volume" numeric NOT NULL, "total_eth_sell_volume" numeric NOT NULL, "total_share_volume" numeric NOT NULL, "total_share_buy_volume" numeric NOT NULL, "total_share_sell_volume" numeric NOT NULL, "subject_eth_total" numeric NOT NULL, CONSTRAINT "PK_12eee115462e38d62e5455fc054" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_24a18e0dc5d06d8b516d99688f" ON "subject" ("address") `)
        await db.query(`CREATE INDEX "IDX_36e946cd07407f62c658f2669d" ON "subject" ("first_trade_block") `)
        await db.query(`CREATE TABLE "block_stats" ("id" character varying NOT NULL, "block" integer NOT NULL, "trades" integer NOT NULL, "num_involved_subjects" integer NOT NULL, "eth_volume" numeric NOT NULL, "eth_buy_volume" numeric NOT NULL, "eth_sell_volume" numeric NOT NULL, "share_volume" numeric NOT NULL, "share_buy_volume" numeric NOT NULL, "share_sell_volume" numeric NOT NULL, "subject_eth_total" numeric NOT NULL, "protocol_eth_total" numeric NOT NULL, CONSTRAINT "PK_2e5ab1b4d3ee438a1ce2b7cbba3" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_f16be6bd07f58fbf10d88d91cf" ON "block_stats" ("block") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "trade"`)
        await db.query(`DROP INDEX "public"."IDX_c4d177ef22a72a103adb206ab7"`)
        await db.query(`DROP INDEX "public"."IDX_8782e523050ad117640677be17"`)
        await db.query(`DROP INDEX "public"."IDX_9e00c3c01798dce17b45421f76"`)
        await db.query(`DROP INDEX "public"."IDX_d2201e8e0ddcb79dc9df0b7380"`)
        await db.query(`DROP TABLE "subject"`)
        await db.query(`DROP INDEX "public"."IDX_24a18e0dc5d06d8b516d99688f"`)
        await db.query(`DROP INDEX "public"."IDX_36e946cd07407f62c658f2669d"`)
        await db.query(`DROP TABLE "block_stats"`)
        await db.query(`DROP INDEX "public"."IDX_f16be6bd07f58fbf10d88d91cf"`)
    }
}
