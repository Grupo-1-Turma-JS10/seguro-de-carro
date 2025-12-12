import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Contrato } from "../../contrato/entities/contrato.entity";

@Entity({ name: "tb_veiculos" })
export class Veiculo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  marca: string;

  @Column()
  modelo: string;

  @Column()
  ano: number;

  @Column()
  placa: string;

  @Column("decimal", { precision: 10, scale: 2 })
  valor_fipe: number;

  @Column({ type: "date", nullable: true })
  data_fabricacao: Date;

  @ManyToOne(() => Contrato, contrato => contrato.veiculos, { onDelete: "CASCADE" })
  @JoinColumn({ name: "contratoId" })
  contrato: Contrato;
}
