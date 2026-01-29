import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, ILike, Repository } from 'typeorm';
import { Seguro } from '../entities/seguro.entity';
import { VeiculoService } from '../../veiculo/service/veiculo.service';

@Injectable()
export class SeguroService {
  private readonly DESCONTO_PERCENTUAL = 20;
  private readonly VALOR_SEGURO_POR_COBERTURA = {
    'basica': 2000,
    'intermediaria': 3500,
    'completa': 5000,
  }
  private readonly status = {
    'ativo': 'ativo',
    'inativo': 'inativo',
  }
  private readonly logger = new Logger(SeguroService.name);

  constructor(
    @InjectRepository(Seguro)
    private seguroRepository: Repository<Seguro>,
    private veiculoService: VeiculoService
  ) { }

  async createSeguro(seguro: Seguro): Promise<Seguro> {
    this.logger.log(`Criando novo seguro (categoria).`);
    this.validarSeguro(seguro);

    try {
      seguro.status = seguro.status || this.status.ativo;
      const seguroSalvo = await this.seguroRepository.save(seguro);
      this.logger.log(`Seguro criado com ID: ${seguroSalvo.id}`);
      return seguroSalvo;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Erro ao criar seguro`, error.stack);
      throw new InternalServerErrorException('Erro ao criar seguro.');
    }
  }

  async findAll(): Promise<Seguro[]> {
    let seguros: Seguro[] = [];

    try {
      seguros = await this.seguroRepository.find({
        relations: { veiculos: true },
      });

      this.logger.log(`Seguros encontrados: ${seguros.length}`);
    } catch (error) {
      this.logger.error('Erro ao buscar seguros', error.stack);
      throw new InternalServerErrorException('Erro ao buscar seguros.');
    }

    if (seguros.length === 0) {
      this.logger.log('Nenhum seguro encontrado.');
    }

    return seguros;
  }

  async getSegurosById(id: number): Promise<Seguro> {
    this.logger.log(`Buscando seguro com ID: ${id}`);

    let seguro: Seguro | null = null;
    try {
      seguro = await this.seguroRepository.findOne({
        where: { id },
        relations: { veiculos: true },
      });

      if (!seguro) {
        this.logger.error(`Seguro com ID: ${id} não encontrado.`);
        throw new NotFoundException(`Seguro com ID ${id} não encontrado.`);
      }

      this.logger.log(`Seguro encontrado: ID ${seguro.id}`);
      return seguro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar seguro com ID: ${id}`, error.stack);
      throw new InternalServerErrorException(
        'Erro ao buscar seguro pelo ID.',
      );
    }
  }

  async getSegurosByStatus(status: string): Promise<Seguro[]> {
    this.logger.log(`Buscando seguros com status: ${status}`);

    let seguros: Seguro[];
    try {
      seguros = await this.seguroRepository.find({
        where: { status: ILike(`%${status}%`) },
        relations: { veiculos: true },
      });

      this.logger.log(`Seguros encontrados com status: ${seguros.length}`);
      return seguros;
    } catch (error) {
      this.logger.error(`Erro ao buscar seguros com status: ${status}`, error.stack);
      throw new InternalServerErrorException(
        'Erro ao buscar seguros pelo status.',
      );
    }
  }

  async getSegurosByCobertura(tipo: string): Promise<Seguro[]> {
    this.logger.log(`Buscando seguros com cobertura: ${tipo}`);

    let seguros: Seguro[];
    try {
      seguros = await this.seguroRepository.find({
        where: { cobertura: ILike(`%${tipo}%`) },
        relations: { veiculos: true },
      });

      this.logger.log(`Seguros encontrados com cobertura: ${seguros.length}`);
      return seguros;
    } catch (error) {
      this.logger.error(`Erro ao buscar seguros com cobertura: ${tipo}`, error.stack);
      throw new InternalServerErrorException(
        'Erro ao buscar seguros pela cobertura.',
      );
    }
  }

  async getSegurosByVeiculoId(veiculoId: number): Promise<Seguro[]> {
    this.logger.log(`Buscando seguros para veículo ID: ${veiculoId}`);

    let seguros: Seguro[];
    try {
      // Verificar se o veículo existe
      await this.veiculoService.getVeiculoById(veiculoId);
      
      seguros = await this.seguroRepository
        .createQueryBuilder('seguro')
        .leftJoinAndSelect('seguro.veiculos', 'veiculos')
        .where('veiculos.id = :veiculoId', { veiculoId })
        .getMany();

      this.logger.log(`Seguros encontrados para veículo ID ${veiculoId}: ${seguros.length}`);
      return seguros;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Erro ao buscar seguros para veículo ID: ${veiculoId}`, error.stack);
      throw new InternalServerErrorException(
        'Erro ao buscar seguros pelo ID do veículo.',
      );
    }
  }

  async update(seguro: Seguro): Promise<Seguro> {
    this.logger.log(`Atualizando seguro com ID: ${seguro.id}`);

    try {
      await this.getSegurosById(seguro.id);
      this.validarSeguroUpdate(seguro);

      const seguroAtualizado = await this.seguroRepository.save(seguro);
      this.logger.log(`Seguro atualizado: ID ${seguroAtualizado.id}`);
      return seguroAtualizado;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof HttpException) {
        throw error;
      }

      this.logger.error(`Erro ao atualizar seguro com ID: ${seguro.id}`, error.stack);
      throw new InternalServerErrorException('Erro ao atualizar seguro.');
    }
  }

  async delete(id: number): Promise<DeleteResult> {
    this.logger.log(`Excluindo seguro com ID: ${id}`);
    try {
      await this.getSegurosById(id);

      const result = await this.seguroRepository.delete(id);

      this.logger.log(`Seguro excluído: ID ${id}`);
      return result;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      this.logger.error(`Erro ao excluir seguro com ID ${id}: ${error.message}.`);
      throw new InternalServerErrorException('Erro ao excluir seguro.');
    }
  }

  async adicionarVeiculoAoSeguro(seguroId: number, veiculoId: number): Promise<Seguro> {
    this.logger.log(`Adicionando veículo ID ${veiculoId} ao seguro ID ${seguroId}`);
    
    try {
      const seguro = await this.getSegurosById(seguroId);
      const veiculo = await this.veiculoService.getVeiculoById(veiculoId);

      // Calcular idade do veículo
      const anoAtual = new Date().getFullYear();
      const idadeVeiculo = anoAtual - veiculo.ano;
      this.logger.log(`Veículo ID ${veiculoId} tem ${idadeVeiculo} anos`);

      // Evitar duplicatas
      if (!seguro.veiculos) {
        seguro.veiculos = [];
      }
      
      const veiculoJaAdicionado = seguro.veiculos.some(v => v.id === veiculoId);
      if (!veiculoJaAdicionado) {
        // Aplicar desconto de 20% se o veículo tiver mais de 10 anos
        if (idadeVeiculo > 10) {
          const desconto = seguro.valor * 0.20;
          const valorComDesconto = seguro.valor - desconto;
          
          this.logger.log(`Aplicando desconto de 20% ao seguro. Valor original: ${seguro.valor}, Desconto: ${desconto}, Novo valor: ${valorComDesconto}`);
          
          veiculo.valor_final_seguro = Number(valorComDesconto.toFixed(2));
          veiculo.desconto = Number(desconto.toFixed(2));
        } else {
          // Sem desconto para veículos com 10 anos ou menos
          veiculo.valor_final_seguro = Number(seguro.valor.toFixed(2));
          veiculo.desconto = 0;
        }
        
        // Salvar o veículo com os valores de seguro atualizados
        await this.veiculoService.update(veiculo);
        
        // Recarregar o veículo com os dados salvos
        const veiculoAtualizado = await this.veiculoService.getVeiculoById(veiculoId);
        
        // Adicionar o veículo atualizado ao seguro e salvar
        seguro.veiculos.push(veiculoAtualizado);
        await this.seguroRepository.save(seguro);
      }

      // Retornar o seguro com a relação carregada
      const seguroFinal = await this.getSegurosById(seguroId);
      this.logger.log(`Veículo ID ${veiculoId} adicionado ao seguro ID ${seguroId}`);
      return seguroFinal;
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof HttpException) {
        throw error;
      }
      
      this.logger.error(`Erro ao adicionar veículo ao seguro`, error.stack);
      throw new InternalServerErrorException('Erro ao adicionar veículo ao seguro.');
    }
  }

  async removerVeiculoDoSeguro(seguroId: number, veiculoId: number): Promise<Seguro> {
    this.logger.log(`Removendo veículo ID ${veiculoId} do seguro ID ${seguroId}`);
    
    try {
      const seguro = await this.getSegurosById(seguroId);
      
      if (seguro.veiculos) {
        seguro.veiculos = seguro.veiculos.filter(v => v.id !== veiculoId);
        await this.seguroRepository.save(seguro);
      }

      this.logger.log(`Veículo ID ${veiculoId} removido do seguro ID ${seguroId}`);
      return seguro;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.error(`Erro ao remover veículo do seguro`, error.stack);
      throw new InternalServerErrorException('Erro ao remover veículo do seguro.');
    }
  }

  validarSeguro(seguro: Seguro): void {
    this.logger.log(`Validando seguro.`);

    if (seguro.cobertura == null) {
      this.logger.error('Cobertura é obrigatória.');
      throw new HttpException('Cobertura é obrigatória.', HttpStatus.BAD_REQUEST);
    }

    if (!seguro.valor || seguro.valor <= 0) {
      this.logger.error('Valor é obrigatório e deve ser maior que zero.');
      throw new HttpException('Valor é obrigatório e deve ser maior que zero.', HttpStatus.BAD_REQUEST);
    }

    if (!seguro.franquia || seguro.franquia < 0) {
      this.logger.error('Franquia é obrigatória e não pode ser negativa.');
      throw new HttpException('Franquia é obrigatória e não pode ser negativa.', HttpStatus.BAD_REQUEST);
    }
  }

  validarSeguroUpdate(seguro: Seguro): void {
    this.validarSeguro(seguro);
  }
}
