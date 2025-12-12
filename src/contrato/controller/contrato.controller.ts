import { Body, Controller, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ContratoService } from '../service/contrato.service';
import { Contrato } from '../entities/contrato.entity';

@Controller('/contrato')
export class ContratoController {
  constructor(private readonly contratoService: ContratoService) {
    @Put()
    @HttpCode(HttpStatus.OK)
    update(@Body() contrato: Contrato): Promise<Contrato> {
      return this.contratoService.update(contrato);
    }
  }
}
