const getCityFromCoordinates = async (latitude: number, longitude: number) => {
	const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
	const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`;
  
	try {
	  const response = await fetch(url);
	  if (!response.ok) {
		throw new Error("Erreur lors de l'appel à l'API");
	  }
  
	  const data = await response.json();
  
	  if (data.status === "OK") {
		// Parcourez les résultats pour trouver la ville
		const city = data.results.find((result: any) =>
		  result.types.includes("locality")
		)?.address_components.find((component: any) =>
		  component.types.includes("locality")
		)?.long_name;
  
		return city || "Ville non trouvée";
	  } else {
		throw new Error(data.error_message || "Erreur inconnue");
	  }
	} catch (error) {
	  console.error("Erreur : ", error);
	  return "Erreur lors de la récupération de la ville";
	}
  };
  
export default getCityFromCoordinates;