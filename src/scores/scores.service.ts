import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { NotFoundError } from 'rxjs';

@Injectable()
export class ScoresService {
    private prisma = new PrismaClient();

    // --- Feature 1: Hàm tìm kiếm học sinh theo số báo danh ---
    async findBySbd(sbd: string) {

        const student = await this.prisma.student.findUnique({
            where: { sbd: sbd },
        });

        // Không tìm thấy sbd sẽ báo lỗi 404 Not Found
        if (!student) {
            throw new NotFoundException(`Không tìm thấy học sinh với số báo danh: ${sbd}`);
        }

        return student;
    }

    // --- Feature 2: Hàm lấy top 10 học sinh khối A theo tổng 3 môn (toán lý hóa) ---
    async getTop10GroupA() {
        const students = await this.prisma.student.findMany({

            where: {
                toan: { not: null },
                vat_ly: { not: null },
                hoa_hoc: { not: null },
            },
            
            select: {
                sbd: true,
                toan: true,
                vat_ly: true,
                hoa_hoc: true,
            },
        });

        // Tính tổng điểm 3 môn và sort thừ cao xuống thấp, lấy top 10
        const top10 = students
            .map((student) => ({
                sbd: student.sbd,
                toan: student.toan,
                vat_ly: student.vat_ly,
                hoa_hoc: student.hoa_hoc,

                totalScore: student.toan! + student.vat_ly! + student.hoa_hoc!,
            }))

            .sort((a, b) => b.totalScore - a.totalScore)
            .slice(0, 10);

        return top10;
    }
}
