-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT (uuid()),
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" INTEGER NOT NULL DEFAULT (unixepoch())
);
