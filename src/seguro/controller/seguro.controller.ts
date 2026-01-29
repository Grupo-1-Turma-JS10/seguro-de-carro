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
import { SeguroService } from '../service/seguro.service';
import { Seguro } from '../entities/seguro.entity';

@Controller('/seguro')
export class SeguroController {
  constructor(private readonly seguroService: SeguroService) {}

  @Post()
  async create(@Body() seguro: Seguro) {
    return await this.seguroService.createSeguro(seguro);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Seguro[]> {
    return this.seguroService.findAll();
  }

  @Get('/:id')
  getSegurosById(@Param('id', ParseIntPipe) id: number): Promise<Seguro> {
    return this.seguroService.getSegurosById(id);
  }

  @Get('status/:status')
  getSegurosByStatus(@Param('status') status: string): Promise<Seguro[]> {
    return this.seguroService.getSegurosByStatus(status);
  }

  @Get('/cobertura/:tipo')
  getSegurosByCobertura(@Param('tipo') tipo: string): Promise<Seguro[]> {
    return this.seguroService.getSegurosByCobertura(tipo);
  }

  @Get('/veiculo/:id')
  getSegurosByVeiculoId(@Param('id', ParseIntPipe) id: number): Promise<Seguro[]> {
    return this.seguroService.getSegurosByVeiculoId(id);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() seguro: Seguro): Promise<Seguro> {
    return this.seguroService.update(seguro);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.seguroService.delete(id);
  }

  @Post('/:seguroId/veiculo/:veiculoId')
  async adicionarVeiculoAoSeguro(
    @Param('seguroId', ParseIntPipe) seguroId: number,
    @Param('veiculoId', ParseIntPipe) veiculoId: number
  ): Promise<Seguro> {
    return this.seguroService.adicionarVeiculoAoSeguro(seguroId, veiculoId);
  }

  @Delete('/:seguroId/veiculo/:veiculoId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removerVeiculoDoSeguro(
    @Param('seguroId', ParseIntPipe) seguroId: number,
    @Param('veiculoId', ParseIntPipe) veiculoId: number
  ) {
    await this.seguroService.removerVeiculoDoSeguro(seguroId, veiculoId);
  }
}
