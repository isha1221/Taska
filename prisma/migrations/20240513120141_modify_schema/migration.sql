/*
  Warnings:

  - You are about to drop the column `task` on the `Task` table. All the data in the column will be lost.
  - You are about to drop the column `completedTasks` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `numberOfMilestones` on the `User` table. All the data in the column will be lost.
  - Added the required column `taskDescription` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskTitle` to the `Task` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inTimeCompletedTask` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `milestonesAchieved` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `overTimecompletedTask` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendingTask` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rank` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Task_userId_key";

-- AlterTable
ALTER TABLE "Task" DROP COLUMN "task",
ADD COLUMN     "completedTime" TIMESTAMP(3),
ADD COLUMN     "taskDescription" TEXT NOT NULL,
ADD COLUMN     "taskTitle" TEXT NOT NULL,
ALTER COLUMN "startTime" DROP NOT NULL,
ALTER COLUMN "endTime" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "completedTasks",
DROP COLUMN "numberOfMilestones",
ADD COLUMN     "inTimeCompletedTask" INTEGER NOT NULL,
ADD COLUMN     "milestonesAchieved" INTEGER NOT NULL,
ADD COLUMN     "overTimecompletedTask" INTEGER NOT NULL,
ADD COLUMN     "pendingTask" INTEGER NOT NULL,
ADD COLUMN     "rank" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
