export const MakeId = (length)=>{
    let result=""
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
    const charLength = characters.length

    for(let i= 0 ; i<length ; i+=1){
        result+=characters.charAt(Math.floor(Math.random()*charLength))
    }

    return result
}