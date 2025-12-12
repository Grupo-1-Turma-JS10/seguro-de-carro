import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm"
import { Veiculo } from "../entities/veiculo.entity"; 
import { ContratoService } from "../../contrato/service/contrato.service";

@Injectable()
export class VeiculoService {
    constructor(
        
        @InjectRepository(Veiculo)
        private veiculoRepository: Repository<Veiculo>,
        private contratoService: ContratoService
    ){}

    async findAll(): Promise<Veiculo[]> {
        let veiculos: Veiculo[] = [];

        try {
            veiculos = await this.veiculoRepository.find();
        } catch (error) {
            console.error('Error fetching vehicles:', error.message);
            throw new InternalServerErrorException('Error fetching vehicles.');
        }

        if (veiculos.length === 0) {
            console.log('No vehicles found.');
        }

        return veiculos;
    }


  async createVeiculo(veiculoData: Veiculo, contratoId: number): Promise<Veiculo> {
    
    const contrato = await this.contratoService.getContratosById(contratoId)
    if (!contrato) {
      throw new NotFoundException(`Contrato com id ${contratoId} não encontrado`);
    }

    
    const anoFabricacao = new Date(veiculoData.data_fabricacao).getFullYear();
    const idadeVeiculo = new Date().getFullYear() - anoFabricacao;

    
    if (idadeVeiculo > 10) {
      veiculoData.valor_fipe = Number((veiculoData.valor_fipe * 0.8).toFixed(2));
    }

   
    veiculoData.contrato = contrato;

    
    const veiculo = this.veiculoRepository.create(veiculoData);
    return await this.veiculoRepository.save(veiculo);
  }


}
