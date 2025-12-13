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
import { VeiculoService } from '../service/veiculo.service';
import { Veiculo } from '../entities/veiculo.entity';

@Controller('/veiculo')
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) { }

  @Post()
  async create(@Body() veiculo: Veiculo): Promise<Veiculo> {
    return this.veiculoService.createVeiculo(veiculo);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Veiculo[]> {
    return this.veiculoService.findAll();
  }

  @Get('/:id')
  getVeiculoById(@Param('id', ParseIntPipe) id: number): Promise<Veiculo> {
    return this.veiculoService.getVeiculoById(id);
  }

  @Get('/cpf-cnpj/:documento')
  getVeiculoByDocumento(@Param('documento') documento: string): Promise<Veiculo[]> {
    return this.veiculoService.getVeiculoByDocumento(documento);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() veiculo: Veiculo): Promise<Veiculo> {
    return this.veiculoService.update(veiculo);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.veiculoService.delete(id);
  }
}
