-- CreateIndex
CREATE INDEX "Student_toan_vat_ly_hoa_hoc_idx" ON "Student"("toan", "vat_ly", "hoa_hoc");

-- CreateIndex
CREATE INDEX "Student_van_ngoai_ngu_sinh_hoc_lich_su_dia_ly_gdcd_idx" ON "Student"("van", "ngoai_ngu", "sinh_hoc", "lich_su", "dia_ly", "gdcd");
