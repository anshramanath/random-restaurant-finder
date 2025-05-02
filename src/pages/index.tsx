import { useState } from "react"
import { Container, Typography, TextField, Button, Box, Slider, Autocomplete, Switch, FormControlLabel, CircularProgress } from "@mui/material"
import { Restaurant } from "@/types/Restaurant"
import LocationSearch from "@/components/LocationSearch"
import ResultCard from "@/components/ResultCard"
import Head from "next/head"

const cuisineOptions = [
  "American", "BBQ", "Chinese", "French", "Greek", "Indian", "Italian",
  "Japanese", "Korean", "Mediterranean", "Mexican", "Thai", "Vietnamese", "Vegetarian"
]

export default function Home() {
  const [coords, setCoords] = useState<{ lat: number, lon: number } | null>(null)
  const [cuisine, setCuisine] = useState("")
  const [miles, setMiles] = useState(5)
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null)
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)


  const handleSearch = async () => {
    if (!coords || !cuisine) return

    setSearched(true)
    setLoading(true)

    const radius = miles * 1609.34

    try {
      const res = await fetch("/api/restaurants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coords, cuisine: cuisine.toLowerCase(), radius }),
      })

      const data = await res.json()

      if (!res.ok) {
        console.error("API error:", data.error)
        alert("Something went wrong. Please try again.")
        setRestaurant(null)
        setSearched(false)
        return
      }

      setRestaurant(data)
    } catch (err) {
      console.error("Error fetching restaurant:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Random Restaurant Finder</title>
        <link rel="icon" type="image/png" href="/dish.png" />
      </Head>
      
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Typography variant="h4" gutterBottom>🍽️ Random Restaurant Finder</Typography>

        <FormControlLabel
          control={
            <Switch
              checked={useCurrentLocation}
              onChange={(e) => {
                const checked = e.target.checked
                setUseCurrentLocation(checked)

                if (checked) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      const { latitude, longitude } = position.coords
                      setCoords({ lat: latitude, lon: longitude })
                    },
                    (err) => {
                      console.error(err);
                      alert("Failed to get location.")
                      setUseCurrentLocation(false)
                    }
                  );
                } else {
                  setCoords(null)
                }
              }}
            />
          }
          label="Use My Current Location"
        />


        <Autocomplete
          options={cuisineOptions}
          value={cuisine}
          onChange={(_, newValue) => setCuisine(newValue || "")}
          renderInput={(params) => (
            <TextField {...params} label="Select Cuisine" margin="normal" fullWidth />
          )}
        />

        {!(useCurrentLocation) &&
          <LocationSearch onSelect={setCoords} />
        }

        <Box mt={2} sx={{ width: "95%", mx: "auto" }}>
          <Typography gutterBottom>Search Radius (Miles)</Typography>
          <Slider
            value={miles}
            onChange={(_, value) => setMiles(value as number)}
            min={5}
            max={25}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>

        <Button
          variant="contained"
          onClick={handleSearch}
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading || !coords || !cuisine}
        >
          {restaurant ? "🎲 New Restaurant" : "🎲 Find Restaurant"}
        </Button>

        {loading &&
          <Box sx={{ display: "flex", justifyContent: "center", pt: 4 }}>
            <CircularProgress size={64} />
          </Box>
        }

        {(restaurant && !loading) ? (
          <>
            <ResultCard restaurant={restaurant} cuisine={cuisine} />

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 4, textAlign: "center" }}
            >
              🚨 The pin may not be placed exactly on the restaurant but will be very close. Try zooming in on the map to find it.
            </Typography>
          </>
        ) : (searched && !loading) ? (
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mt: 4, textAlign: "center" }}
          >
            😕 No restaurant found. Try a different cuisine or location.
          </Typography>
        ) : null}

      </Container>
    </>
  )
}