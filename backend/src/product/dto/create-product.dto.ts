import { IsString, IsNotEmpty, IsNumber, IsArray, IsMongoId } from 'class-validator';
import { Transform, Type } from 'class-transformer';

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

    @IsMongoId({ each: true })
    @IsNotEmpty()
    @IsArray()
    categoryIds: string[];
}
