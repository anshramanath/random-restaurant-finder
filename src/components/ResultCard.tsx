import { Card, CardContent, Typography, CardActions, Button } from "@mui/material"
import { Restaurant } from "@/types/Restaurant"

export default function ResultCard({ restaurant, cuisine }: { restaurant: Restaurant, cuisine: string }) {
    const tags = restaurant.tags || {}

    const address = [
        tags["addr:housenumber"],
        tags["addr:street"],
        tags["addr:city"]
    ]
        .filter(Boolean)
        .join(" ")

    return (
        <Card sx={{ mt: 4 }}>
            <CardContent>
                <Typography variant="h5">{tags.name || "Unnamed Restaurant"}</Typography>
                <Typography>Cuisine: {cuisine}</Typography>
                <Typography>
                    📍 {address || `${restaurant.lat}, ${restaurant.lon}`}
                </Typography>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    href={`https://www.google.com/maps/search/?api=1&query=${restaurant.lat},${restaurant.lon}`}
                    target="_blank"
                >
                View on Map
                </Button>
            </CardActions>
        </Card>
    )
}