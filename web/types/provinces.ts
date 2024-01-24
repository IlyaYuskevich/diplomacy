import { signal } from '@preact/signals'

export enum ProvinceType {
    Coast = 'COAST',
    Land = 'LAND',
    Sea = 'SEA',
}

export interface IProvince {
    name: string,
    type: ProvinceType
}

export const provincesMap = signal<Record<string, IProvince> | null>(null)