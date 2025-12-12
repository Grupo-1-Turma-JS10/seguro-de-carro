import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { DeleteResult } from "typeorm";
import { Veiculo } from "../entities/veiculo.entity";

@Injectable()
export class VeiculoService {
}






























































async delete(id: number): Promise<DeleteResult> {
    console.log(`Veiculo com ID ${id}, excluido.`)
    
    try{
        const veiculo = await this.findById(id);
        const result = await this.VeiculoService.delete(veiculo.id)
         
         return result;
    } catch(error) {
        if (error instanceof NotFoundException) {
            throw error;
        }
        console.error(`Erro ao excluir veículo com ID ${id}: ${error.message}.`)
        throw new InternalServerErrorException('Erro ao excluir veiculo.');
    }
}

