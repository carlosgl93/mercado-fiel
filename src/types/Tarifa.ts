export type TarifaFront = {
  id: number;
  dayName: string;
  price: string | null;
};

export type TarifaBack = {
  id: number;
  day_name: string;
  price: string | null;
};
