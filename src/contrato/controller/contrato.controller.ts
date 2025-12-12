import { Controller, Delete, HttpCode, HttpStatus, ParseIntPipe } from "@nestjs/common";
import { ContratoService } from "../service/contrato.service";

@Controller('/contrato') 
export class ContratoController {
    constructor(private readonly contratoService: ContratoService) {}
































































  @Delete('/id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(Param('id',ParseIntPipe)id:number){
    await this.contratoService.delete(id);
  } 
    
}
   