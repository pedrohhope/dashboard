import { IsString, IsNotEmpty, IsNumber, IsArray, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @IsNumber()
    @Type(() => Number)
    @IsNotEmpty()
    price: number;

    @IsArray()
    @IsMongoId({ each: true })
    @IsNotEmpty()
    categoryIds: string[];

    @IsString()
    @IsNotEmpty()
    imageUrl: string;
}
