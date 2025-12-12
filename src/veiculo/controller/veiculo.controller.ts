import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Post, Query } from "@nestjs/common";
import { VeiculoService } from "../service/veiculo.service";
import { Veiculo } from "../entities/veiculo.entity";


@Controller('/veiculo')
export class VeiculoController {

  constructor(private readonly veiculoService: VeiculoService) { }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Veiculo[]> {
    return this.veiculoService.findAll();
  }

  @Post()
  async create(
    @Body() veiculo: Veiculo,
    @Query('contratoId') contratoId: string
  ) {
    const id = Number(contratoId);
    return this.veiculoService.createVeiculo(veiculo, id);
  }

  @Delete('/id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.veiculoService.delete(id);
  }
}