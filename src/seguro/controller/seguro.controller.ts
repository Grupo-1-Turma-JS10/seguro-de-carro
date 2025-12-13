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
}
