import { Delete, Injectable } from "@nestjs/common";
import { VeiculoService } from "../../veiculo/service/veiculo.service";
import { DeleteResult } from "typeorm";

@Injectable()
export class ContratoService {

   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
   
    async delete(id: number): Promise<DeleteResult> {
        console.log(`Contrato com ID ${id}, excluido.`)

        try {
            const contrato = await this.findById(id);
            const result = await this.contratoService.delete(contrato.id)

            return result;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            console.error(`Erro ao excluir contrato com ID ${id}: ${error.message}.`)
            throw new InternalServerErrorException('Erro ao excluir contrato.');
        }
    }
}
