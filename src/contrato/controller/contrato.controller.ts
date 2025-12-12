import { Body, Controller, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post } from "@nestjs/common";
import { ContratoService } from "../service/contrato.service";
import { Contrato } from "../entities/contrato.entity";
import { plainToInstance } from "class-transformer";

@Controller("/contrato")
export class ContratoController {
  constructor(private readonly contratoService: ContratoService) {}

  @Post()
  async create(@Body() contrato: Contrato) {
    const saved = await this.contratoService.createContrato(contrato);
    return plainToInstance(Contrato, saved);
  }

    

    @Get('/:id')
    getContratosById(@Param('id', ParseIntPipe) id: number): Promise<Contrato> {
        return this.contratoService.getContratosById(id);
    }

    @Get('/documento/:documento')
    getContratosByDocumento(@Param('documento') documento: string): Promise<Contrato> {
        return this.contratoService.getContratosByDocumento(documento);
    }


    @Get() 
    @HttpCode(HttpStatus.OK) 
    findAll(): Promise<Contrato[]> {
        return this.contratoService.findAll();
    }
}

