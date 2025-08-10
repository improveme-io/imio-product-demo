-- CreateEnum
CREATE TYPE "Status" AS ENUM ('CREATING', 'REQUESTED', 'AUTHORING', 'PENDING', 'DONE');

-- CreateTable
CREATE TABLE "FeedbackRequest" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'CREATING',
    "title" TEXT,
    "paragraph" TEXT,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "FeedbackRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormSave" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "paragraph" TEXT,
    "deadline" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "feedbackRequestId" TEXT NOT NULL,

    CONSTRAINT "FormSave_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formSaveId" TEXT NOT NULL,

    CONSTRAINT "TempUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TempFeedbackItem" (
    "id" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "formSaveId" TEXT NOT NULL,

    CONSTRAINT "TempFeedbackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeedbackItem" (
    "id" TEXT NOT NULL,
    "prompt" TEXT,
    "payload" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "requestId" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "FeedbackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "clerkUserId" TEXT,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "profileImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FeedbackRequestToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_startedAuthors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_finishedAuthors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "FeedbackRequest_slug_key" ON "FeedbackRequest"("slug");

-- CreateIndex
CREATE INDEX "FeedbackRequest_ownerId_idx" ON "FeedbackRequest"("ownerId");

-- CreateIndex
CREATE INDEX "FeedbackRequest_slug_idx" ON "FeedbackRequest"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "FormSave_feedbackRequestId_key" ON "FormSave"("feedbackRequestId");

-- CreateIndex
CREATE INDEX "FormSave_feedbackRequestId_idx" ON "FormSave"("feedbackRequestId");

-- CreateIndex
CREATE INDEX "TempUser_formSaveId_idx" ON "TempUser"("formSaveId");

-- CreateIndex
CREATE INDEX "TempFeedbackItem_formSaveId_idx" ON "TempFeedbackItem"("formSaveId");

-- CreateIndex
CREATE INDEX "FeedbackItem_requestId_idx" ON "FeedbackItem"("requestId");

-- CreateIndex
CREATE INDEX "FeedbackItem_ownerId_idx" ON "FeedbackItem"("ownerId");

-- CreateIndex
CREATE INDEX "FeedbackItem_authorId_idx" ON "FeedbackItem"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_FeedbackRequestToUser_AB_unique" ON "_FeedbackRequestToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_FeedbackRequestToUser_B_index" ON "_FeedbackRequestToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_startedAuthors_AB_unique" ON "_startedAuthors"("A", "B");

-- CreateIndex
CREATE INDEX "_startedAuthors_B_index" ON "_startedAuthors"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_finishedAuthors_AB_unique" ON "_finishedAuthors"("A", "B");

-- CreateIndex
CREATE INDEX "_finishedAuthors_B_index" ON "_finishedAuthors"("B");

-- AddForeignKey
ALTER TABLE "FeedbackRequest" ADD CONSTRAINT "FeedbackRequest_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormSave" ADD CONSTRAINT "FormSave_feedbackRequestId_fkey" FOREIGN KEY ("feedbackRequestId") REFERENCES "FeedbackRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempUser" ADD CONSTRAINT "TempUser_formSaveId_fkey" FOREIGN KEY ("formSaveId") REFERENCES "FormSave"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TempFeedbackItem" ADD CONSTRAINT "TempFeedbackItem_formSaveId_fkey" FOREIGN KEY ("formSaveId") REFERENCES "FormSave"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackItem" ADD CONSTRAINT "FeedbackItem_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "FeedbackRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackItem" ADD CONSTRAINT "FeedbackItem_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FeedbackItem" ADD CONSTRAINT "FeedbackItem_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeedbackRequestToUser" ADD CONSTRAINT "_FeedbackRequestToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "FeedbackRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FeedbackRequestToUser" ADD CONSTRAINT "_FeedbackRequestToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_startedAuthors" ADD CONSTRAINT "_startedAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "FeedbackRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_startedAuthors" ADD CONSTRAINT "_startedAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_finishedAuthors" ADD CONSTRAINT "_finishedAuthors_A_fkey" FOREIGN KEY ("A") REFERENCES "FeedbackRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_finishedAuthors" ADD CONSTRAINT "_finishedAuthors_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
