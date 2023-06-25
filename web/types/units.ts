export interface IUnitLocation {
    X: number
    Y: number
  }
  
export enum UnitType {
  Army = "A",
  Fleet = "F"
}

export interface IUnit {
  province: string
  unitType: UnitType
}
