-- CreateTable
CREATE TABLE "OverrideRule" (
    "id" SERIAL NOT NULL,
    "template" TEXT NOT NULL,
    "userName" TEXT,
    "date" TEXT,

    CONSTRAINT "OverrideRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsLog" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" BIGINT NOT NULL,
    "username" TEXT NOT NULL,
    "rawValue" TEXT NOT NULL,
    "finalResult" TEXT NOT NULL,
    "wasOverride" BOOLEAN NOT NULL,
    "ruleIdUsed" INTEGER,

    CONSTRAINT "AnalyticsLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OverrideRule_userName_date_key" ON "OverrideRule"("userName", "date");
