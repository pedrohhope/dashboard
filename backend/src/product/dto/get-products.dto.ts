import { IsNumber, IsOptional, IsString } from "class-validator";


export class GetProductsDto {
    @IsNumber()
    page: number;

    @IsNumber()
    limit: number;

    @IsString()
    @IsOptional()
    search?: string;
}