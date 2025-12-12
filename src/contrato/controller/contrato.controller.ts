import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { ContratoService } from '../service/contrato.service';
import { Contrato } from '../entities/contrato.entity';
import { plainToInstance } from 'class-transformer';

@Controller('/contrato')
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
  getContratosByDocumento(
    @Param('documento') documento: string,
  ): Promise<Contrato> {
    return this.contratoService.getContratosByDocumento(documento);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Contrato[]> {
    return this.contratoService.findAll();
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() contrato: Contrato): Promise<Contrato> {
    return this.contratoService.update(contrato);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.contratoService.delete(id);
  }
}
