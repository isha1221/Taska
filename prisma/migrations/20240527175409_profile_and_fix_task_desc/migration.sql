-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "taskDescription" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profile" TEXT;
