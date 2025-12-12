import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Veiculo } from "../entities/veiculo.entity";
import { Contrato } from "../../contrato/entities/contrato.entity";

@Injectable()
export class VeiculoService {
  constructor(
    @InjectRepository(Veiculo)
    private veiculoRepository: Repository<Veiculo>,

    @InjectRepository(Contrato)
    private contratoRepository: Repository<Contrato>,
  ) {}

  async createVeiculo(veiculoData: Veiculo, contratoId: number): Promise<Veiculo> {
    
    const contrato = await this.contratoRepository.findOne({ where: { id: contratoId } });
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

  async findAll(): Promise<Veiculo[]> {
    return this.veiculoRepository.find({ relations: ["contrato"] });
  }
}
