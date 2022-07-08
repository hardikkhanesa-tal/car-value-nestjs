import { Entity,Column,PrimaryGeneratedColumn, AfterInsert,AfterRemove,AfterUpdate, OneToMany } from "typeorm";
import { Report } from "src/reports/report.entity";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToMany(()=> Report,(report)=> report.user)
    reports: Report[]

    @Column({ default: true})
    admin: boolean;
    
    @AfterInsert()
    logInsert(){
        console.log("Insterted usr with id ",this.id);
    }

    @AfterUpdate()
    logUpdate(){
        console.log("update user with id",this.id);
    }

    @AfterRemove()
    logRemove()
    {
        console.log("Removed user with id",this.id);
    }
}