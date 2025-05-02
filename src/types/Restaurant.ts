export type Restaurant = {
    lat: number
    lon: number
    tags?: {
      name?: string
      "addr:housenumber"?: string
      "addr:street"?: string
      "addr:city"?: string
      [key: string]: string | undefined
    }
}