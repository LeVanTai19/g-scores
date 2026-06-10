import { IsString, Length, Matches } from 'class-validator';

export class SearchScoreDto {
    @IsString({ message: 'The registration number must be a string of characters.'})
    @Length(8, 8, { message: 'The registration number must have exactly 8 digits.'})
    @Matches(/^[0-9]+$/, { message: 'The registration number must contain only digits.'})
    sbd: string;
}