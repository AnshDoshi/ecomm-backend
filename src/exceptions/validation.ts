import { HttpException } from "./root";

export class UnprocessEntity extends HttpException{
    constructor(error:any,message:string,errorCode:number){
        super(message,errorCode,422,error)
    }
}