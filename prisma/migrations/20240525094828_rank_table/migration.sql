-- CreateTable
CREATE TABLE "RankData" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "rank" INTEGER NOT NULL,
    "week" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RankData_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RankData" ADD CONSTRAINT "RankData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
