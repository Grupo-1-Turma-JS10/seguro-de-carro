<<<<<<< HEAD
import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common"; 
import { VeiculoService } from "../service/veiculo.service"; 
import { Veiculo } from "../entities/veiculo.entity"; 

@Controller('/veiculo') 
export class VeiculoController {
    constructor(private readonly veiculoService: VeiculoService) {}

    @Get() 
    @HttpCode(HttpStatus.OK) 
    findAll(): Promise<Veiculo[]> {
        return this.veiculoService.findAll();
    }
}
=======
import { Controller, Post, Body, Query } from "@nestjs/common";
import { VeiculoService } from "../service/veiculo.service";
import { Veiculo } from "../entities/veiculo.entity";

@Controller("veiculos")
export class VeiculoController {
  constructor(private readonly veiculoService: VeiculoService) {}

  @Post()
  async create(
    @Body() veiculo: Veiculo,
    @Query('contratoId') contratoId: string
  ) {
    const id = Number(contratoId);
    return this.veiculoService.createVeiculo(veiculo, id);
  }
}
>>>>>>> main
