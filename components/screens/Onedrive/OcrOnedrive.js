
const sendOnedriveOcr = async (uri) =>{
    try {
        console.log("aaaaaaaaaaaaaaaaaa")
      
         const response = await axios.get("https://appsyncroniza-production.up.railway.app/user/api/callback")
     
    
      
   console.log("eeeeeeeeeeeeeeeeee", response.data.token)
     if (response.data.token === true){
       
            const user_name = await AsyncStorage.getItem("name");
         const email = await AsyncStorage.getItem("email");
        
         const currentDate = new Date();
         const day = String(currentDate.getDate()).padStart(2, "0"); // Día del mes con dos dígitos
         const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Mes (0 - 11) con dos dígitos
         const year = String(currentDate.getFullYear()).slice(2); // Año con dos dígitos
         const hours = String(currentDate.getHours()).padStart(2, "0"); // Hora con dos dígitos
         const minutes = String(currentDate.getMinutes()).padStart(2, "0"); // Minutos con dos dígitos
   
         const nom_img = `${user_name}_${day}${month}${year}_${hours}${minutes}.jpg`;
   
         const formData = new FormData();
         formData.append("imagen", {
           uri: uri,
           type: "image/jpeg",
           name: nom_img,
         });
         formData.append("user", user_name);
         // formData.append("token",response.data.token)
   
   
         // webViewRef.current.stopLoading();
      
       const send = await axios.post("https://appsyncroniza-production.up.railway.app/user/api/dashboard",formData,{
         headers: {
                     "Content-Type": "multipart/form-data",
         }
       })
     }else{
       console.log("no estas logueado correctamente")
     }
      } catch (error) {
       console.log(error)
      }
}

export default sendOnedriveOcr