import { useState, useEffect } from "react"
import { Autocomplete, TextField, CircularProgress } from "@mui/material"
import { NominatimResult } from "@/types/Nominatim"

export default function LocationSearch({ onSelect }: { onSelect: (coords: { lat: number, lon: number }) => void }) {
  const [input, setInput] = useState("")
  const [options, setOptions] = useState<NominatimResult[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (input.length < 3) return
    const timeout = setTimeout(() => {
        setLoading(true)
        fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&limit=5&countrycodes=us&accept-language=en`
        )
            .then(res => res.json())
            .then(data => {
            setOptions(data)
            setLoading(false)
            })
    }, 300)
    return () => clearTimeout(timeout)
  }, [input])

    return (
        <Autocomplete
            getOptionLabel={(option) => option.display_name || ""}
            options={options}
            loading={loading}
            onInputChange={(_, value) => setInput(value)}
            onChange={(_, value) => {
                if (value) {
                onSelect({ lat: parseFloat(value.lat), lon: parseFloat(value.lon) })
                }
            }}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Search Location"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                        <>
                            {loading && <CircularProgress size={18} />}
                            {params.InputProps.endAdornment}
                        </>
                        ),
                    }}
                    helperText="For best results, avoid entering street numbers or abbreviations"
                />
            )}
        />
    )
}