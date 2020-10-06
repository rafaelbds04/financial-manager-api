import { IsNumberString, IsDefined } from "class-validator";

export default class FindOneParams {
    @IsNumberString()
    @IsDefined()
    id: string
}