import { IsArray, IsDate, IsNumber, IsOptional, IsString } from "class-validator"

export class CreateOrderDto {
    @IsArray()
    productIds: string[]

    @IsString()
    date: string

    @IsNumber()
    total: number
}
