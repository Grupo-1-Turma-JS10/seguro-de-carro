import { 
    IsEmail, 
    IsNotEmpty, 
    IsPhoneNumber 
} from "class-validator";
import { 
    Column, 
    CreateDateColumn, 
    Entity, 
    OneToMany, 
    PrimaryGeneratedColumn, 
    UpdateDateColumn 
} from "typeorm";
import { Seguro } from "../../seguro/entities/seguro.entity";

@Entity({ name: "tb_veiculos" })
export class Veiculo {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty({ message: "O nome não pode estar vazio." })
    @Column({ length: 100, nullable: false })
    nome: string;

    @IsNotEmpty({ message: "O CPF/CNPJ não pode estar vazio." })
    @Column({ length: 14, nullable: false })
    cpf_cnpj: string;

    @IsNotEmpty({ message: "A data de nascimento não pode estar vazia." })
    @Column({ type: "date" })
    data_nascimento: Date;

    @IsNotEmpty({ message: "O endereço não pode estar vazio." })
    @Column({ length: 500, nullable: false })
    endereco: string;

    @IsNotEmpty({ message: "O email não pode estar vazio." })
    @IsEmail({}, { message: "O email deve ser válido." })
    @Column({ length: 100, nullable: false })
    email: string;

    @IsNotEmpty({ message: "O telefone não pode estar vazio." })
    @IsPhoneNumber("BR", { message: "O telefone deve ser válido." })
    @Column({ length: 15, nullable: false })
    telefone: string;

    @IsNotEmpty({ message: "A marca não pode estar vazia." })
    @Column({ length: 100, nullable: false })
    marca: string;

    @IsNotEmpty({ message: "O modelo não pode estar vazio." })
    @Column({ length: 100, nullable: false })
    modelo: string;

    @IsNotEmpty({ message: "O ano não pode estar vazio." })
    @Column({ type: "smallint", nullable: false })
    ano: number;

    @IsNotEmpty({ message: "A placa não pode estar vazia." })
    @Column({ length: 15, nullable: false, unique: true })
    placa: string;

    @CreateDateColumn()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    data_criacao: Date;

    @UpdateDateColumn()
    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    data_atualizacao: Date;

    @OneToMany(() => Seguro, seguro => seguro.veiculo)
    seguros: Seguro[];
}
