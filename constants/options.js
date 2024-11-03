export const SelectTravelerList=[
    {
        id:1,
        title:"Just Me",
        desc:"Traveling alone",
        icon:'✈️',
        people:'1 person'
    },
    {
        id:2,
        title:"A Couple",
        desc:"Traveling with partner",
        icon:'👫',
        people:'2 people'
    },
    {
        id:3,
        title:"Family",
        desc:"Traveling with family",
        icon:'👨‍👩‍👧‍👦',
        people:'3 to 5 people'
    },
    {
        id:4,
        title:"Friends",
        desc:"Traveling with friends",
        icon:'🫂',
        people:'6 to 10 people'
    }
]

export const SelectBudgetOptions=[
    {
        id:1,
        title:"Thrifty",
        desc:"Budget friendly",
        icon:'💰',
        budget:'$'
    },
    {
        id:2,
        title:"Moderate",
        desc:"Average budget",
        icon:'💵',
        budget:'$$'
    },
    {
        id:3,
        title:"Luxury",
        desc:"High budget",
        icon:'💳',
        budget:'$$$'
    }
]

export const AI_PROMPT='Generate Travel Plan for Location: {location}, for {totalDays} Days and {totalNight} Night for {traveler} with a {budget} budget with a Flight details, Flight Price(in RM) with Booking url, Hotels options list with HotelName, Hotel address, Price(in RM), hotel image url, geo coordinates, rating descriptions and Places to visit nearby with placename, Place Details, Place Image URL, GEO Coordinates, ticket Pricing(real in RM), Time to travel each of the location for {totalDays} days and {totalNight} night with each day plan with best time to visit in JSON format.'