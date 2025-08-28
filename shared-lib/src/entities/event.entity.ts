import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from "typeorm";
import { EventAcknowledgment } from "./event-acknowledgment.entity";
import { User } from "./user.entity";
import { Base } from "./base.entity";

@Entity("events")
export class Event extends Base {
  @Column()
  title: string;

  @Column("text")
  description: string;

  @Column()
  mediaPath: string;

  @Column()
  creatorId: string;

  @ManyToOne(() => User, { onDelete: "CASCADE" })
  @JoinColumn({ name: "creatorId" })
  creator: User;

  @OneToMany(
    () => EventAcknowledgment,
    (acknowledgment) => acknowledgment.event
  )
  acknowledgments: EventAcknowledgment[];
}
