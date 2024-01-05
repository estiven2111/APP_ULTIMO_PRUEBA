import AsyncStorage from "@react-native-async-storage/async-storage";

const getTime = async () => {
    const user_name = await AsyncStorage.getItem("name");
    const email = await AsyncStorage.getItem("email");
    
    const currentDate = new Date();
    const day = String(currentDate.getDate()).padStart(2, "0"); // Día del mes con dos dígitos
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Mes (0 - 11) con dos dígitos
    const year = String(currentDate.getFullYear()).slice(2); // Año con dos dígitos
    const hours = String(currentDate.getHours()).padStart(2, "0"); // Hora con dos dígitos
    const minutes = String(currentDate.getMinutes()).padStart(2, "0"); // Minutos con dos dígitos

    const nom_img = `${day}${month}${year}_${hours}${minutes}`;
    console.log(nom_img);
    return nom_img;
 }

 export default getTime;