import { PrismaClient } from "@prisma/client";
import * as fs from 'fs';
import * as path from 'path';
import csv =  require('csv-parser');

const prisma = new PrismaClient();

// Hàm biến chuỗi điểm thành số, ô thi trống đổi thành null
const parseScore = (value: string | undefined) => {
    if (!value || value.trim() === '') return null;
    const num = parseFloat(value); 
    return isNaN(num) ? null : num; 
};

async function main() {
    console.log('Tiến hành đọc file csv và đẩy dữ liệu vào database...');

    const csvFilePath = path.join(__dirname, 'data', 'diem_thi_thpt_2024.csv');
    const BATCH_SIZE = 10000; // setup size cho mỗi batch insert (Bulk insert)
    let batch: any[] = [];
    let toltalInserted = 0; 

    return new Promise((resolve, reject) => {
        const stream = fs.createReadStream(csvFilePath) // dùng createReadStream để đọc file csv, để ko bị tràn ram
            .pipe(csv())
            .on('data', async (row) => {

                const student = {
                    sbd: row['sbd'], 
                    toan: parseScore(row['toan']),
                    van: parseScore(row['ngu_van']), 
                    ngoai_ngu: parseScore(row['ngoai_ngu']),
                    vat_ly: parseScore(row['vat_li']), 
                    hoa_hoc: parseScore(row['hoa_hoc']),
                    sinh_hoc: parseScore(row['sinh_hoc']),
                    lich_su: parseScore(row['lich_su']),
                    dia_ly: parseScore(row['dia_li']), 
                    gdcd: parseScore(row['gdcd']),
                };
                
                batch.push(student);

                if (batch.length >= BATCH_SIZE) {
                    stream.pause(); // tạm dừng stream 

                    try {
                        // bulk insert 10 000 students vào database
                        await prisma.student.createMany({ 
                            data: batch, 
                            skipDuplicates: true, // bỏ qua trùng lặp sbd
                        });

                        toltalInserted = toltalInserted + batch.length;
                        console.log(`Hiện đã chèn thành công ${toltalInserted} bản ghi...`);

                        batch = []; // reset batch sau khi insert xong
                        stream.resume(); // tiếp tục đọc file csv

                    } catch (error) {
                        console.error('Lỗi khi chèn dữ liệu:', error);
                        stream.destroy(); // dừng stream nếu có lỗi
                        reject(error); 
                    }
                }
            })

            .on('end', async () => {
                // chèn nốt số dữ liệu còn lại (mặc dù không đủ 10 000)
                if (batch.length > 0) {
                    await prisma.student.createMany({
                        data: batch,
                        skipDuplicates: true,
                    });

                    toltalInserted = toltalInserted + batch.length;
                }
                console.log(`Đã hoàn thành việc chèn dữ liệu. Tổng số bản ghi đã chèn: ${toltalInserted}`);
                resolve(true);
            })

            .on('error', (error) => {
                reject(error);
            });
    });
}

main()
    .catch((e) => {
        console.error('LỖI TOÀN CỤC:',e);
        process.exit(1);
    })

    .finally(async () => {
        await prisma.$disconnect(); // đóng kết nối Prisma sau khi hoàn thành seed dữ liệu
    });


