export const GetPhotoRef = async (place_name) => {
    try {
        const response = await fetch(
            `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(place_name)}&key=${process.env.GOOGLE_MAPS_API_KEY}`
        );
        const result = await response.json();
        
        if (result.results && result.results[0] && result.results[0].photos) {
            return result.results[0].photos[0].photo_reference;
        }
        return null;
    } catch (error) {
        console.error('Error in GetPhotoRef:', error);
        return null;
    }
}