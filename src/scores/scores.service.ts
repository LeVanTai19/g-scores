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
    
    // TỐI ƯU: lại tốc độ, dùng sql thuần để viết lệnh, giao nhiệm vụ tính tổng và sort cho Postgres 
    async getTop10GroupA() {
        const top10 = await this.prisma.$queryRaw<any[]>`

            SELECT sbd, toan, vat_ly, hoa_hoc, (toan + vat_ly + hoa_hoc) AS "totalScore"
            FROM "Student"
            WHERE toan IS NOT NULL AND
                  vat_ly IS NOT NULL AND
                  hoa_hoc IS NOT NULL
            ORDER BY "totalScore" DESC
            LIMIT 10;
        `;

        return top10.map(student =>({
            ...student,
            totalScore: Number(student.totalScore) // đảm bảo Posgres trả về kiểu số (đôi khi nó trả về chuỗi cho phép tính)
        }));
    }

    // --- Feature 3: Hàm thống kê phổ điểm tất cả các môn (>= 8 / 6 - 8 / 4 - 6 / <4) ---
    async getScoreReport() {

        const subjects = [
            'toan', 'van', 'ngoai_ngu', 
            'vat_ly', 'hoa_hoc', 'sinh_hoc', 
            'lich_su', 'dia_ly', 'gdcd'
        ]

        const report = {}; // object rỗng để lưu kết quả key- value thống kê

        for (const subject of subjects) {
            
            // Dùng promise.all để chạy song song 4 truy vấn, 
            // thay vì await từng truy vấn một sẽ lâu 
            const [level1, level2, level3, level4] = await Promise.all([

                // lv1: điểm >= 8
                this.prisma.student.count({ 
                    where: { [subject]: { gte: 8 } } as any,
                }),

                // lv2: điểm 6 - 8
                this.prisma.student.count({
                    where: { [subject]: { gte: 6, lt: 8} } as any,
                }),

                // lv3: điểm 4 - 6
                this.prisma.student.count({
                    where: { [subject]: { gte: 4, lt: 6} } as any,
                }),

                // lv4: điểm < 4
                this.prisma.student.count({
                    where: { [subject]: {lt: 4} } as any,
                }),
            ]);

            report[subject] = {
                '>=8': level1,
                '6-8': level2,
                '4-6': level3,
                '<4': level4,
            };
        }

        return report;
    }
}
