import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm"
import { Veiculo } from "../entities/veiculo.entity"; 

@Injectable()
export class VeiculoService {
    constructor(
        
        @InjectRepository(Veiculo)
        private veiculoRepository: Repository<Veiculo>
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
}