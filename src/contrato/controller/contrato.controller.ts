import { Controller, Get, Param, ParseIntPipe } from "@nestjs/common";
import { ContratoService } from "../service/contrato.service";
import { Contrato } from "../entities/contrato.entity";

@Controller('/contrato') 
export class ContratoController {
    constructor(private readonly contratoService: ContratoService) {}

    @Get('/:id')
    getContratosById(@Param('id', ParseIntPipe) id: number): Promise<Contrato> {
        return this.contratoService.getContratosById(id);
    }

    @Get('/documento/:documento')
    getContratosByDocumento(@Param('documento') documento: string): Promise<Contrato> {
        return this.contratoService.getContratosByDocumento(documento);
    }
}