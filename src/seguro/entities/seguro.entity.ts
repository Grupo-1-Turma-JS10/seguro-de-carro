import { 
    Entity, 
    PrimaryGeneratedColumn, 
    Column, CreateDateColumn, 
    UpdateDateColumn, 
    ManyToMany 
} from "typeorm";
import { Veiculo } from "../../veiculo/entities/veiculo.entity";
import { IsNotEmpty } from "class-validator";

@Entity({ name: "tb_seguros" })
export class Seguro {
    @PrimaryGeneratedColumn()
    id: number;
    
    @IsNotEmpty({ message: "O valor não pode estar vazio." })
    @Column("decimal", { precision: 10, scale: 2 })
    valor: number;

    @Column({ length: 50, nullable: false })
    status: string;

    @IsNotEmpty({ message: "A cobertura não pode estar vazia." })
    @Column({ length: 100, nullable: false })
    cobertura: string;

    @IsNotEmpty({ message: "A franquia não pode estar vazia." })
    @Column("decimal", { precision: 10, scale: 2 })
    franquia: number;

    @CreateDateColumn()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    data_criacao: Date;

    @UpdateDateColumn()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    data_atualizacao: Date;

    @ManyToMany(() => Veiculo, veiculo => veiculo.seguros, { onDelete: "CASCADE" })
    veiculos: Veiculo[];
}

