import { Controller, Delete, HttpCode, HttpStatus, Param, ParseIntPipe } from "@nestjs/common";
import { VeiculoService } from "../service/veiculo.service";

@Controller('veiculo') 
export class VeiculoController {
    constructor(private readonly veiculoService: VeiculoService) {}
































































   @Delete('/id')
   @HttpCode(HttpStatus.NO_CONTENT)
   async delete(@Param('id',ParseIntPipe) id:number) {
    await this.veiculoService.delete(id);
   }
}
   
   
   
   