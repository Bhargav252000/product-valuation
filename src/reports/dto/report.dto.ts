import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id: number;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  model: string;

  @Expose()
  make: string;

  @Expose()
  lat: number;

  @Expose()
  lng: number;

  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  // UserId is not defined in the Entity but can be applied in the DTO
  // As we dont want to send the whole User Entity to the client
  // we will add UserId property in the DTO

  // Pull out the whole Report Object and fetch the id from the User Part and attach it to the userId
  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
