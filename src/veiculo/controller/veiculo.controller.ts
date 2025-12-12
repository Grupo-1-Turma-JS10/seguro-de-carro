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