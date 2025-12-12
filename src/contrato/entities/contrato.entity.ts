import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Veiculo } from "../../veiculo/entities/veiculo.entity";

@Entity({ name: "tb_contratos" })
export class Contrato {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  cpf_cnpj: string;

  @Column({ type: "date" })
  data_nascimento: Date;

  @Column()
  endereco: string;

  @Column()
  email: string;

  @Column()
  telefone: string;

  @Column({ type: "date" })
  data_inicio: Date;

  @Column({ type: "date" })
  data_fim: Date;

  @Column("decimal", { precision: 10, scale: 2 })
  valor: number;

  @Column()
  status: string;

  @Column()
  cobertura: string;

  @OneToMany(() => Veiculo, veiculo => veiculo.contrato, { cascade: true, eager: true })
  veiculos: Veiculo[];

  @CreateDateColumn()
  data_criacao: Date;

  @UpdateDateColumn()
  data_atualizacao: Date;
}

