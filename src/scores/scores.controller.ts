import { Controller, Get, Param } from '@nestjs/common';
import { ScoresService } from './scores.service';
import { SearchScoreDto } from './dto/search-score.dto'; // Import DTO

@Controller('api/scores')

export class ScoresController {
    // Tính chất DI của Nestjs, tiêm ScoresService vào constructor để xài
    constructor(private readonly scoresService: ScoresService) {} 

    // route: GET /api/scores/top/group-a (đặt trên get sbd để tránh Nest hiểu nhầm 'top/group-a' là sbd và báo lỗi 404)
    @Get('top/group-a')
    getTop10() {
        return this.scoresService.getTop10GroupA();
    }

    // route: GET /api/scores/report/statistics
    @Get('report/statistics')
    getReport() {
        return this.scoresService.getScoreReport();
    }


    // route: GET /api/scores/:sbd
    @Get(':sbd')
    getScoreBySbd(@Param() params: SearchScoreDto ) {
        return this.scoresService.findBySbd(params.sbd); // param truyền vào phải qua ktra của DTO, an toàn rồi mới xuống service
    }

}
