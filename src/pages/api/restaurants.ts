import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { coords, cuisine, radius } = req.body

  if (!coords || !cuisine || !radius) {
    return res.status(400).json({ error: "Missing parameters" })
  }

  const { lat, lon } = coords

  const query = `
    [out:json];
    node
      ["amenity"="restaurant"]
      ["cuisine"~"${cuisine}",i]
      (around:${radius},${lat},${lon});
    out;
  `

  const response = await fetch("https://overpass-api.de/api/interpreter", {
    method: "POST",
    body: new URLSearchParams({ data: query }),
  });

  const data = await response.json()
  const results = data.elements || []
  const random = results[Math.floor(Math.random() * results.length)] || null
  res.status(200).json(random)
}