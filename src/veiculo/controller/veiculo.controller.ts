import { Controller } from "@nestjs/common";
import { VeiculoService } from "../service/veiculo.service";

@Controller('veiculo') 
export class VeiculoController {
    constructor(private readonly veiculoService: VeiculoService) {}
}