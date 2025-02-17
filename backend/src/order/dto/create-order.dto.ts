import { IsArray, IsNumber } from "class-validator"

export class CreateOrderDto {
    @IsArray()
    productIds: string[]

    @IsNumber()
    total: number
}
