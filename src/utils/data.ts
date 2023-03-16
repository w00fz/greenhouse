// Note: there are several CSS animation thta match this speed, so you should update
//       those as well if changing this value
export const GAME_SPEED: number = 3000;

export const initialData: DataType = {
  day: 1,
  germination: {
    trays: [],
  },
  production: [
    {
      name: "Pond 1",
      rafts: [],
    },
    {
      name: "Pond 2",
      rafts: [],
    },
    {
      name: "Pond 3",
      rafts: [],
    },
  ],
};

export const varieties: Array<VarietyType> = [
  {
    id: "1",
    name: "Romaine Lettuce",
    actions: [
      {
        type: "transplant",
        day: 10,
      },
      {
        type: "harvest",
        day: 30,
      },
    ],
  },
  {
    id: "2",
    name: "Butterhead Lettuce",
    actions: [
      {
        type: "transplant",
        day: 14,
      },
      {
        type: "harvest",
        day: 38,
      },
    ],
  },
  {
    id: "3",
    name: "Rocket Lettuce",
    actions: [
      {
        type: "transplant",
        day: 3,
      },
      {
        type: "harvest",
        day: 21,
      },
    ],
  },
];

export class ProductionRaft {
  capacity: number = 48;
  plants: number = 0;

  get open(): number {
    return this.capacity - this.plants;
  }
}

export class GerminationTray {
  capacity: number = 276;
  plants: number = 0;
  variety: VarietyType;

  constructor(variety: VarietyType) {
    this.variety = variety;
  }

  get open() {
    return this.capacity - this.plants;
  }

  get name() {
    return this.variety.name;
  }
}

/* Types */

export type DataType = {
  day: number;
  germination: {
    trays: Array<GerminationTray>;
  };

  production: Array<ProductionType>;
};

export type ProductionType = {
  name: string;
  rafts: Array<ProductionRaft>;
};

export type VarietyActionType = {
  type: "transplant" | "harvest";
  day: number;
};

export type VarietyType = {
  id: string;
  name: string;
  actions: Array<VarietyActionType>;
};
