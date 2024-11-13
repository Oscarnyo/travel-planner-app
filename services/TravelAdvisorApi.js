import { RAPID_API_KEY } from '@env'

const BASE_URL = 'https://travel-advisor.p.rapidapi.com'

export const searchNearbyHotels = async (latitude, longitude) => {
  try {
    console.log('Fetching hotels with coordinates:', { latitude, longitude }) // Debug log
    const response = await fetch(
      `${BASE_URL}/hotels/list-by-latlng?latitude=${latitude}&longitude=${longitude}&lang=en_US&hotel_class=1,2,3,4,5&limit=30&currency=USD`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
      }
    )
    const data = await response.json()
    console.log('API Response:', data) // Debug log
    return data
  } catch (error) {
    console.error('Error fetching nearby hotels:', error)
    return null
  }
}

export const getLocationDetails = async (locationId) => {
  try {
    console.log('Fetching details for location:', locationId)
    const response = await fetch(
      `${BASE_URL}/hotels/get-details?location_id=${locationId}&lang=en_US&currency=USD`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RAPID_API_KEY,
          'X-RapidAPI-Host': 'travel-advisor.p.rapidapi.com'
        }
      }
    )
    const data = await response.json()
    console.log('Location details response:', data)
    return data
  } catch (error) {
    console.error('Error fetching location details:', error)
    return null
  }
}