-- CreateTable
CREATE TABLE "Student" (
    "id" SERIAL NOT NULL,
    "sbd" TEXT NOT NULL,
    "toan" DOUBLE PRECISION,
    "van" DOUBLE PRECISION,
    "ngoai_ngu" DOUBLE PRECISION,
    "vat_ly" DOUBLE PRECISION,
    "hoa_hoc" DOUBLE PRECISION,
    "sinh_hoc" DOUBLE PRECISION,
    "lich_su" DOUBLE PRECISION,
    "dia_ly" DOUBLE PRECISION,
    "gdcd" DOUBLE PRECISION,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Student_sbd_key" ON "Student"("sbd");

-- CreateIndex
CREATE INDEX "Student_sbd_idx" ON "Student"("sbd");
